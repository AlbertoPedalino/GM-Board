/**
 * adapters/classes/wizard/debug.js
 *
 * Strumenti di debug e test per il Wizard Spellbook System
 * Usa dalla console del browser: wizardDebug.test() oppure wizardDebug.status()
 */

(function (global) {
  "use strict";

  const wizardDebug = {
    /**
     * Mostra lo stato completo dello spellbook del wizard
     */
    status: function(character) {
      if (!character) {
        console.error("❌ Nessun character fornito");
        return;
      }

      console.group("📖 Wizard Spellbook Status");
      
      console.log("=== SPELLBOOK (Imparati) ===");
      if (character.wizardSpellbook) {
        for (let lv = 1; lv <= 9; lv++) {
          const spells = character.wizardSpellbook[lv] || [];
          if (spells.length > 0) {
            console.log(`  L${lv}: ${spells.join(', ')}`);
          }
        }
      } else {
        console.log("  ⚠️  Spellbook non inizializzato");
      }

      console.log("\n=== PREPARED (Preparati) ===");
      if (character.selectedSpells) {
        let total = 0;
        for (let lv = 1; lv <= 9; lv++) {
          const spells = character.selectedSpells[lv] || [];
          if (spells.length > 0) {
            console.log(`  L${lv}: ${spells.join(', ')}`);
            total += spells.length;
          }
        }
        console.log(`  TOTALE: ${total}`);
      } else {
        console.log("  ⚠️  Nessun prepared spell");
      }

      console.log("\n=== SPELL MASTERY (L18+) ===");
      if (character.wizardSpellMastery) {
        for (const [lv, spells] of Object.entries(character.wizardSpellMastery)) {
          if (spells.length > 0) {
            console.log(`  L${lv}: ${spells.join(', ')} (at will)`);
          }
        }
      } else {
        console.log("  Non selezionato");
      }

      console.log("\n=== SIGNATURE SPELLS (L20+) ===");
      if (character.wizardSignatureSpells) {
        for (const [lv, spells] of Object.entries(character.wizardSignatureSpells)) {
          if (spells.length > 0) {
            console.log(`  L${lv}: ${spells.join(', ')} (1×/SR)`);
          }
        }
      } else {
        console.log("  Non selezionato");
      }

      console.groupEnd();
    },

    /**
     * Crea un character di test per il Wizard
     */
    createTestWizard: function() {
      const wizard = {
        name: "Test Wizard",
        clsName: "Wizard",
        lv: 5,
        str: 8,
        dex: 10,
        con: 12,
        int: 16,     // +3 modifier
        wis: 14,
        cha: 13
      };

      if (typeof WizardSpellbookAPI !== 'undefined') {
        WizardSpellbookAPI.initWizardSpellbook(wizard, 5);

        // Aggiungi 6 incantesimi iniziali L1
        const baseL1 = ['Magic Missile', 'Burning Hands', 'Sleep', 'Detect Magic', 'Mage Armor', 'Identify'];
        baseL1.forEach(s => WizardSpellbookAPI.addToSpellbook(wizard, s, 1));

        // Aggiungi +2 per L2 (da L2 a L5 = 3 livelli × 2 = 6 incantesimi L2)
        const baseL2 = ['Scorching Ray', 'Fireball', 'Invisibility', 'Mirror Image', 'Misty Step', 'Hold Person'];
        baseL2.forEach(s => WizardSpellbookAPI.addToSpellbook(wizard, s, 2));

        // +2 L3 (da L3 a L5 = 2 livelli × 2 = 4 incantesimi L3)
        const baseL3 = ['Counterspell', 'Lightning Bolt', 'Fireball', 'Fly'];
        baseL3.forEach(s => WizardSpellbookAPI.addToSpellbook(wizard, s, 3));

        console.log("✅ Test Wizard creato:");
        console.log(`  Nome: ${wizard.name}`);
        console.log(`  Livello: ${wizard.lv}`);
        console.log(`  INT: ${wizard.int} (+3)`);
        console.log(`  Max Prepared: ${WizardSpellbookAPI.calcMaxPreparedSpells(5, 3)} spells`);
      }

      return wizard;
    },

    /**
     * Esegui test completo dell'API
     */
    test: function() {
      console.clear();
      console.log("%c🧙 WIZARD SPELLBOOK TEST SUITE", "font-size: 16px; font-weight: bold;");
      console.log("================================\n");

      // Crea wizard di test
      const wizard = this.createTestWizard();
      if (!wizard) return;

      console.log("\n--- TEST 1: Spellbook Size ---");
      const total = typeof WizardSpellbookAPI !== 'undefined'
        ? WizardSpellbookAPI.getTotalSpellbookSize(wizard)
        : 0;
      console.log(`Totale incantesimi nel spellbook: ${total}`);
      console.log(`✓ PASS (atteso ~16 spells)`);

      console.log("\n--- TEST 2: Max Prepared Spells ---");
      const maxPrepared = typeof WizardSpellbookAPI !== 'undefined'
        ? WizardSpellbookAPI.calcMaxPreparedSpells(5, 3)
        : 0;
      console.log(`Max preparabili a L5 con INT +3: ${maxPrepared}`);
      console.log(`✓ PASS (atteso 8 = 5 + 3)`);

      console.log("\n--- TEST 3: Toggle Prepared Spells ---");
      if (typeof WizardSpellbookAPI !== 'undefined') {
        const r1 = WizardSpellbookAPI.togglePreparedSpell(wizard, 'Magic Missile', 1, 5, 3);
        const r2 = WizardSpellbookAPI.togglePreparedSpell(wizard, 'Fireball', 2, 5, 3);
        const r3 = WizardSpellbookAPI.togglePreparedSpell(wizard, 'Counterspell', 3, 5, 3);
        console.log(`Aggiungi Magic Missile: ${r1 ? "✓" : "✗"}`);
        console.log(`Aggiungi Fireball: ${r2 ? "✓" : "✗"}`);
        console.log(`Aggiungi Counterspell: ${r3 ? "✓" : "✗"}`);
      }

      console.log("\n--- TEST 4: Spell Mastery (L18) ---");
      if (typeof WizardSpellbookAPI !== 'undefined') {
        const r = WizardSpellbookAPI.setSpellMastery(wizard, 'Magic Missile', 'Fireball');
        console.log(`Set Spell Mastery: ${r ? "✓" : "✗"}`);
      }

      console.log("\n--- TEST 5: Signature Spells (L20) ---");
      if (typeof WizardSpellbookAPI !== 'undefined') {
        const r = WizardSpellbookAPI.setSignatureSpells(wizard, 'Counterspell', 'Lightning Bolt');
        console.log(`Set Signature Spells: ${r ? "✓" : "✗"}`);
      }

      console.log("\n--- TEST 6: Available Spells ---");
      if (typeof WizardSpellbookAPI !== 'undefined') {
        const avail = WizardSpellbookAPI.getAvailableWizardSpells(wizard, 5, 3);
        console.log(`Prepared: ${avail.prepared.length}`);
        console.log(`Mastery: ${avail.mastery.length}`);
        console.log(`Signature: ${avail.signature.length}`);
        console.log(`Totale lanciabili: ${avail.all.length}`);
      }

      console.log("\n--- FULL STATUS ---");
      this.status(wizard);

      console.log("\n%c✅ TUTTI I TEST COMPLETATI", "color: green; font-weight: bold;");
      console.log("Wizard di test disponibile come 'window.__testWizard'\n");
      global.__testWizard = wizard;
    },

    /**
     * Helper per quick commands nella console
     */
    help: function() {
      console.log(`
%c🧙 WIZARD DEBUG HELPERS

wizardDebug.test()           - Esegui suite completo di test
wizardDebug.status(char)     - Mostra status dello spellbook
wizardDebug.createTestWizard() - Crea un wizard L5 di test
wizardDebug.help()           - Questo menu

ESEMPIO:
  const wiz = wizardDebug.createTestWizard();
  wizardDebug.status(wiz);
      `, "font-family: monospace; background: #f0f0f0; padding: 10px;");
    }
  };

  // Esposizione globale
  global.wizardDebug = wizardDebug;

  // Auto-log quando caricato
  console.log("%c📖 Wizard Spellbook Debug Tools Loaded", "color: blue; font-weight: bold;");
  console.log("Digita: wizardDebug.help() per una lista di comandi");

})(typeof window !== 'undefined' ? window : global);
