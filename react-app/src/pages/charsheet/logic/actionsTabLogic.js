import { getMod, getFinal, getPB } from './calculations.js';
import { installedRegistry } from '../../../adapters/index.js';
import { getWeaponProficiencyInfo, hasNonProficientArmor } from './proficiencies.js';

export const FILTERS = ['all', 'action', 'bonus', 'reaction'];
export const CAT_COLORS = { attack: '#de675f', action: '#caa550', bonus: '#70b7a6', reaction: '#9d7fb8' };
const EXECUTABLE_CATS = new Set(['attack', 'action', 'bonus', 'reaction']);
export const SECTION_DEFS = [
  { key: 'action', title: 'Actions', cats: ['action', 'attack'] },
  { key: 'bonus', title: 'Bonus Actions', cats: ['bonus'] },
  { key: 'reaction', title: 'Reactions', cats: ['reaction'] },
];

function resourceOwnerLevel(def, C) {
  return Number(def?.ownerLevel ?? C?.classLevel ?? C?.level ?? 1);
}

function resourceAbilityMods(C) {
  return {
    str: getMod(getFinal(C, 'str')),
    dex: getMod(getFinal(C, 'dex')),
    con: getMod(getFinal(C, 'con')),
    int: getMod(getFinal(C, 'int')),
    wis: getMod(getFinal(C, 'wis')),
    cha: getMod(getFinal(C, 'cha')),
  };
}

export function normalizeResourceMax(def, C = null) {
  const raw = def?.maxComputed ?? def?.max ?? 1;
  if (typeof raw === 'function') {
    try {
      const value = raw(resourceOwnerLevel(def, C), resourceAbilityMods(C), { character: C, resource: def });
      const n = Number(value);
      if (!Number.isFinite(n)) return value === Infinity ? Infinity : 1;
      return Math.max(0, Math.floor(n));
    } catch {
      return 1;
    }
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw === Infinity ? Infinity : 1;
  return Math.max(0, Math.floor(n));
}

function hasCondition(def, C) {
  if (typeof def?.condition !== 'function') return true;
  try { return !!def.condition(C); } catch { return false; }
}

function getClassEntities(C) {
  if (!C) return [];
  const out = [];
  if (C.className) {
    out.push({
      className: C.className,
      subclassShortName: C.subclassShortName || '',
      level: Number(C.classLevel || C.level || 1),
      ownerName: C.className,
    });
  }
  (C.extraClasses || []).forEach((extra) => {
    if (!extra?.name) return;
    out.push({
      className: extra.name,
      subclassShortName: extra.subclassShortName || '',
      level: Number(extra.level || 1),
      ownerName: extra.name,
    });
  });
  return out;
}

function selectedFeatNames(C) {
  return (C?.allFeatSnapshots || []).map((feat) => feat?.name).filter(Boolean);
}

function normActionKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function actionDedupeKey(item) {
  return [
    normActionKey(item.name || item.key || ''),
    normActionKey(item.resKey || ''),
    normActionKey(item.cat || ''),
    String(item.minLevel || ''),
  ].join('|');
}

function actionSpecificityScore(item) {
  let score = 0;
  if (!item?._runtimeFallback) score += 100;
  if (item?.desc) score += 10;
  if (item?.damageFormula || item?.healFormula || item?.attackBonus != null) score += 5;
  if (item?.ownerName && !/^(runtime|feat)$/i.test(String(item.ownerName))) score += 1;
  return score;
}

function uniqBySignature(items) {
  const byKey = new Map();

  items.forEach((item) => {
    const key = actionDedupeKey(item);
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, item);
      return;
    }

    // Prefer live registry data over serialized adapterRuntime fallback.
    if (actionSpecificityScore(item) > actionSpecificityScore(existing)) {
      byKey.set(key, item);
    }
  });

  return [...byKey.values()];
}

function hasExplicitActionText(action) {
  const cat = String(action?.cat || '').toLowerCase();
  const desc = String(action?.desc || '').toLowerCase();
  if (cat === 'reaction') return /\breaction\b/.test(desc);
  if (cat === 'bonus') return /\bbonus action\b/.test(desc);
  if (cat === 'action') return /\b(action|magic action)\b/.test(desc);
  return false;
}

function isExecutableAction(action) {
  const cat = String(action?.cat || '').toLowerCase();
  const uses = String(action?.uses || '').trim().toLowerCase();
  const desc = String(action?.desc || '').trim().toLowerCase();
  if (!EXECUTABLE_CATS.has(cat)) return false;
  if (/^on\b/.test(uses) && !action?.resKey) return false;
  if ((uses === 'passive' || /^passive\s*\(/.test(uses) || /^passive:/.test(desc)) && !hasExplicitActionText(action)) {
    return false;
  }
  return true;
}

export function resolveActionFormulas(action, C) {
  if (!action) return action;
  const ownerLv = action.ownerLevel ?? C?.classLevel ?? C?.level ?? 1;
  const ctx = { character: C, ownerLevel: ownerLv };
  const patch = {};

  if (typeof action.healFormula === 'function') patch.healFormula = action.healFormula(ctx);
  if (typeof action.damageFormula === 'function') patch.damageFormula = action.damageFormula(ctx);
  if (typeof action.damageButtonLabel === 'function') patch.damageButtonLabel = action.damageButtonLabel(ctx);
  if (Object.keys(patch).length) return { ...action, ...patch };

  return action;
}

export function collectAdapterActions(C) {
  const out = [];
  const pushFiltered = (arr, source, ownerLevel = C?.level ?? 1) => {
    (arr || []).forEach(a => {
      if (!a || !a.name) return;
      const lv = Number(a.ownerLevel ?? ownerLevel ?? C?.level ?? 1);
      if (a.minLevel && lv < Number(a.minLevel)) return;
      if (!hasCondition(a, C)) return;
      if (!isExecutableAction(a)) return;
      out.push({ ...a, ownerLevel: lv, ownerName: a.ownerName || source, _source: a.ownerName || source });
    });
  };

  // Prefer live registry data so function properties such as condition/max/formula survive
  // after the character has been serialized to localStorage.
  getClassEntities(C).forEach((entity) => {
    pushFiltered(installedRegistry.getClassSheetActions(entity.className), entity.ownerName, entity.level);
    if (entity.subclassShortName) {
      pushFiltered(
        installedRegistry.getSubclassSheetActions(entity.className, entity.subclassShortName),
        `${entity.subclassShortName} (${entity.className})`,
        entity.level,
      );
    }
  });
  if (C?.speciesName) {
    pushFiltered(installedRegistry.getSpeciesSheetActions(C.speciesName, C.speciesSource), C.speciesName, C.level || 1);
  }
  selectedFeatNames(C).forEach((featName) => {
    pushFiltered(installedRegistry.getFeatSheetActions(featName), featName, C.level || 1);
  });

  // Fallback for older exported characters that already contain adapterRuntime.
  // Serialized adapterRuntime loses function properties such as `condition`, so use it
  // only if the live registry produced nothing.
  if (!out.length) {
    const runtime = C?.adapterRuntime || {};
    pushFiltered((runtime.classActions || []).map((a) => ({ ...a, _runtimeFallback: true })), C?.className || '', C?.classLevel || C?.level || 1);
    pushFiltered((runtime.subclassActions || []).map((a) => ({ ...a, _runtimeFallback: true })), C?.subclassShortName ? `${C.subclassShortName} (${C.className})` : '', C?.classLevel || C?.level || 1);
    pushFiltered((runtime.speciesActions || []).map((a) => ({ ...a, _runtimeFallback: true })), C?.speciesName || '', C?.level || 1);
    pushFiltered((runtime.featActions || []).map((a) => ({ ...a, _runtimeFallback: true })), 'Feat', C?.level || 1);
  }

  return uniqBySignature(out);
}


function classLevel(C, className) {
  if (String(C?.className || '').toLowerCase() === String(className).toLowerCase()) return Number(C?.classLevel || C?.level || 1);
  const extra = (C?.extraClasses || []).find(ec => String(ec?.name || '').toLowerCase() === String(className).toLowerCase());
  return Number(extra?.level || 0);
}

function hasFeat(C, name) {
  return (C?.allFeatSnapshots || []).some(f => String(f?.name || '').toLowerCase() === String(name).toLowerCase());
}

function itemProps(item) {
  return [...(Array.isArray(item?.property) ? item.property : []), ...(Array.isArray(item?.properties) ? item.properties : [])]
    .map(p => String(p).toLowerCase());
}

function weaponAbility(C, item, weaponOverride) {
  if (weaponOverride?.ability) return weaponOverride.ability;
  const type = String(item?.type || '').toUpperCase();
  const overrides = installedRegistry.getWeaponAbilityOverrides();
  for (const o of overrides) {
    if (o.weaponTypes && !o.weaponTypes.includes(type)) continue;
    if (o.itemFlag && !(item?.flags || []).includes(o.itemFlag)) continue;
    if (typeof o.condition === 'function' && !o.condition(C)) continue;
    return o.ability;
  }
  const props = itemProps(item);
  const finesse = props.includes('f') || props.includes('fin') || props.includes('finesse');
  if (type === 'R') return 'dex';
  if (finesse) return getMod(getFinal(C, 'dex')) > getMod(getFinal(C, 'str')) ? 'dex' : 'str';
  return 'str';
}

function weaponDamageBase(item) {
  return item?.damage?.[0]?.damage || item?.dmg1 || item?.damageDice || item?.dmg || '';
}

function weaponDamageType(item) {
  return item?.damage?.[0]?.type || item?.dmgType || '';
}

export function makeWeaponActions(C, attacks, inventory) {
  const overrides = installedRegistry.getWeaponAbilityOverrides();
  const weaponActions = attacks.map((item, index) => {
    const weaponOverride = overrides.find(o => {
      const type = String(item?.type || '').toUpperCase();
      if (o.weaponTypes && !o.weaponTypes.includes(type)) return false;
      if (o.itemFlag && !(item?.flags || []).includes(o.itemFlag)) return false;
      if (typeof o.condition === 'function' && !o.condition(C)) return false;
      return true;
    });
    const profInfo = getWeaponProficiencyInfo(C, item, weaponOverride);
    const ability = weaponAbility(C, item, weaponOverride);
    const mod = getMod(getFinal(C, ability));
    const base = weaponDamageBase(item);
    const damageFormula = base ? `${base}${mod >= 0 ? '+' : ''}${mod}` : '';
    const dtype = weaponDamageType(item);
    const untrainedArmor = hasNonProficientArmor(C, inventory);
    const disAdv = untrainedArmor && (ability === 'str' || ability === 'dex');
    return {
      name: item.name || 'Weapon',
      cat: 'attack',
      uses: 'Equipped',
      _source: 'Weapon',
      attackBonus: profInfo.proficient ? getPB(C) + mod : mod,
      damageFormula,
      damageButtonLabel: damageFormula ? `Damage ${damageFormula}${dtype ? ` ${dtype}` : ''}` : 'Damage',
      rollLabelPrefix: item.name || 'Weapon',
      desc: `${String(ability).toUpperCase()} weapon attack.${dtype ? ` Damage type: ${dtype}.` : ''}${profInfo.proficient ? '' : ' Not proficient.'}${disAdv ? ' DIS (armor).' : ''}`,
      _weaponIndex: index,
      _notProficient: !profInfo.proficient,
      _disadvantage: disAdv,
    };
  });
  const monkLevel = classLevel(C, 'Monk');
  const useDexUnarmed = monkLevel > 0 && getMod(getFinal(C, 'dex')) > getMod(getFinal(C, 'str'));
  const ability = useDexUnarmed ? 'dex' : 'str';
  const mod = getMod(getFinal(C, ability));
  const die = monkLevel >= 17 ? '1d12' : monkLevel >= 11 ? '1d10' : monkLevel >= 5 ? '1d8' : monkLevel >= 1 ? '1d6' : hasFeat(C, 'Tavern Brawler') ? '1d4' : '1';
  weaponActions.push({
    name: 'Unarmed Strike',
    cat: 'attack',
    uses: monkLevel ? 'Martial Arts' : 'Attack',
    _source: 'Basic',
    attackBonus: getPB(C) + mod,
    damageFormula: `${die}${mod >= 0 ? '+' : ''}${mod}`,
    damageButtonLabel: `Damage ${die}${mod >= 0 ? '+' : ''}${mod} bludgeoning`,
    rollLabelPrefix: 'Unarmed Strike',
    desc: `${String(ability).toUpperCase()} attack. Damage: ${die} + ${String(ability).toUpperCase()} modifier bludgeoning.`,
  });
  return weaponActions;
}

export function resolveFormula(formula, action, C) {
  if (!formula) return '';
  if (typeof formula === 'function') return String(formula({ character: C, ownerLevel: action.ownerLevel ?? C?.classLevel ?? C?.level ?? 1 }) || '');
  return String(formula);
}

export function resolveButtonLabel(label, formula, action, C, fallback) {
  if (typeof label === 'function') return label({ formula, character: C, ownerLevel: action.ownerLevel ?? C?.classLevel ?? C?.level ?? 1 });
  return label || fallback;
}

export function rollFormula(formula) {
  const clean = String(formula || '').replace(/\s+/g, '');
  const diceRe = /([+-]?)(\d*)d(\d+)|([+-]?\d+)/gi;
  let total = 0;
  const rolls = [];
  let match;
  while ((match = diceRe.exec(clean))) {
    if (match[3]) {
      const sign = match[1] === '-' ? -1 : 1;
      const count = Number(match[2] || 1);
      const faces = Number(match[3]);
      for (let i = 0; i < count; i++) {
        const v = Math.floor(Math.random() * faces) + 1;
        rolls.push({ v, faces });
        total += sign * v;
      }
    } else if (match[4]) {
      total += Number(match[4]);
    }
  }
  return { total, rolls };
}
