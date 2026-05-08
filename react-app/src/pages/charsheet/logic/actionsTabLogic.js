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

export function normalizeResourceMax(def) {
  const raw = def?.maxComputed ?? def?.max ?? 1;
  if (typeof raw === 'function') return 1;
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw === Infinity ? Infinity : 1;
  return Math.max(0, Math.floor(n));
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
  const name = action.name;
  const allRaw = [];
  const classNames = [C?.className, ...(C?.extraClasses || []).map((e) => e.name)].filter(Boolean);
  classNames.forEach((cls) => {
    (installedRegistry.getClassSheetActions(cls) || []).forEach((a) => { if (a.name === name) allRaw.push(a); });
    (installedRegistry.getSubclassSheetActions(cls, C?.subclassShortName) || []).forEach((a) => { if (a.name === name) allRaw.push(a); });
  });
  (installedRegistry.getSpeciesSheetActions(C?.speciesName, C?.speciesSource) || []).forEach((a) => { if (a.name === name) allRaw.push(a); });
  const raw = allRaw[0];
  if (!raw) return action;
  const patch = {};
  if (typeof raw.healFormula === 'function') patch.healFormula = raw.healFormula(ctx);
  if (typeof raw.damageFormula === 'function') patch.damageFormula = raw.damageFormula(ctx);
  if (typeof raw.damageButtonLabel === 'function') patch.damageButtonLabel = raw.damageButtonLabel(ctx);
  return { ...action, ...patch };
}

export function collectAdapterActions(C) {
  const runtime = C?.adapterRuntime || {};
  const clsName = C?.className || '';
  const subName = C?.subclassShortName || '';
  const speciesName = C?.speciesName || '';
  const out = [];
  const pushFiltered = (arr, source) => {
    (arr || []).forEach(a => {
      if (!a || !a.name) return;
      const lv = Number(a.ownerLevel ?? C?.level ?? 1);
      if (a.minLevel && lv < Number(a.minLevel)) return;
      if (!isExecutableAction(a)) return;
      out.push({ ...a, _source: a.ownerName || source });
    });
  };
  pushFiltered(runtime.classActions, clsName);
  pushFiltered(runtime.subclassActions, `${subName} (${clsName})`);
  pushFiltered(runtime.speciesActions, speciesName);
  pushFiltered(runtime.featActions, 'Feat');
  return out;
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
