export const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
export const SLBL = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
export const FULL_LBL = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const CONDITION_OPTIONS = [
  { key: 'blinded', label: 'Blinded', icon: 'eye-off' },
  { key: 'charmed', label: 'Charmed', icon: 'heart' },
  { key: 'deafened', label: 'Deafened', icon: 'ear' },
  { key: 'frightened', label: 'Frightened', icon: 'ghost' },
  { key: 'grappled', label: 'Grappled', icon: 'hand' },
  { key: 'incapacitated', label: 'Incapacitated', icon: 'pause' },
  { key: 'invisible', label: 'Invisible', icon: 'circle-dashed' },
  { key: 'paralyzed', label: 'Paralyzed', icon: 'brain' },
  { key: 'petrified', label: 'Petrified', icon: 'mountain' },
  { key: 'poisoned', label: 'Poisoned', icon: 'flask-conical' },
  { key: 'prone', label: 'Prone', icon: 'arrow-down' },
  { key: 'restrained', label: 'Restrained', icon: 'link' },
  { key: 'stunned', label: 'Stunned', icon: 'zap' },
  { key: 'unconscious', label: 'Unconscious', icon: 'moon' },
  { key: 'exhaustion', label: 'Exhaustion', icon: 'battery-low' },
];

const DMGTYPE_LABELS = {
  fire: 'Fire',
  cold: 'Cold',
  lightning: 'Lightning',
  thunder: 'Thunder',
  acid: 'Acid',
  poison: 'Poison',
  psychic: 'Psychic',
  radiant: 'Radiant',
  necrotic: 'Necrotic',
  force: 'Force',
  bludgeoning: 'Bludgeoning',
  piercing: 'Piercing',
  slashing: 'Slashing',
};

export const SKILLS_LIST = [
  { n: 'Acrobatics', a: 'dex' },
  { n: 'Animal Handling', a: 'wis' },
  { n: 'Arcana', a: 'int' },
  { n: 'Athletics', a: 'str' },
  { n: 'Insight', a: 'wis' },
  { n: 'Sleight of Hand', a: 'dex' },
  { n: 'Stealth', a: 'dex' },
  { n: 'Investigation', a: 'int' },
  { n: 'Deception', a: 'cha' },
  { n: 'Perception', a: 'wis' },
  { n: 'Intimidation', a: 'cha' },
  { n: 'Medicine', a: 'wis' },
  { n: 'Nature', a: 'int' },
  { n: 'History', a: 'int' },
  { n: 'Performance', a: 'cha' },
  { n: 'Persuasion', a: 'cha' },
  { n: 'Religion', a: 'int' },
  { n: 'Survival', a: 'wis' },
];

function fbonus(n) {
  return (n >= 0 ? '+' : '') + n;
}

export function computeSaves() {
  const { getSaveBonus, hasSaveProficiency, _sheetHasNonProficientArmor, _sheetAdvFor } = window;
  if (typeof getSaveBonus !== 'function' || typeof hasSaveProficiency !== 'function') return [];

  const armorDis = typeof _sheetHasNonProficientArmor === 'function' && _sheetHasNonProficientArmor();

  return STATS.map((stat) => {
    const bonus = getSaveBonus(stat);
    const eAdv = typeof _sheetAdvFor === 'function'
      ? _sheetAdvFor({ target: 'save', ability: stat })
      : null;

    return {
      stat,
      shortLabel: SLBL[stat],
      fullLabel: FULL_LBL[stat],
      bonus,
      bonusText: fbonus(bonus),
      prof: hasSaveProficiency(stat),
      hasForcedDis: armorDis && (stat === 'str' || stat === 'dex'),
      eAdv,
    };
  });
}

export function rollSave(stat) {
  if (typeof window.rollSave === 'function') window.rollSave(stat);
}

export function computeSkills() {
  const {
    getSkillBonus,
    getSkillProficiency,
    _resolvedInventory,
    _sheetItemHasProperty,
    _sheetHasNonProficientArmor,
    _sheetClassEntities,
    _sheetGetClassRuntimeConfig,
    _sheetGetSubclassRuntimeConfig,
    _sheetAdvFor,
    skillAdv,
  } = window;

  if (typeof getSkillBonus !== 'function' || typeof getSkillProficiency !== 'function') return [];

  const inv = typeof _resolvedInventory === 'function' ? _resolvedInventory() : [];
  const equippedArmor = inv.find((i) => i.equipped && ['LA', 'MA', 'HA'].includes(i.type));
  const hasStealthDis = !!equippedArmor && (
    equippedArmor.type === 'HA' ||
    (typeof _sheetItemHasProperty === 'function' && _sheetItemHasProperty(equippedArmor, ['S', 'stealth', 'disadvantage']))
  );
  const armorTrainingDis = typeof _sheetHasNonProficientArmor === 'function' && _sheetHasNonProficientArmor();

  const isJoat = typeof _sheetClassEntities === 'function'
    && _sheetClassEntities().some((ent) => {
      const classMin = Number(_sheetGetClassRuntimeConfig?.(ent.className)?.skillRules?.jackOfAllTradesMinLevel || 0);
      const subMin = Number(_sheetGetSubclassRuntimeConfig?.(ent.className, ent.subclassShortName)?.skillRules?.jackOfAllTradesMinLevel || 0);
      return (classMin > 0 && ent.level >= classMin) || (subMin > 0 && ent.level >= subMin);
    });

  return SKILLS_LIST.map((sk) => {
    const bonus = getSkillBonus(sk);
    const ptype = getSkillProficiency(sk.n);
    const dotCls = ptype === 'exp'
      ? 'exp'
      : ptype === 'prof'
      ? 'prof'
      : isJoat && !ptype
      ? 'joat'
      : '';

    const userAdv = (skillAdv && skillAdv[sk.n]) || null;
    const armorDis = hasStealthDis && sk.n === 'Stealth';
    const trainingDis = armorTrainingDis && (sk.a === 'str' || sk.a === 'dex');
    const forcedDis = armorDis || trainingDis;

    const eAdvSkill = typeof _sheetAdvFor === 'function' ? _sheetAdvFor({ target: 'skill', skill: sk.n }) : null;
    const eAdvCheck = typeof _sheetAdvFor === 'function' ? _sheetAdvFor({ target: 'check', ability: sk.a }) : null;
    const eAdv = eAdvSkill || eAdvCheck;

    let baseAdv = userAdv;
    if (!baseAdv && eAdv === 'adv') baseAdv = 'adv';
    else if (!baseAdv && eAdv === 'disadv') baseAdv = 'disadv';
    const effectiveAdv = forcedDis ? (baseAdv === 'adv' ? '' : 'disadv') : (baseAdv || '');

    return {
      name: sk.n,
      ability: sk.a,
      abilityLabel: SLBL[sk.a],
      bonus,
      bonusText: fbonus(bonus),
      dotCls,
      userAdv,
      featureAdv: eAdv,
      armorDis,
      trainingDis,
      effectiveAdv,
    };
  });
}

export function rollSkill(name, bonus, effectiveAdv) {
  if (typeof window.rollSkill === 'function') {
    window.rollSkill(name, bonus, effectiveAdv);
  }
}

export function cycleSkillAdv(name) {
  if (typeof window.cycleSkillAdv === 'function') {
    window.cycleSkillAdv(name);
  }
}

function readJsonLs(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function readIntLs(key, fallback = 0) {
  const v = parseInt(localStorage.getItem(key) || '', 10);
  return Number.isFinite(v) ? v : fallback;
}

function getHitDieFaces() {
  const hd = window.C?.clsSnapshot?.hd;
  if (!hd) return 8;
  if (hd.faces) return hd.faces;
  if (Array.isArray(hd) && hd[0]?.faces) return hd[0].faces;
  return 8;
}

export function computeVitals() {
  const { calcMaxHP, C } = window;

  const currentHP = readIntLs('5e_hp_current', 0);
  const tempHP = readIntLs('5e_hp_temp', 0);
  const maxHPBonus = readIntLs('5e_hp_max_bonus', 0);
  const baseMax = typeof calcMaxHP === 'function' ? Number(calcMaxHP()) || 0 : 0;
  const maxHP = Math.max(1, baseMax + maxHPBonus);

  const ds = readJsonLs('5e_death_saves', { success: 0, fail: 0 }) || { success: 0, fail: 0 };
  const deathSuccess = Math.max(0, Math.min(3, Number(ds.success) || 0));
  const deathFail = Math.max(0, Math.min(3, Number(ds.fail) || 0));

  const total = Number(C?.level) || 0;
  const usedHD = readIntLs('5e_hd_used', 0);
  const remainingHD = Math.max(0, total - usedHD);
  const faces = getHitDieFaces();

  const pips = [];
  for (let i = 0; i < total; i += 1) {
    const used = i >= total - usedHD;
    pips.push({ used, title: `d${faces}` });
  }

  const maxBonusLabel = maxHPBonus
    ? `${maxHPBonus > 0 ? '+' : ''}${maxHPBonus}`
    : '0';

  return {
    hp: {
      current: String(currentHP),
      max: String(maxHP),
      temp: String(tempHP),
      maxBonus: maxBonusLabel,
      amount: '1',
      showDeathSaves: currentHP === 0,
      deathSuccess,
      deathFail,
    },
    hitDice: {
      label: total ? `${remainingHD}/${total} d${faces}` : '',
      pips,
      total,
      used: usedHD,
      faces,
      hint: pips.length ? 'Click to use/recover a hit die' : '',
    },
  };
}

export function computeScores() {
  const {
    C,
    getFinal,
    getMod,
    getPB,
    _sheetSpeedSet,
    _sheetSpeedBonus,
    _sheetHasNonProficientArmor,
    _sheetAdvFor,
    cachedEncLevel,
  } = window;

  if (typeof getFinal !== 'function' || typeof getMod !== 'function' || typeof getPB !== 'function') {
    return { ready: false, scores: [], pb: '', speed: null };
  }

  const armorTrainingDis = typeof _sheetHasNonProficientArmor === 'function' && _sheetHasNonProficientArmor();

  const scores = STATS.map((stat) => {
    const value = getFinal(stat);
    const mod = getMod(value);
    const hasForcedDis = armorTrainingDis && (stat === 'str' || stat === 'dex');
    const eAdv = typeof _sheetAdvFor === 'function' ? _sheetAdvFor({ target: 'check', ability: stat }) : null;

    let advFlag;
    if (hasForcedDis) advFlag = false;
    else if (eAdv === 'adv') advFlag = true;
    else if (eAdv === 'disadv') advFlag = false;

    const titleParts = [`Roll ${FULL_LBL[stat]} Check`];
    if (hasForcedDis) titleParts.push('Disadvantage: untrained armor');
    if (!hasForcedDis && eAdv === 'adv') titleParts.push('Advantage (feature)');
    if (!hasForcedDis && eAdv === 'disadv') titleParts.push('Disadvantage (feature)');

    return {
      stat,
      shortLabel: SLBL[stat],
      fullLabel: FULL_LBL[stat],
      value,
      mod,
      modText: fbonus(mod),
      hasForcedDis,
      featureAdv: !hasForcedDis ? eAdv : null,
      advFlag,
      title: titleParts.join(' | '),
    };
  });

  const speciesSpeed = C?.speciesSnapshot?.speed ?? 30;
  const spdMap = typeof speciesSpeed === 'object' ? speciesSpeed : { walk: speciesSpeed };
  const baseWalk = Number(spdMap.walk ?? (typeof speciesSpeed === 'number' ? speciesSpeed : 30));
  const setWalk = typeof _sheetSpeedSet === 'function' ? _sheetSpeedSet('walk') : 0;
  const speedBonus = typeof _sheetSpeedBonus === 'function' ? _sheetSpeedBonus('walk') : 0;
  const spdBase = Math.max(baseWalk, setWalk) + speedBonus;
  const isOverCap = cachedEncLevel === 1;
  const spdVal = isOverCap ? 5 : spdBase;

  const altModes = ['fly', 'swim', 'climb', 'burrow']
    .map((t) => {
      const base = Number(spdMap[t] || 0);
      const set = typeof _sheetSpeedSet === 'function' ? _sheetSpeedSet(t) : 0;
      const bonus = typeof _sheetSpeedBonus === 'function' ? _sheetSpeedBonus(t) : 0;
      const total = Math.max(base, set) + bonus;
      return total > 0 ? { mode: t, value: total, label: t.charAt(0).toUpperCase() + t.slice(1) } : null;
    })
    .filter(Boolean);

  return {
    ready: true,
    scores,
    pb: fbonus(getPB()),
    speed: {
      value: spdVal,
      base: spdBase,
      isOverCap,
      altModes,
      title: isOverCap ? `Base ${spdBase} ft — Over Capacity` : '',
    },
  };
}

function computeDefenses() {
  const {
    C,
    _sheetExtraResists,
    _sheetExtraImmunes,
    _sheetExtraCondImmunes,
    _resolvedInventory,
    _sheetClassEntities,
    _sheetGetClassRuntimeConfig,
    _sheetGetSubclassRuntimeConfig,
    _sheetGetSpeciesRuntimeConfig,
    _sheetArmorTrainingIssues,
  } = window;

  const items = [];

  function dmgLabel(r) {
    const raw = typeof r === 'string' ? r : r?.special || '';
    if (!raw || raw === '—') return raw || '—';
    const stripped = raw.replace(/^(resistance|immunity)[-:]\s*/i, '').trim();
    return DMGTYPE_LABELS[stripped.toLowerCase()] || DMGTYPE_LABELS[raw.toLowerCase()] || stripped || raw;
  }

  const resist = C?.speciesSnapshot?.resist || [];
  const immune = C?.speciesSnapshot?.immune || [];

  for (const r of resist) {
    const lbl = dmgLabel(r);
    if (lbl && lbl !== '—') items.push({ label: `Resistance: ${lbl}`, color: 'b' });
  }
  for (const r of immune) {
    const lbl = dmgLabel(r);
    if (lbl && lbl !== '—') items.push({ label: `Immunity: ${lbl}`, color: 'r' });
  }

  if (typeof _sheetExtraResists === 'function') {
    _sheetExtraResists().forEach((d) => {
      const lbl = DMGTYPE_LABELS[String(d).toLowerCase()] || d;
      items.push({ label: `Resistance: ${lbl}`, color: 'b' });
    });
  }
  if (typeof _sheetExtraImmunes === 'function') {
    _sheetExtraImmunes().forEach((d) => {
      const lbl = DMGTYPE_LABELS[String(d).toLowerCase()] || d;
      items.push({ label: `Immunity: ${lbl}`, color: 'r' });
    });
  }
  if (typeof _sheetExtraCondImmunes === 'function') {
    _sheetExtraCondImmunes().forEach((c) => {
      items.push({ label: `Cond. Immunity: ${c}`, color: 'r' });
    });
  }

  if (C?.speciesSnapshot?.darkvision) {
    items.push({ label: `Darkvision ${C.speciesSnapshot.darkvision} ft`, color: 't' });
  }

  const inv = typeof _resolvedInventory === 'function' ? _resolvedInventory() : [];
  const hasArmor = !!inv.find((i) => i.equipped && ['LA', 'MA', 'HA'].includes(i.type));
  const hasShield = !!inv.find((i) => i.equipped && i.type === 'S');

  if (!hasArmor) {
    const labels = new Set();
    function pushRules(rules, level) {
      (Array.isArray(rules) ? rules : []).forEach((rule) => {
        if (!rule || typeof rule !== 'object') return;
        if (Number(level || 0) < Number(rule.minLevel || 1)) return;
        if (!rule.allowShield && hasShield) return;
        const abilities = Array.isArray(rule.abilities) ? rule.abilities : [];
        if (!abilities.length) return;
        const txt = `${rule.name || 'Unarmored Defense'} (${abilities.map((a) => String(a || '').toUpperCase()).join('+')})`;
        labels.add(txt);
      });
    }

    if (typeof _sheetClassEntities === 'function') {
      _sheetClassEntities().forEach((ent) => {
        pushRules(_sheetGetClassRuntimeConfig?.(ent.className)?.unarmoredDefense, ent.level);
        pushRules(_sheetGetSubclassRuntimeConfig?.(ent.className, ent.subclassShortName)?.unarmoredDefense, ent.level);
      });
    }
    pushRules(
      _sheetGetSpeciesRuntimeConfig?.(C?.speciesName || '', C?.speciesSource || '')?.unarmoredDefense,
      C?.level || 1,
    );
    labels.forEach((txt) => items.push({ label: txt, color: 'g' }));
  }

  if (typeof _sheetArmorTrainingIssues === 'function') {
    _sheetArmorTrainingIssues().forEach(({ item, info }) => {
      if (item.type === 'S') {
        items.push({ label: `Untrained Shield: no AC bonus (${item.name || info.kind})`, color: 'r' });
      } else {
        items.push({
          label: `Untrained ${info.kind}: DIS STR/DEX tests, no spells (${item.name || info.kind})`,
          color: 'r',
        });
      }
    });
  }

  return items;
}

function readActiveConditions() {
  try {
    const raw = localStorage.getItem('5e_conditions_active');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = new Set(CONDITION_OPTIONS.map((c) => c.key));
    return parsed.filter((k) => valid.has(k));
  } catch {
    return [];
  }
}

export function computeConditions() {
  const activeKeys = readActiveConditions();
  const activeSet = new Set(activeKeys);
  const active = CONDITION_OPTIONS.filter((c) => activeSet.has(c.key));
  return {
    active,
    allOptions: CONDITION_OPTIONS,
    activeKeys,
    hasAny: active.length > 0,
  };
}

export function computeSummary() {
  const { getMod, getFinal, calcAC, _getInitiativeBonus } = window;

  const initMod = (typeof getMod === 'function' && typeof getFinal === 'function')
    ? getMod(getFinal('dex')) + (typeof _getInitiativeBonus === 'function' ? _getInitiativeBonus() : 0)
    : 0;

  const ac = typeof calcAC === 'function' ? calcAC() : 10;

  const inspirationActive = readJsonRaw('5e_inspiration') === 'true';

  return {
    initiative: fbonus(initMod),
    ac,
    inspirationActive,
    inspirationLabel: inspirationActive ? 'Inspired!' : 'No Insp.',
    defenses: computeDefenses(),
    conditions: computeConditions(),
  };
}

export function toggleCondition(key) {
  if (typeof window.toggleCondition === 'function') window.toggleCondition(key);
}

export function clearConditions() {
  if (typeof window.clearConditions === 'function') window.clearConditions();
}

function readJsonRaw(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function doRest(type) {
  if (typeof window.doRest === 'function') window.doRest(type);
}

export function downloadSheet() {
  if (typeof window.downloadSheet === 'function') window.downloadSheet();
}

export function goBackToBuilder(event) {
  if (typeof window.goBackToBuilder === 'function') window.goBackToBuilder(event);
}

export function saveNotes() {
  if (typeof window.saveNotes === 'function') window.saveNotes();
}

export function readSheetNotes() {
  try {
    return localStorage.getItem('5e_notes') || '';
  } catch {
    return '';
  }
}

export function writeSheetNotes(value) {
  try {
    localStorage.setItem('5e_notes', String(value || ''));
  } catch {
    // ignore quota errors
  }
}

export function rollInitiative() {
  if (typeof window.rollInitiative === 'function') window.rollInitiative();
}

export function toggleInspiration() {
  if (typeof window.toggleInspirationSheet === 'function') window.toggleInspirationSheet();
}

export function rollAbilityCheck(stat, mod, advFlag) {
  if (typeof window.rollD20 === 'function') {
    const label = `${FULL_LBL[stat] || SLBL[stat] || stat} Check`;
    if (advFlag === undefined) window.rollD20(mod, label);
    else window.rollD20(mod, label, advFlag);
  }
}

export function computeSenses() {
  const { getSkillBonus, _sheetExtraSenses, C } = window;
  if (typeof getSkillBonus !== 'function') return [];

  const extra = typeof _sheetExtraSenses === 'function' ? _sheetExtraSenses() : {};
  const speciesDarkvision = C?.speciesSnapshot?.darkvision || 0;
  const dv = Math.max(speciesDarkvision, extra?.darkvision || 0);

  const rows = [
    { key: 'pass-perc', value: 10 + getSkillBonus({ n: 'Perception', a: 'wis' }), label: 'Passive Perception' },
    { key: 'pass-inv', value: 10 + getSkillBonus({ n: 'Investigation', a: 'int' }), label: 'Passive Investigation' },
    { key: 'pass-ins', value: 10 + getSkillBonus({ n: 'Insight', a: 'wis' }), label: 'Passive Insight' },
  ];

  if (dv > 0) {
    rows.push({ key: 'darkvision', value: `${dv} ft`, label: 'Darkvision', tealValue: true });
  }

  ['blindsight', 'tremorsense', 'truesight'].forEach((k) => {
    const range = extra?.[k] || 0;
    if (range > 0) {
      rows.push({
        key: k,
        value: `${range} ft`,
        label: k.charAt(0).toUpperCase() + k.slice(1),
        tealValue: true,
      });
    }
  });

  return rows;
}

