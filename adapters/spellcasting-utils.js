/**
 * adapters/spellcasting-utils.js
 * Shared spellcasting helpers used by both charbuilder and character-sheet.
 * Requires: FULL_SLOTS, HALF_SLOTS, PACT_SLOTS (from spell-slots.js)
 *           getClassRuntimeConfig, getSubclassRuntimeConfig (from registry.js)
 */
import { getClassRuntimeConfig, getSubclassRuntimeConfig } from './registry.js';
import { FULL_SLOTS, HALF_SLOTS, THIRD_SLOTS, PACT_SLOTS } from './spell-slots.js';

export function normCasterProg(v) {
  const s = String(v || '').toLowerCase().trim();
  if (s === 'full') return 'full';
  if (s === 'half' || s === '1/2') return 'half';
  if (s === 'artificer') return 'artificer';
  if (s === 'pact') return 'pact';
  if (s === '1/3' || s === 'third') return '1/3';
  return s || null;
}

export function getCasterContribution(prog, level) {
  const lv = Number(level || 0);
  if (!Number.isFinite(lv) || lv <= 0) return 0;
  const p = normCasterProg(prog);
  if (p === 'full') return lv;
  if (p === 'half') return Math.ceil(lv / 2);
  if (p === 'artificer') return Math.ceil(lv / 2);
  if (p === '1/3') return Math.floor(lv / 3);
  return 0;
}

export function getMaxCastableLevel(prog, lv) {
  const p = normCasterProg(prog);
  const l = Math.min(Number(lv) || 0, 20);
  if (p === 'pact') return (PACT_SLOTS[l] && PACT_SLOTS[l].l) ? PACT_SLOTS[l].l : 0;
  const slots = (p === 'full') ? FULL_SLOTS[l]
    : (p === 'half') ? HALF_SLOTS[l]
    : (p === 'artificer') ? FULL_SLOTS[Math.min(20, Math.ceil(l / 2))]
    : (p === '1/3') ? THIRD_SLOTS[l]
    : null;
  if (!slots) return 0;
  let max = 0;
  for (let i = 0; i < slots.length; i++) if (slots[i] > 0) max = i + 1;
  return max;
}

export function applyPreparedFormula(formula, abilityMod, lv) {
  if (!formula || typeof formula !== 'object') return null;
  const divisor = Number(formula.levelDivisor || 1) || 1;
  const rawLv = Number(lv || 1) / divisor;
  const lvTerm = String(formula.levelRound || 'floor') === 'ceil' ? Math.ceil(rawLv) : Math.floor(rawLv);
  const addLv = formula.addLevel ? lvTerm : 0;
  const min = Number(formula.min || 0);
  const total = abilityMod + addLv;
  return Number.isFinite(min) ? Math.max(min, total) : total;
}

export function getSpellcastingProfile(clsName, scName, clsSnap) {
  const classCfg = getClassRuntimeConfig(clsName);
  const classSp = (classCfg && classCfg.spellcasting && typeof classCfg.spellcasting === 'object')
    ? classCfg.spellcasting : {};
  let subSp = {};
  if (scName) {
    const subCfg = getSubclassRuntimeConfig(clsName, scName);
    subSp = (subCfg && subCfg.spellcasting && typeof subCfg.spellcasting === 'object')
      ? subCfg.spellcasting : {};
  }
  const merged = Object.assign({}, classSp, subSp);
  if (!merged.casterProgression && clsSnap && clsSnap.casterProgression)
    merged.casterProgression = clsSnap.casterProgression;
  return merged;
}

const _glob = typeof window !== 'undefined' ? window : null;
if (_glob) {
  _glob.normCasterProg = normCasterProg;
  _glob.getCasterContribution = getCasterContribution;
  _glob.getMaxCastableLevel = getMaxCastableLevel;
  _glob.applyPreparedFormula = applyPreparedFormula;
  _glob.getSpellcastingProfile = getSpellcastingProfile;
}
