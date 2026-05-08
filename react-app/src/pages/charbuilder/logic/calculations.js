import {
  FULL_SLOTS,
  HALF_SLOTS,
  PACT_SLOTS,
  PB_COST,
  PROFICIENCY_BONUS,
  STATS,
  THIRD_SLOTS,
  XP_TOTAL,
} from '../constants.js';

export function getLevelFromXp(xp) {
  let level = 1;
  for (let index = 1; index < XP_TOTAL.length; index += 1) {
    if (Number(xp || 0) >= XP_TOTAL[index]) level = index + 1;
  }
  return level;
}

export function getXpProgress(xp, level) {
  const current = XP_TOTAL[level - 1] || 0;
  const next = XP_TOTAL[level] || XP_TOTAL[19];
  if (level >= 20) return 100;
  return Math.min(100, Math.round(((Number(xp || 0) - current) / (next - current)) * 100));
}

export function formatMod(value) {
  const mod = Math.floor((Number(value || 0) - 10) / 2);
  return `${mod >= 0 ? '+' : ''}${mod}`;
}

export function statMod(value) {
  return Math.floor((Number(value || 0) - 10) / 2);
}

export function pointBuySpent(scores) {
  return STATS.reduce((sum, stat) => sum + (PB_COST[scores[stat]] || 0), 0);
}

export function getBackgroundPool(background) {
  if (!background?.ability?.length) return STATS;
  const ability = background.ability[0];
  if (ability.choose?.weighted?.from?.length) return ability.choose.weighted.from;
  if (ability.choose?.from?.length) return ability.choose.from;
  const direct = Object.keys(ability).filter((key) => STATS.includes(key));
  return direct.length ? direct : STATS;
}

export function getBackgroundPattern(background, index = 0) {
  if (!background?.ability?.length) return [2, 1];
  const ability = background.ability[Math.min(index, background.ability.length - 1)];
  if (ability?.choose?.weighted?.weights?.length) return ability.choose.weighted.weights;
  const values = Object.values(ability || {}).filter((value) => typeof value === 'number').sort((a, b) => b - a);
  return values.length ? values : [2, 1];
}

export function getBackgroundBonus(character, stat) {
  const idx = (character.backgroundAbilities || []).indexOf(stat);
  if (idx < 0) return 0;
  const pattern = character.backgroundPattern || [2, 1];
  return pattern[idx] || 0;
}

export function getFinalScore(character, stat) {
  let base = 8;
  if (character.scoreMethod === 'standard') base = character.arrAssign[stat] ?? 8;
  else if (character.scoreMethod === 'manual') base = character.manualScores[stat] ?? 8;
  else if (character.scoreMethod === 'dice') base = character.diceAssign[stat] ?? 8;
  else base = character.pbScores[stat] ?? 8;
  return Number(base) + getBackgroundBonus(character, stat);
}

export function getAllFinalScores(character) {
  return Object.fromEntries(STATS.map((stat) => [stat, getFinalScore(character, stat)]));
}

export function getHitDieFaces(classObject) {
  return classObject?.hd?.faces || classObject?.hd?.[0]?.faces || 8;
}

export function calcMaxHp(character) {
  if (!character.className) return 0;
  const conMod = statMod(getFinalScore(character, 'con'));
  const primaryFaces = getHitDieFaces(character.cls);
  const primaryLevel = getPrimaryClassLevel(character);
  let total = primaryFaces + conMod;
  if (primaryLevel > 1) {
    for (let level = 2; level <= primaryLevel; level += 1) {
      const avg = Math.floor(primaryFaces / 2) + 1;
      const rolled = Number(character.hpManualRolls?.[level]);
      total += (character.hpMode === 'rolled' && rolled ? Math.min(primaryFaces, rolled) : avg) + conMod;
    }
  }
  (character.extraClasses || []).forEach((extraClass, index) => {
    const faces = getHitDieFaces(extraClass.cls);
    for (let level = 1; level <= (extraClass.level || 1); level += 1) {
      const avg = Math.floor(faces / 2) + 1;
      const rolled = Number(character.hpManualRolls?.[`extra_${index}_${level}`]);
      total += (character.hpMode === 'rolled' && rolled ? Math.min(faces, rolled) : avg) + conMod;
    }
  });
  const featNames = getSelectedFeatNames(character);
  const tough = featNames.includes('Tough') ? 2 * (character.level || 1) : 0;
  return Math.max(1, total + tough);
}

export function getCasterProgression(className, classObject, subclassName) {
  const name = String(className || classObject?.name || '').toLowerCase();
  const explicit = classObject?.casterProgression;
  if (explicit === 'full' || explicit === 'half' || explicit === 'pact') return explicit;
  if (['bard', 'cleric', 'druid', 'sorcerer', 'wizard'].includes(name)) return 'full';
  if (['paladin', 'ranger', 'artificer'].includes(name)) return name === 'artificer' ? 'artificer' : 'half';
  if (name === 'warlock') return 'pact';
  if (name === 'fighter' && String(subclassName || '').toLowerCase().includes('eldritch')) return 'third';
  if (name === 'rogue' && String(subclassName || '').toLowerCase().includes('arcane')) return 'third';
  return null;
}

export function getCasterContribution(progression, level) {
  if (progression === 'full') return level;
  if (progression === 'half') return Math.floor(level / 2);
  if (progression === 'artificer') return Math.ceil(level / 2);
  if (progression === 'third') return Math.floor(level / 3);
  return 0;
}

export function getSpellSlots(character) {
  const primaryLv = getPrimaryClassLevel(character);
  const primaryProg = getCasterProgression(character.className, character.cls, character.subclassShortName);
  const extras = character.extraClasses || [];
  const extraCasters = extras.filter((extra) => getCasterProgression(extra.name, extra.cls, extra.subclassShortName));
  const pactSlot = primaryProg === 'pact' ? PACT_SLOTS[primaryLv] : null;

  if (!extras.length) {
    if (primaryProg === 'full') return { slots: FULL_SLOTS[primaryLv] || [], pact: null };
    if (primaryProg === 'half') return { slots: HALF_SLOTS[primaryLv] || [], pact: null };
    if (primaryProg === 'artificer') return { slots: HALF_SLOTS[primaryLv] || [], pact: null };
    if (primaryProg === 'third') return { slots: THIRD_SLOTS[primaryLv] || [], pact: null };
    if (primaryProg === 'pact') return { slots: [], pact: pactSlot };
    return { slots: [], pact: null };
  }

  const casterLevel = getCasterContribution(primaryProg, primaryLv)
    + extraCasters.reduce((sum, extra) => sum + getCasterContribution(getCasterProgression(extra.name, extra.cls, extra.subclassShortName), extra.level || 1), 0);
  if (casterLevel > 0) return { slots: FULL_SLOTS[Math.min(20, casterLevel)] || [], pact: pactSlot };
  if (primaryProg === 'half' || primaryProg === 'artificer') return { slots: HALF_SLOTS[primaryLv] || [], pact: pactSlot };
  if (primaryProg === 'third') return { slots: THIRD_SLOTS[primaryLv] || [], pact: pactSlot };
  return { slots: [], pact: pactSlot };
}

export function getProficiencyBonus(level) {
  return PROFICIENCY_BONUS[level] || 2;
}

export function getPrimaryClassLevel(character) {
  const total = Number(character?.level || 0) || 1;
  const extras = (character?.extraClasses || []).reduce((sum, ec) => sum + (Number(ec?.level) || 0), 0);
  return Math.max(1, total - extras);
}

export function getSelectedFeatNames(character) {
  const out = new Set();
  Object.entries(character?.choices || {}).forEach(([key, value]) => {
    if (!value) return;
    if (key.endsWith('_entry') || key.endsWith('_skill') || key.endsWith('_lang') || key.endsWith('_tool') || key.endsWith('_asi') || key.endsWith('_ability') || key.endsWith('_spell_ability') || key.endsWith('_damage') || key.endsWith('_weapon') || key.includes('_spell_')) return;
    if (!(key === 'feat_origin' || key.startsWith('feat_') || /^mc\d+_feat_/.test(key) || key.startsWith('paladin_') || key === 'fighter_fighting_style' || key === 'fighter_epic_boon' || key.includes('_fighting_style') || key.includes('_epic_boon') || /^feat_asi_lv\d+$/.test(key))) return;
    const values = Array.isArray(value) ? value : [value];
    values.forEach((entry) => {
      if (typeof entry === 'string' && entry) out.add(entry);
    });
  });
  return [...out];
}
