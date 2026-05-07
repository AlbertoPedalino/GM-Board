/**
 * adapters/spellcasting-utils.js
 * Shared spellcasting helpers used by both charbuilder.html and character-sheet.html.
 * Requires: FULL_SLOTS, HALF_SLOTS, PACT_SLOTS (from spell-slots.js)
 *           getClassRuntimeConfig, getSubclassRuntimeConfig (from runtime-config.js)
 */
(function (g) {

  // Normalize caster progression string to canonical form
  g.normCasterProg = function (v) {
    const s = String(v || '').toLowerCase().trim();
    if (s === 'full') return 'full';
    if (s === 'half' || s === '1/2') return 'half';
    if (s === 'artificer') return 'artificer';
    if (s === 'pact') return 'pact';
    if (s === '1/3' || s === 'third') return '1/3';
    return s || null;
  };

  // Caster level contribution to shared multiclass pool (pact excluded).
  // 2024 rules: Paladin/Ranger count as half, rounded up.
  g.getCasterContribution = function (prog, level) {
    const lv = Number(level || 0);
    if (!Number.isFinite(lv) || lv <= 0) return 0;
    const p = g.normCasterProg(prog);
    if (p === 'full') return lv;
    if (p === 'half') return Math.ceil(lv / 2);
    if (p === 'artificer') return Math.ceil(lv / 2);
    if (p === '1/3') return Math.floor(lv / 3);
    return 0;
  };

  // Max castable spell level for a standalone caster class at given level (not MC pool)
  g.getMaxCastableLevel = function (prog, lv) {
    const p = g.normCasterProg(prog);
    const l = Math.min(Number(lv) || 0, 20);
    const pact = g.PACT_SLOTS || [];
    if (p === 'pact') return (pact[l] && pact[l].l) ? pact[l].l : 0;
    const full = g.FULL_SLOTS || [];
    const half = g.HALF_SLOTS || [];
    const third = g.THIRD_SLOTS || [];
    const slots = (p === 'full') ? full[l]
      : (p === 'half') ? half[l]
      : (p === 'artificer') ? full[Math.min(20, Math.ceil(l / 2))]
      : (p === '1/3') ? third[l]
      : null;
    if (!slots) return 0;
    let max = 0;
    for (let i = 0; i < slots.length; i++) if (slots[i] > 0) max = i + 1;
    return max;
  };

  // Apply a prepared spell formula given a pre-computed abilityMod and class level
  g.applyPreparedFormula = function (formula, abilityMod, lv) {
    if (!formula || typeof formula !== 'object') return null;
    const divisor = Number(formula.levelDivisor || 1) || 1;
    const rawLv = Number(lv || 1) / divisor;
    const lvTerm = String(formula.levelRound || 'floor') === 'ceil' ? Math.ceil(rawLv) : Math.floor(rawLv);
    const addLv = formula.addLevel ? lvTerm : 0;
    const min = Number(formula.min || 0);
    const total = abilityMod + addLv;
    return Number.isFinite(min) ? Math.max(min, total) : total;
  };

  // Merged spellcasting profile from runtime config (class + subclass) with clsSnap fallback
  g.getSpellcastingProfile = function (clsName, scName, clsSnap) {
    const classCfg = typeof getClassRuntimeConfig === 'function' ? getClassRuntimeConfig(clsName) : {};
    const classSp = (classCfg && classCfg.spellcasting && typeof classCfg.spellcasting === 'object')
      ? classCfg.spellcasting : {};
    let subSp = {};
    if (scName && typeof getSubclassRuntimeConfig === 'function') {
      const subCfg = getSubclassRuntimeConfig(clsName, scName);
      subSp = (subCfg && subCfg.spellcasting && typeof subCfg.spellcasting === 'object')
        ? subCfg.spellcasting : {};
    }
    const merged = Object.assign({}, classSp, subSp);
    if (!merged.casterProgression && clsSnap && clsSnap.casterProgression)
      merged.casterProgression = clsSnap.casterProgression;
    return merged;
  };

})(typeof window !== 'undefined' ? window : globalThis);
