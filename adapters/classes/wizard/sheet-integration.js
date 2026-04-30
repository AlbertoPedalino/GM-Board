/**
 * adapters/classes/wizard/sheet-integration.js
 *
 * Integrazione con character-sheet.html per la gestione dello spellbook del Wizard
 * Usa la WizardSpellbookAPI per validare e gestire spell picking
 */

(function (global) {
  "use strict";

  /**
   * Calcola il limite di incantesimi preparati per il Wizard nel sheet
   * Modifica la logica di _clsSpellLimit per il Wizard
   */
  function wizardSpellLimit(cls, character, isCantrip) {
    if (!character || isCantrip) return null;

    // Usa WizardSpellbookAPI se disponibile
    if (typeof WizardSpellbookAPI === 'undefined') return null;

    // Calcola il modificatore INT
    let intMod = 0;
    if (typeof getFinal === 'function') {
      intMod = getMod(getFinal('int')) || 0;
    }

    const maxPrepared = WizardSpellbookAPI.calcMaxPreparedSpells(cls.lv, intMod);
    const currentPrepared = Object.values(character.selectedSpells || {}).flat().length;

    return { max: maxPrepared, current: currentPrepared };
  }

  /**
   * Valida quando il player tenta di aggiungere/rimuovere un incantesimo preparato
   */
  function validateWizardSpellToggle(character, spellName, spellLevel, wizardLevel, intModifier) {
    if (!character || typeof WizardSpellbookAPI === 'undefined') return true;

    // Se rimuove, sempre OK
    if (character.selectedSpells && character.selectedSpells[spellLevel]) {
      if (character.selectedSpells[spellLevel].includes(spellName)) {
        return true; // Rimozione sempre consentita
      }
    }

    // Se aggiunge, verifica il limite
    const maxPrepared = WizardSpellbookAPI.calcMaxPreparedSpells(wizardLevel, intModifier);
    const currentPrepared = Object.values(character.selectedSpells || {}).flat().length;

    return currentPrepared < maxPrepared;
  }

  /**
   * Mostra il numero di incantesimi nel spellbook totale
   */
  function getWizardSpellbookSize(character) {
    if (typeof WizardSpellbookAPI === 'undefined') return 0;
    return WizardSpellbookAPI.getTotalSpellbookSize(character);
  }

  /**
   * Controlla se un incantesimo è nel spellbook (per il picker, per mostrare diversamente)
   */
  function isWizardSpellLearned(character, spellName, spellLevel) {
    if (typeof WizardSpellbookAPI === 'undefined') return true; // Se API non caricata, assume true
    return WizardSpellbookAPI.isInSpellbook(character, spellName, spellLevel);
  }

  /**
   * Aggiunge un incantesimo al spellbook (quando scoperto o levelato)
   */
  function learnWizardSpell(character, spellName, spellLevel) {
    if (typeof WizardSpellbookAPI === 'undefined') return false;
    return WizardSpellbookAPI.addToSpellbook(character, spellName, spellLevel);
  }

  /**
   * Rimuove un incantesimo dal spellbook
   */
  function forgetWizardSpell(character, spellName, spellLevel) {
    if (typeof WizardSpellbookAPI === 'undefined') return false;
    return WizardSpellbookAPI.removeFromSpellbook(character, spellName, spellLevel);
  }

  /**
   * Sincronizza i prepared spells con il limite
   */
  function syncWizardPreparedSpells(character, wizardLevel, intModifier) {
    if (typeof WizardSpellbookAPI === 'undefined') return;
    WizardSpellbookAPI.validatePreparedSpells(character, wizardLevel, intModifier);
  }

  /**
   * Imposta Spell Mastery (L18)
   */
  function setWizardSpellMastery(character, spellL1Name, spellL2Name) {
    if (typeof WizardSpellbookAPI === 'undefined') return false;
    return WizardSpellbookAPI.setSpellMastery(character, spellL1Name, spellL2Name);
  }

  /**
   * Imposta Signature Spells (L20)
   */
  function setWizardSignatureSpells(character, spell1Name, spell2Name) {
    if (typeof WizardSpellbookAPI === 'undefined') return false;
    return WizardSpellbookAPI.setSignatureSpells(character, spell1Name, spell2Name);
  }

  /**
   * Ottiene la lista di spell mastery e signature spells
   */
  function getWizardBonusSpells(character) {
    if (typeof WizardSpellbookAPI === 'undefined') return { mastery: [], signature: [] };

    const mastery = character.wizardSpellMastery ? Object.values(character.wizardSpellMastery).flat() : [];
    const signature = character.wizardSignatureSpells ? Object.values(character.wizardSignatureSpells).flat() : [];

    return { mastery, signature };
  }

  /**
   * Crea un oggetto di debug per il spellbook del Wizard
   */
  function debugWizardSpellbook(character) {
    if (!character) return null;

    return {
      totalSpellbookSize: getWizardSpellbookSize(character),
      spellbook: character.wizardSpellbook || {},
      prepared: character.selectedSpells || {},
      mastery: character.wizardSpellMastery || {},
      signature: character.wizardSignatureSpells || {}
    };
  }

  /* ── Esposizione globale ──────────────────────────────────────── */
  global.WizardSheetIntegration = {
    wizardSpellLimit,
    validateWizardSpellToggle,
    getWizardSpellbookSize,
    isWizardSpellLearned,
    learnWizardSpell,
    forgetWizardSpell,
    syncWizardPreparedSpells,
    setWizardSpellMastery,
    setWizardSignatureSpells,
    getWizardBonusSpells,
    debugWizardSpellbook
  };

})(typeof window !== 'undefined' ? window : global);
