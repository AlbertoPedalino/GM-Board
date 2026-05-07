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

