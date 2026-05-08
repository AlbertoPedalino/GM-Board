/**
 * Spellcasting profile helpers for D&D 5e character sheet
 * Handles caster progressions, spell slot calculations, etc.
 */

// Caster progression types and their slot progression
export const CASTER_PROGRESSIONS = {
  FULL: 'full',
  HALF: '1/2',
  THIRD: '1/3',
  PACT: 'pact',
  ARTIFICER: 'artificer',
  NONE: 'none',
};

// Class to caster progression mapping
export const CLASS_CASTER_PROFILES = {
  'Artificer': { progression: 'artificer', ability: 'int' },
  'Bard': { progression: 'full', ability: 'cha' },
  'Cleric': { progression: 'full', ability: 'wis' },
  'Druid': { progression: 'full', ability: 'wis' },
  'Paladin': { progression: 'half', ability: 'cha' },
  'Ranger': { progression: 'half', ability: 'wis' },
  'Sorcerer': { progression: 'full', ability: 'cha' },
  'Warlock': { progression: 'pact', ability: 'cha' },
  'Wizard': { progression: 'full', ability: 'int' },
  'Eldritch Knight': { progression: 'third', ability: 'int' },
  'Arcane Trickster': { progression: 'third', ability: 'int' },
};

/**
 * Get caster profile for a class + subclass combo
 * @param {string} className - e.g., 'Wizard', 'Bard'
 * @param {string} subclassName - e.g., 'Evocation', optional
 * @param {object} classSnapshot - legacy class snapshot data
 * @returns {{progression: string, ability: string, isFullCaster: boolean}}
 */
export function getSpellcastingProfile(className, subclassName = '', classSnapshot = {}) {
  // Try legacy function first (fallback)
  if (typeof window._sheetSpellcastingProfile === 'function') {
    return window._sheetSpellcastingProfile(className || '', subclassName || '', classSnapshot || {});
  }

  const normalizedClass = String(className || '').toLowerCase().trim();
  
  // Check direct class match
  for (const [key, profile] of Object.entries(CLASS_CASTER_PROFILES)) {
    if (key.toLowerCase() === normalizedClass) {
      return {
        ...profile,
        isFullCaster: profile.progression === 'full',
        isHalfCaster: profile.progression === '1/2',
        isThirdCaster: profile.progression === '1/3',
        isPactCaster: profile.progression === 'pact',
      };
    }
  }

  // Default non-caster
  return { progression: 'none', ability: null, isFullCaster: false };
}

/**
 * Calculate actual caster level contribution from class level
 * Used for multiclassing spell slot calculations
 * @param {string} progression - e.g., 'full', '1/2', '1/3', 'pact'
 * @param {number} classLevel - level in this class
 * @returns {number} effective caster level
 */
export function calculateCasterLevelContribution(progression, classLevel) {
  const level = Number(classLevel) || 0;
  if (level < 1) return 0;

  switch (String(progression || '').toLowerCase()) {
    case 'full': return level;
    case '1/2': case 'half': return Math.floor(level / 2);
    case '1/3': case 'third': return Math.floor(level / 3) || (level >= 3 ? 1 : 0);
    case 'artificer': return Math.ceil(level / 2);
    case 'pact': return level; // Warlock always uses full level for pact slots
    default: return 0;
  }
}

/**
 * Get spell ability modifier for a class
 * @param {string} className - class name
 * @returns {string} ability name ('str', 'dex', 'int', 'wis', 'cha')
 */
export function getSpellCastingAbility(className) {
  const profile = getSpellcastingProfile(className);
  return profile?.ability || 'wis';
}

/**
 * Check if a class can cast spells
 * @param {string} className - class name
 * @returns {boolean}
 */
export function isSpellcaster(className) {
  const profile = getSpellcastingProfile(className);
  return profile?.progression !== 'none' && profile?.progression !== undefined;
}

/**
 * Determine spell DC for a character
 * Uses casting ability modifier + proficiency bonus
 * @param {number} castingAbilityMod - modifier from spellcasting ability
 * @param {number} proficiencyBonus - proficiency bonus
 * @returns {number} spell save DC
 */
export function calculateSpellSaveDC(castingAbilityMod, proficiencyBonus) {
  return 8 + (castingAbilityMod || 0) + (proficiencyBonus || 0);
}

/**
 * Determine spell attack bonus
 * @param {number} castingAbilityMod - modifier from spellcasting ability
 * @param {number} proficiencyBonus - proficiency bonus
 * @returns {number} spell attack bonus
 */
export function calculateSpellAttackBonus(castingAbilityMod, proficiencyBonus) {
  return (castingAbilityMod || 0) + (proficiencyBonus || 0);
}

/**
 * Format ability modifier as "+X" or "-X"
 * @param {number} modifier - raw modifier
 * @returns {string} formatted, e.g., "+3" or "-1"
 */
export function formatModifier(modifier) {
  const m = Number(modifier) || 0;
  return m > 0 ? `+${m}` : String(m);
}

/**
 * Get spell level from spell name (lookup in DB)
 * Falls back to legacy lookup if needed
 * @param {string} spellName - spell name
 * @returns {number|null} spell level or null
 */
export function getSpellLevelFromDb(spellName) {
  if (typeof window.__gbLookupSheetSpell === 'function') {
    try {
      const spell = window.__gbLookupSheetSpell(spellName);
      return spell?.level ?? null;
    } catch {
      return null;
    }
  }
  return null;
}
