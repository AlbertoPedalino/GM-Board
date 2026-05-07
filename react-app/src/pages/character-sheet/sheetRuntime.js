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

