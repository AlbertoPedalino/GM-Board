/**
 * Pure calculation functions migrated from legacy character-sheet.html
 * These are stat calculations, not dependent on character data
 */

const PB_TABLE = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6];

/**
 * Get proficiency bonus by character level
 * @param {number} level 1-20
 * @returns {number} proficiency bonus
 */
export function getPB(level = 1) {
  const idx = Math.min(20, Math.max(1, Number(level) || 1)) - 1;
  return PB_TABLE[idx] || 2;
}

/**
 * Get modifier from ability score
 * @param {number} score Raw ability score (8-20)
 * @returns {number} Modifier (-1 to +5 typically)
 */
export function getMod(score) {
  const v = Number(score) || 10;
  return Math.floor((v - 10) / 2);
}

/**
 * Get ability score with all bonuses applied
 * @param {string} stat 'str', 'dex', 'con', 'int', 'wis', 'cha'
 * @param {object} character Character object from sheetRuntime
 * @returns {number} Final ability score
 */
export function getFinal(stat, character) {
  if (!character) return 10;
  
  const statKey = String(stat || '').toLowerCase();
  const base = character?.[`${statKey}Score`] || 10;
  const bgBonus = Number(character?.backgroundAbilityBonus?.[statKey] || 0);
  const asiBonus = Number(character?.abilityScoreIncreases?.[statKey] || 0);
  
  // Species/racial bonuses
  const speciesBonus = Number(character?.speciesAbilityBonus?.[statKey] || 0);
  
  // Any other stat modifiers
  const otherBonus = Number(character?.statModifiers?.[statKey] || 0);
  
  return base + bgBonus + asiBonus + speciesBonus + otherBonus;
}

/**
 * Calculate spell save DC for spellcaster
 * @param {number} abilityMod The spellcasting ability modifier
 * @param {number} pb Proficiency bonus
 * @returns {number} Spell save DC (8-20 typically)
 */
export function calculateSpellSaveDC(abilityMod, pb) {
  return 8 + (Number(pb) || 0) + (Number(abilityMod) || 0);
}

/**
 * Calculate spell attack bonus
 * @param {number} abilityMod The spellcasting ability modifier
 * @param {number} pb Proficiency bonus
 * @returns {number} Spell attack bonus (+1 to +10 typically)
 */
export function calculateSpellAttackBonus(abilityMod, pb) {
  return (Number(pb) || 0) + (Number(abilityMod) || 0);
}

/**
 * Format a score as a modifier string
 * @param {number} value Score or modifier value
 * @returns {string} Formatted like "+3" or "-1"
 */
export function formatModifier(value) {
  const mod = Number(value) || 0;
  if (mod === 0) return '±0';
  return mod > 0 ? `+${mod}` : `${mod}`;
}
