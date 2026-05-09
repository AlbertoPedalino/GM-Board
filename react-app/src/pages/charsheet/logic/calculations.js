const PB_TABLE = [null, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const SLBL = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
const FULL_LBL = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };

export const SKILLS = [
  { n: 'Acrobatics', a: 'dex' }, { n: 'Animal Handling', a: 'wis' }, { n: 'Arcana', a: 'int' },
  { n: 'Athletics', a: 'str' }, { n: 'Insight', a: 'wis' }, { n: 'Sleight of Hand', a: 'dex' },
  { n: 'Stealth', a: 'dex' }, { n: 'Investigation', a: 'int' }, { n: 'Deception', a: 'cha' },
  { n: 'Perception', a: 'wis' }, { n: 'Intimidation', a: 'cha' }, { n: 'Medicine', a: 'wis' },
  { n: 'Nature', a: 'int' }, { n: 'History', a: 'int' }, { n: 'Performance', a: 'cha' },
  { n: 'Persuasion', a: 'cha' }, { n: 'Religion', a: 'int' }, { n: 'Survival', a: 'wis' },
];

export const COMBAT_ACTIONS = [
  { name: 'Attack', desc: 'Make an attack with a weapon.' },
  { name: 'Dodge', desc: 'Until your next turn, every attack roll against you has disadvantage if you can see the attacker.' },
  { name: 'Disengage', desc: 'Your movement does not provoke opportunity attacks for the rest of the turn.' },
  { name: 'Hide', desc: 'Make a Dexterity (Stealth) check to hide.' },
  { name: 'Help', desc: 'Grant advantage to an ally on an attack roll or ability check.' },
  { name: 'Dash', desc: 'Your movement doubles for this turn.' },
  { name: 'Ready', desc: 'Prepare an action to execute in response to a specific trigger.' },
  { name: 'Study', desc: 'Make an Intelligence check to gain information about a target.' },
  { name: 'Influence', desc: 'Make a Charisma (Persuasion/Deception/Intimidation) check against a target.' },
  { name: 'Grapple', desc: 'Try to restrain a creature with an Athletics check.' },
  { name: 'Shove', desc: 'Try to push or knock prone a creature.' },
];

export const CONDITIONS = [
  { key: 'blinded', label: 'Blinded', icon: 'EyeOff' }, { key: 'charmed', label: 'Charmed', icon: 'Heart' },
  { key: 'deafened', label: 'Deafened', icon: 'Ear' }, { key: 'frightened', label: 'Frightened', icon: 'Ghost' },
  { key: 'grappled', label: 'Grappled', icon: 'Hand' }, { key: 'incapacitated', label: 'Incapacitated', icon: 'Pause' },
  { key: 'invisible', label: 'Invisible', icon: 'CircleDashed' }, { key: 'paralyzed', label: 'Paralyzed', icon: 'Brain' },
  { key: 'petrified', label: 'Petrified', icon: 'Mountain' }, { key: 'poisoned', label: 'Poisoned', icon: 'FlaskConical' },
  { key: 'prone', label: 'Prone', icon: 'ArrowDown' }, { key: 'restrained', label: 'Restrained', icon: 'Link' },
  { key: 'stunned', label: 'Stunned', icon: 'Zap' }, { key: 'unconscious', label: 'Unconscious', icon: 'Moon' },
  { key: 'exhaustion', label: 'Exhaustion', icon: 'BatteryLow' },
];

export const SCHOOL_LABELS = { A: 'Abjuration', C: 'Conjuration', D: 'Divination', E: 'Enchantment', I: 'Illusion', N: 'Necromancy', T: 'Transmutation', V: 'Evocation' };
export const SPELL_LEVEL_LABELS = ['Cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
const XP_TABLE = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

export { STATS, SLBL, FULL_LBL, XP_TABLE };

export function getBase(C, stat) {
  if (!C) return 10;
  const m = C.scoreMethod;
  if (m === 'pointbuy') return C.pbScores?.[stat] || 8;
  if (m === 'standard') { const v = C.arrAssign?.[stat]; return v != null ? v : 8; }
  if (m === 'manual') { const v = C.manualScores?.[stat]; return v != null ? v : 8; }
  const v = C.diceAssign?.[stat]; return v != null ? v : 8;
}

export function bgBonus(C, stat) {
  if (C?.bgBonusMap) return C.bgBonusMap[stat] || 0;
  if (!C?.bgAbility?.length) return 0;
  const idx = C.bgAbility.indexOf(stat);
  return idx < 0 ? 0 : idx === 0 ? 2 : 1;
}

export function getAsiFeatBonus(C, stat) {
  let bonus = 0;
  if (!C?.choices) return 0;
  for (const [k, v] of Object.entries(C.choices)) {
    if (!/^feat_asi_lv\d+_asi_picks$/.test(k)) continue;
    const mode = C.choices[k.replace('_asi_picks', '_asi_mode')] || 'double';
    const picks = Array.isArray(v) ? v : [];
    if (mode === 'double') { if (picks[0] === stat) bonus += 2; }
    else bonus += picks.filter(p => p === stat).length;
  }
  return bonus;
}

export function getFinal(C, stat) {
  return getBase(C, stat) + bgBonus(C, stat) + getAsiFeatBonus(C, stat);
}

export function getMod(v) { return Math.floor((v - 10) / 2); }

export function getPB(C) { return C ? (PB_TABLE[C.level] || 2) : 2; }

export function fmod(v) { const m = getMod(v); return (m >= 0 ? '+' : '') + m; }

export function fbonus(n) { return (n >= 0 ? '+' : '') + n; }

export function hasSaveProficiency(C, stat) {
  return C && (C.clsSnapshot?.proficiency || []).includes(stat);
}

export function getSaveBonus(C, stat) {
  const m = getMod(getFinal(C, stat));
  return m + (hasSaveProficiency(C, stat) ? getPB(C) : 0);
}

export function normSkill(s) {
  if (!s || typeof s !== 'string') return '';
  return s.toLowerCase().replace(/[^a-z]/g, '');
}

export function getSkillProficiency(C, skillName) {
  const nsk = normSkill(skillName);
  const normalized = C?.normalizedChoices || {};
  if ((normalized.expertise || []).some(s => normSkill(s) === nsk)) return 'exp';
  if ((normalized.skills || []).some(s => normSkill(s) === nsk)) return 'prof';
  const skillData = C?.selectedSkills || {};
  const profList = Array.isArray(skillData) ? skillData : (skillData.proficient || []);
  const expList = Array.isArray(skillData) ? [] : (skillData.expert || []);
  if (expList.some(s => normSkill(s) === nsk)) return 'exp';
  if (profList.some(s => normSkill(s) === nsk)) return 'prof';
  const bgFixed = (C?.bgSnapshot?.skillProficiencies || []).flatMap(sp => Object.keys(sp).filter(k => k !== 'choose'));
  if (bgFixed.some(s => normSkill(s) === nsk)) return 'prof';
  if (C?.choices) {
    for (const [key, val] of Object.entries(C.choices)) {
      if (!val) continue;
      if (key.includes('skill') || key.startsWith('start_skills')) {
        const vals = Array.isArray(val) ? val : [val];
        if (vals.some(v => normSkill(v) === nsk)) return 'prof';
      }
      if (key.includes('exp') || key.includes('expertise')) {
        const vals = Array.isArray(val) ? val : [val];
        if (vals.some(v => normSkill(v) === nsk)) return 'exp';
      }
    }
  }
  return null;
}

export function getSkillBonus(C, sk) {
  const m = getMod(getFinal(C, sk.a));
  const p = getSkillProficiency(C, sk.n);
  if (p === 'exp') return m + getPB(C) * 2;
  if (p === 'prof') return m + getPB(C);
  return m;
}

export function calcMaxHP(C) {
  if (!C) return 10;
  const hd = C.clsSnapshot?.hd;
  let faces = 8;
  if (hd) {
    if (hd.faces) faces = hd.faces;
    else if (Array.isArray(hd) && hd[0]?.faces) faces = hd[0].faces;
  }
  const conMod = getMod(getFinal(C, 'con'));
  const pLv = C.classLevel || C.level;
  let total = faces + conMod;
  if (pLv > 1) {
    if (C.hpMode === 'rolled') {
      for (let i = 2; i <= pLv; i++) {
        const val = parseInt((C.hpManualRolls || {})[i]);
        total += (isNaN(val) ? Math.floor(faces / 2) + 1 : val) + conMod;
      }
    } else {
      total += (Math.floor(faces / 2) + 1 + conMod) * (pLv - 1);
    }
  }
  (C.extraClasses || []).forEach((ec, ecIdx) => {
    const ecHd = ec.clsSnapshot?.hd;
    let ecFaces = 8;
    if (ecHd) {
      if (ecHd.faces) ecFaces = ecHd.faces;
      else if (Array.isArray(ecHd) && ecHd[0]?.faces) ecFaces = ecHd[0].faces;
    }
    const keyPrefix = 'extra_' + ecIdx + '_';
    if (C.hpMode === 'rolled') {
      for (let i = 1; i <= (ec.level || 1); i++) {
        const val = parseInt((C.hpManualRolls || {})[keyPrefix + i]);
        total += (isNaN(val) ? Math.floor(ecFaces / 2) + 1 : val) + conMod;
      }
    } else {
      total += (Math.floor(ecFaces / 2) + 1 + conMod) * (ec.level || 1);
    }
  });
  const lv = C.level;
  const hpBonusPerLv = C.hpBonusPerLv != null
    ? C.hpBonusPerLv
    : (Array.isArray(C.allFeatSnapshots) ? C.allFeatSnapshots : []).reduce((sum, f) => sum + (f?.hpBonusPerLevel || 0), 0);
  total += hpBonusPerLv * lv;
  return Math.max(1, total);
}

export function getLevelFromXp(xp) {
  for (let i = XP_TABLE.length - 1; i >= 0; i--) {
    if (xp >= XP_TABLE[i]) return i;
  }
  return 1;
}

export function getXpForNextLevel(level) {
  return XP_TABLE[level] || 0;
}
