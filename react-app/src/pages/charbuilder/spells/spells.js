import { installedRegistry } from '../../../adapters/index.js';
import { getFinalScore, getPrimaryClassLevel, getSpellSlots, statMod } from '../logic/calculations.js';

export function normClassKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function spellMatchesClass(spell, className, classSpellIndex) {
  const classKey = normClassKey(className);
  if (!classKey) return false;
  
  // 1. Check classSpellIndex first
  const indexed = classSpellIndex?.[classKey];
  if (Array.isArray(indexed) && indexed.includes(String(spell.name || '').toLowerCase())) return true;
  
  if (!spell.classes || typeof spell.classes !== 'object') return false;
  
  // 2. Check fromClassList format: { fromClassList: [{ name: "Cleric" }, ...] }
  const fromClassList = spell.classes.fromClassList || [];
  if (Array.isArray(fromClassList) && fromClassList.some((entry) => normClassKey(entry?.name) === classKey)) return true;
  
  // 3. Check fromSubclass format: { fromSubclass: [{ class: { name: "Cleric" } }, ...] }
  const fromSubclass = spell.classes.fromSubclass || [];
  if (Array.isArray(fromSubclass) && fromSubclass.some((entry) => normClassKey(entry?.class?.name) === classKey)) return true;
  
  // 4. Check classes.class format: { class: { "Cleric": {}, "Wizard": {} } } (5etools multi-source)
  const classObj = spell.classes.class || {};
  if (typeof classObj === 'object') {
    // classObj might have source as key: { "phb": { "Cleric": {}, "Wizard": {} } }
    const allClasses = Object.values(classObj).reduce((acc, obj) => {
      if (typeof obj === 'object') {
        return [...acc, ...Object.keys(obj || {})];
      }
      return acc;
    }, []);
    if (allClasses.some((clsName) => normClassKey(clsName) === classKey)) return true;
    
    // Or might be flat: { "Cleric": {}, "Wizard": {} }
    if (Object.keys(classObj).some((clsName) => normClassKey(clsName) === classKey)) return true;
  }
  
  // 5. Check direct classes array: { classes: ["Cleric", "Wizard"] }
  if (Array.isArray(spell.classes)) {
    if (spell.classes.some((entry) => {
      const entryName = typeof entry === 'string' ? entry : entry?.name || '';
      return normClassKey(entryName) === classKey;
    })) return true;
  }
  
  return false;
}

export function spellMatchesAnyClass(spell, classes, classSpellIndex) {
  // If no classes specified, allow all spells (fallback for backward compatibility)
  // but only in SpellSelectionPanel context where it's safe
  if (!classes?.length) return false;
  return classes.some((className) => spellMatchesClass(spell, className, classSpellIndex));
}

export function getSpellcastingProfile(character) {
  const classProfile = installedRegistry.getClassRuntimeConfig(character.className)?.spellcasting || {};
  const subclassProfile = character.subclassShortName
    ? installedRegistry.getSubclassRuntimeConfig(character.className, character.subclassShortName)?.spellcasting || {}
    : {};
  return {
    ...classProfile,
    ...subclassProfile,
    casterProgression: subclassProfile.casterProgression || classProfile.casterProgression || character.cls?.casterProgression || null,
    alwaysKnownSpells: [
      ...(classProfile.alwaysKnownSpells || []),
      ...(subclassProfile.alwaysKnownSpells || []),
    ],
    alwaysPreparedSpells: [
      ...(classProfile.alwaysPreparedSpells || []),
      ...(subclassProfile.alwaysPreparedSpells || []),
    ],
  };
}

export function applyPreparedFormula(formula, abilityMod, level) {
  if (!formula || typeof formula !== 'object') return null;
  const divisor = Number(formula.levelDivisor || 1) || 1;
  const rawLevel = Number(level || 1) / divisor;
  const levelTerm = String(formula.levelRound || 'floor') === 'ceil' ? Math.ceil(rawLevel) : Math.floor(rawLevel);
  const total = abilityMod + (formula.addLevel ? levelTerm : 0);
  return Math.max(Number(formula.min || 0), total);
}

export function getSpellCounts(character) {
  const level = getPrimaryClassLevel(character);
  const profile = getSpellcastingProfile(character);

  const rawCantrips = character.cls?.cantripProgression;
  const rawSpellsKnown = character.cls?.spellsKnownProgression;
  const rawPrepared = character.cls?.preparedSpellsProgression;

  const cantrips = rawCantrips?.[level - 1] ?? profile.cantripKnown?.[level - 1] ?? 0;

  let spells = rawPrepared?.[level - 1] ?? rawSpellsKnown?.[level - 1] ?? profile.preparedSpellsProgression?.[level - 1] ?? 0;

  if (rawSpellsKnown == null) {
    if (profile.spellsKnown) {
      spells = profile.spellsKnown[level - 1] ?? spells;
    } else if (profile.preparedFormula) {
      const ability = profile.preparedFormula.ability || profile.ability || 'int';
      spells = applyPreparedFormula(profile.preparedFormula, statMod(getFinalScore(character, ability)), level) ?? spells;
    }
  }
  return { cantrips, spells, profile };
}

export function maxSpellLevel(character) {
  const slotData = getSpellSlots(character);
  const fromSlots = (slotData.slots || []).reduce((max, count, index) => (count ? index + 1 : max), 0);
  return Math.max(fromSlots, slotData.pact?.level || slotData.pact?.l || 0);
}
