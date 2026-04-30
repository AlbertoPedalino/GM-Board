/**
 * adapters/classes/wizard/spellbook.js
 * Wizard spellbook helpers
 */

(function (global) {
  "use strict";

  const WIZARD_PROGRESSION = {
    // L1 = 6 spells, poi +2 per livello
    spellbookProgression: [6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    preparedFormula: { ability: "int", base: 1, modifier: 1 },
  };

  function initWizardSpellbook(character) {
    if (!character) return;
    if (!character.wizardSpellbook || typeof character.wizardSpellbook !== "object") {
      character.wizardSpellbook = {};
    }
    if (!Array.isArray(character.wizardSpellbook[0])) {
      character.wizardSpellbook[0] = [];
    }
    for (let i = 1; i <= 9; i++) {
      if (!Array.isArray(character.wizardSpellbook[i])) {
        character.wizardSpellbook[i] = [];
      }
    }
  }

  function calcMaxPreparedSpells(wizardLevel, intModifier, maxOverride) {
    if (Number.isFinite(maxOverride)) return Math.max(0, Number(maxOverride));
    if (!Number.isFinite(wizardLevel) || wizardLevel < 1) return 0;
    if (!Number.isFinite(intModifier)) intModifier = 0;
    // PHB/XPHB: minimo 1 spell preparato
    return Math.max(1, wizardLevel + intModifier);
  }

  function getExpectedMinSpellbookSize(wizardLevel) {
    const lv = Number(wizardLevel || 0);
    if (!Number.isFinite(lv) || lv < 1) return 0;
    return 6 + Math.max(0, lv - 1) * 2;
  }

  function getAvailableWizardSpells(character) {
    if (!character) return { prepared: [], mastery: [], signature: [], all: [] };

    const prepared = character.selectedSpells ? Object.values(character.selectedSpells).flat() : [];
    const mastery = character.wizardSpellMastery ? Object.values(character.wizardSpellMastery).flat() : [];
    const signature = character.wizardSignatureSpells ? Object.values(character.wizardSignatureSpells).flat() : [];

    return {
      prepared,
      mastery,
      signature,
      all: [...new Set([...prepared, ...mastery, ...signature])],
    };
  }

  function getTotalSpellbookSize(character) {
    if (!character || !character.wizardSpellbook) return 0;
    return Object.values(character.wizardSpellbook).reduce((sum, spells) => sum + (Array.isArray(spells) ? spells.length : 0), 0);
  }

  function isInSpellbook(character, spellName, spellLevel) {
    if (!character || !character.wizardSpellbook || !Number.isFinite(Number(spellLevel))) return false;
    const spells = character.wizardSpellbook[spellLevel] || [];
    return spells.some((s) => s === spellName || (typeof s === "object" && s.name === spellName));
  }

  function addToSpellbook(character, spellName, spellLevel) {
    if (!character || !spellName || !Number.isFinite(Number(spellLevel))) return false;

    initWizardSpellbook(character);
    if (!character.wizardSpellbook[spellLevel]) character.wizardSpellbook[spellLevel] = [];

    if (!isInSpellbook(character, spellName, spellLevel)) {
      character.wizardSpellbook[spellLevel].push(spellName);
      return true;
    }
    return false;
  }

  function removeFromSpellbook(character, spellName, spellLevel) {
    if (!character || !character.wizardSpellbook || !Number.isFinite(Number(spellLevel))) return false;

    const spells = character.wizardSpellbook[spellLevel] || [];
    const idx = spells.indexOf(spellName);
    if (idx >= 0) {
      spells.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Backward compatibility: copy existing prepared spells into spellbook once
  function syncSpellbookFromPrepared(character) {
    if (!character) return;
    initWizardSpellbook(character);

    Object.entries(character.selectedSpells || {}).forEach(([lvRaw, spells]) => {
      const lv = Number(lvRaw);
      if (!Number.isFinite(lv) || lv < 1 || lv > 9 || !Array.isArray(spells)) return;
      spells.forEach((name) => {
        if (name) addToSpellbook(character, name, lv);
      });
    });
    (character.selectedCantrips || []).forEach((name) => {
      if (name) addToSpellbook(character, name, 0);
    });
  }

  function validatePreparedSpells(character, level, intMod, maxPreparedOverride) {
    if (!character || !character.selectedSpells) return;

    // prepared subset of spellbook
    if (character.wizardSpellbook) {
      if (Array.isArray(character.selectedCantrips)) {
        character.selectedCantrips = character.selectedCantrips.filter((sp) => isInSpellbook(character, sp, 0));
      }
      Object.entries(character.selectedSpells).forEach(([lvRaw, arr]) => {
        const lv = Number(lvRaw);
        if (!Number.isFinite(lv) || !Array.isArray(arr)) return;
        character.selectedSpells[lv] = arr.filter((sp) => isInSpellbook(character, sp, lv));
      });
    }

    const maxPrepared = calcMaxPreparedSpells(level, intMod, maxPreparedOverride);
    let totalPrepared = Object.values(character.selectedSpells).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);

    if (totalPrepared > maxPrepared) {
      for (let lv = 1; lv <= 9 && totalPrepared > maxPrepared; lv++) {
        if (character.selectedSpells[lv] && character.selectedSpells[lv].length > 0) {
          const toRemove = Math.min(character.selectedSpells[lv].length, totalPrepared - maxPrepared);
          character.selectedSpells[lv].splice(-toRemove);
          totalPrepared -= toRemove;
        }
      }
    }
  }

  function togglePreparedSpell(character, spellName, spellLevel, level, intMod, maxPreparedOverride) {
    if (!character || !spellName || !spellLevel) return false;

    if (!character.selectedSpells) character.selectedSpells = {};
    if (!character.selectedSpells[spellLevel]) character.selectedSpells[spellLevel] = [];

    const spells = character.selectedSpells[spellLevel];
    const idx = spells.indexOf(spellName);

    if (idx >= 0) {
      spells.splice(idx, 1);
      return true;
    }

    // add only if spell is known in book
    if (!isInSpellbook(character, spellName, spellLevel)) return false;

    const maxPrepared = calcMaxPreparedSpells(level, intMod, maxPreparedOverride);
    const totalPrepared = Object.values(character.selectedSpells).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);

    if (totalPrepared < maxPrepared) {
      spells.push(spellName);
      return true;
    }
    return false;
  }

  function setSpellMastery(character, spell1Name, spell2Name) {
    if (!character) return false;
    if (!character.wizardSpellMastery) character.wizardSpellMastery = {};
    character.wizardSpellMastery[1] = [spell1Name];
    character.wizardSpellMastery[2] = [spell2Name];
    return true;
  }

  function setSignatureSpells(character, spell1Name, spell2Name) {
    if (!character) return false;
    if (!character.wizardSignatureSpells) character.wizardSignatureSpells = {};
    character.wizardSignatureSpells[3] = [spell1Name, spell2Name];
    return true;
  }

  global.WizardSpellbookAPI = {
    initWizardSpellbook,
    syncSpellbookFromPrepared,
    calcMaxPreparedSpells,
    getExpectedMinSpellbookSize,
    getAvailableWizardSpells,
    getTotalSpellbookSize,
    isInSpellbook,
    addToSpellbook,
    removeFromSpellbook,
    validatePreparedSpells,
    togglePreparedSpell,
    setSpellMastery,
    setSignatureSpells,
    WIZARD_PROGRESSION,
  };
})(typeof window !== "undefined" ? window : global);
