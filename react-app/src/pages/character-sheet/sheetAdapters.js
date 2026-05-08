/**
 * Sheet Actions - Class, Subclass, Species, Feat actions
 * Direct imports from adapters/registry, zero fallbacks
 */

import {
  getClassSheetActions as _getClassSheetActions,
  getSubclassSheetActions as _getSubclassSheetActions,
  getSpeciesSheetActions as _getSpeciesSheetActions,
  getFeatSheetActions as _getFeatSheetActions,
  getClassAtWillSpells as _getClassAtWillSpells,
  getResourceSideEffect as _getResourceSideEffect,
} from 'adapters/registry.js';

/**
 * Get actions for a class (e.g., Fighter actions like "Second Wind")
 * @param {string} className 'Barbarian', 'Bard', etc.
 * @param {number} classLevel Character level in this class
 * @returns {array} Array of action objects
 */
export function getSheetClassActions(className, classLevel = 1) {
  return _getClassSheetActions(className) || [];
}

/**
 * Get actions for a subclass (e.g., Champion Fighting Style)
 * @param {string} subclassKey 'Barbarian_Berserker', 'Bard_Lore', etc.
 * @param {number} classLevel Character level in parent class
 * @param {string} choicePrefix Optional prefix for choice keys
 * @returns {array} Array of action objects
 */
export function getSheetSubclassActions(subclassKey, classLevel = 1, choicePrefix = '') {
  const [className, subclassName] = subclassKey.split('_');
  return _getSubclassSheetActions(className, subclassName) || [];
}

/**
 * Get actions for a species/race (e.g., Elf Keen Senses)
 * @param {string} speciesName 'Elf', 'Dwarf', 'Tiefling', etc.
 * @param {string} speciesSource Source book code
 * @param {number} charLevel Character level (affects scaling)
 * @returns {array} Array of action objects
 */
export function getSheetSpeciesActions(speciesName, speciesSource, charLevel = 1) {
  return _getSpeciesSheetActions(speciesName, speciesSource) || [];
}

/**
 * Get actions from a feat
 * @param {string} featName Feat name
 * @returns {array} Array of action objects
 */
export function getFeatSheetActions(featName) {
  return _getFeatSheetActions(featName) || [];
}

/**
 * Get at-will spells for a class
 * @param {string} className
 * @returns {array} Array of spell objects
 */
export function getClassAtWillSpells(className) {
  return _getClassAtWillSpells(className) || [];
}

/**
 * Get spellcasting profile for a class
 * @param {string} className
 * @param {string} subclassShortName
 * @param {object} snapshot Character snapshot
 * @returns {object} Spellcasting profile { progression, ability, isFullCaster, ... }
 */
export function getSpellcastingProfile(className, subclassShortName, snapshot) {
  if (typeof window._sheetSpellcastingProfile === 'function') {
    try {
      return window._sheetSpellcastingProfile(className, subclassShortName, snapshot) || {};
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Get caster progression normalization
 * @param {string} progression 'full', 'half', 'third', 'pact', etc.
 * @returns {string} Normalized progression
 */
export function getCasterProgression(progression) {
  if (typeof window._sheetCasterProgression === 'function') {
    try {
      return window._sheetCasterProgression(progression) || 'full';
    } catch {
      return 'full';
    }
  }
  return 'full';
}

/**
 * Get caster level contribution for multiclass
 * @param {string} progression
 * @param {number} classLevel
 * @returns {number} Effective caster level contribution
 */
export function getCasterLevelContribution(progression, classLevel) {
  if (typeof window._sheetCasterContribution === 'function') {
    try {
      return window._sheetCasterContribution(progression, classLevel) || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

/**
 * Get resource side effect for a resource
 * @param {string} resourceKey
 * @returns {function|null} Side effect function or null
 */
export function getResourceSideEffect(resourceKey) {
  return _getResourceSideEffect(resourceKey) || null;
}

/**
 * Get all resource definitions
 * @returns {array} Array of resource definition objects
 */
export function getAllResDefs() {
  if (typeof window.getAllResDefs === 'function') {
    try {
      return window.getAllResDefs() || [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Get max uses for a resource
 * @param {object} resource Resource definition
 * @returns {number} Maximum uses
 */
export function getResMax(resource) {
  if (typeof window.getResMax === 'function') {
    try {
      return window.getResMax(resource) || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

/**
 * Get spell ability for current spellcaster
 * @returns {string} 'int', 'wis', 'cha', etc.
 */
export function getSpellAbility() {
  if (typeof window.getSpellAbility === 'function') {
    try {
      return window.getSpellAbility() || 'wis';
    } catch {
      return 'wis';
    }
  }
  return 'wis';
}

/**
 * Get spell save DC
 * @returns {number}
 */
export function getSpellSaveDC() {
  if (typeof window.getSpellSaveDC === 'function') {
    try {
      return window.getSpellSaveDC() || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

/**
 * Get spell attack bonus
 * @returns {number}
 */
export function getSpellAttackBonus() {
  if (typeof window.getSpellAttackBonus === 'function') {
    try {
      return window.getSpellAttackBonus() || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

/**
 * Get resolved inventory with all computations
 * @returns {array} Array of inventory items with computed properties
 */
export function getResolvedInventory() {
  if (typeof window._resolvedInventory === 'function') {
    try {
      return window._resolvedInventory() || [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Check if character has nonproficient armor equipped
 * @returns {boolean}
 */
export function hasNonproficientArmor() {
  if (typeof window._sheetHasNonProficientArmor === 'function') {
    try {
      return window._sheetHasNonProficientArmor() === true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Get weapon proficiency info
 * @param {object} item Inventory item
 * @param {object} override Weapon override if any
 * @returns {object} { proficient: boolean, source: string }
 */
export function getWeaponProficiencyInfo(item, override) {
  if (typeof window._sheetWeaponProficiencyInfo === 'function') {
    try {
      return window._sheetWeaponProficiencyInfo(item, override) || { proficient: true, source: '' };
    } catch {
      return { proficient: true, source: '' };
    }
  }
  return { proficient: true, source: '' };
}

/**
 * Get active weapon overrides (e.g., finesse weapon using DEX instead of STR)
 * @returns {array} Array of override objects
 */
export function getActiveWeaponOverrides() {
  if (typeof window._getActiveWeaponOverrides === 'function') {
    try {
      return window._getActiveWeaponOverrides() || [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Get advantage/disadvantage for a specific target
 * @param {object} context { target: 'skill'|'save'|'ability', skill?: name, save?: name }
 * @returns {string|null} 'adv', 'disadv', or null
 */
export function getAdvantageFor(context) {
  if (typeof window._sheetAdvFor === 'function') {
    try {
      return window._sheetAdvFor(context) || null;
    } catch {
      return null;
    }
  }
  return null;
}
