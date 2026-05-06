(function (global) {
  "use strict";

  if (typeof global.registerClassRuntimeConfig !== "function") return;

  function regClass(name, cfg) {
    global.registerClassRuntimeConfig(name, cfg || {});
  }
  function regSubclass(key, cfg) {
    if (typeof global.registerSubclassRuntimeConfig === "function") {
      global.registerSubclassRuntimeConfig(key, cfg || {});
    }
  }
  function regSpecies(key, cfg) {
    if (typeof global.registerSpeciesRuntimeConfig === "function") {
      global.registerSpeciesRuntimeConfig(key, cfg || {});
    }
  }

  // XPHB 2024 fixed prepared-spell tables (source: 5etools class JSON)
  const _PREP_FULL      = [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22];
  const _PREP_WIZARD    = [4,5,6,7,9,10,11,12,14,15,16,16,17,18,19,21,22,23,24,25];
  const _PREP_HALF      = [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15];
  const _PREP_THIRD     = [0,0,3,4,4,4,5,6,6,7,8,8,9,10,10,11,11,11,12,13];
  const _PREP_SORCERER  = [2,4,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22];
  const _PREP_WARLOCK   = [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15];

  regClass("Barbarian", {
    multiclassPrerequisites: [{ str: 13 }],
    unarmoredDefense: [{ name: "Unarmored Defense", base: 10, abilities: ["dex", "con"], allowShield: true, minLevel: 1 }],
  });
  regClass("Bard", {
    multiclassPrerequisites: [{ cha: 13 }],
    spellcasting: {
      ability: "cha",
      casterProgression: "full",
      preparedMode: "known",
      cantripKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      spellsKnown: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 19, 20, 22, 22, 22],
      preparedSpellsProgression: _PREP_FULL,
    },
    skillRules: { jackOfAllTradesMinLevel: 2 },
    featureDice: {
      bardicInspiration: [
        { minLevel: 15, faces: 12 },
        { minLevel: 10, faces: 10 },
        { minLevel: 5, faces: 8 },
        { minLevel: 1, faces: 6 },
      ],
    },
  });
  regClass("Cleric", {
    multiclassPrerequisites: [{ wis: 13 }],
    spellcasting: {
      ability: "wis",
      casterProgression: "full",
      preparedMode: "prepared",
      cantripKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      preparedSpellsProgression: _PREP_FULL,
      preparedFormula: { ability: "wis", addLevel: true, levelDivisor: 1, levelRound: "floor", min: 1 },
      ritualCasting: true,
      choiceSpellSources: {
        cleric_thaumaturge_cantrip: { label: "Divine Order (Thaumaturge)", ability: "wis" },
      },
    },
  });
  regClass("Druid", {
    multiclassPrerequisites: [{ wis: 13 }],
    spellcasting: {
      ability: "wis",
      casterProgression: "full",
      preparedMode: "prepared",
      cantripKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      preparedSpellsProgression: _PREP_FULL,
      preparedFormula: { ability: "wis", addLevel: true, levelDivisor: 1, levelRound: "floor", min: 1 },
      ritualCasting: true,
      choiceSpellSources: {
        druid_magician_cantrip: { label: "Primal Order (Magician)", ability: "wis" },
      },
    },
  });
  regClass("Fighter", {
    multiclassPrerequisites: [{ str: 13 }, { dex: 13 }],
  });
  regClass("Monk", {
    multiclassPrerequisites: [{ dex: 13, wis: 13 }],
    unarmoredDefense: [{ name: "Unarmored Defense", base: 10, abilities: ["dex", "wis"], allowShield: false, minLevel: 1 }],
  });
  regClass("Paladin", {
    multiclassPrerequisites: [{ str: 13, cha: 13 }],
    spellcasting: {
      ability: "cha",
      casterProgression: "half",
      preparedMode: "prepared",
      preparedSpellsProgression: _PREP_HALF,
      preparedFormula: { ability: "cha", addLevel: true, levelDivisor: 2, levelRound: "floor", min: 1 },
    },
  });
  regClass("Ranger", {
    multiclassPrerequisites: [{ dex: 13, wis: 13 }],
    spellcasting: {
      ability: "wis",
      casterProgression: "half",
      preparedMode: "known",
      spellsKnown: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
      preparedSpellsProgression: _PREP_HALF,
    },
  });
  regClass("Rogue", {
    multiclassPrerequisites: [{ dex: 13 }],
  });
  regClass("Sorcerer", {
    multiclassPrerequisites: [{ cha: 13 }],
    spellcasting: {
      ability: "cha",
      casterProgression: "full",
      preparedMode: "known",
      cantripKnown: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
      preparedSpellsProgression: _PREP_SORCERER,
    },
  });
  regClass("Warlock", {
    multiclassPrerequisites: [{ cha: 13 }],
    spellcasting: {
      ability: "cha",
      casterProgression: "pact",
      preparedMode: "known",
      cantripKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
      preparedSpellsProgression: _PREP_WARLOCK,
      choiceSpellSources: {
        warlock_tome_cantrip_1: { label: "Pact of the Tome", ability: "cha" },
        warlock_tome_cantrip_2: { label: "Pact of the Tome", ability: "cha" },
        warlock_tome_cantrip_3: { label: "Pact of the Tome", ability: "cha" },
      },
    },
  });
  regClass("Wizard", {
    multiclassPrerequisites: [{ int: 13 }],
    spellcasting: {
      ability: "int",
      casterProgression: "full",
      preparedMode: "prepared",
      cantripKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      preparedSpellsProgression: _PREP_WIZARD,
      preparedFormula: { ability: "int", addLevel: true, levelDivisor: 1, levelRound: "floor", min: 1 },
      ritualCasting: true,
      choiceSpellSources: {
        wizard_spell_mastery_l1: { label: "Spell Mastery (Lv.18)", ability: "int" },
        wizard_spell_mastery_l2: { label: "Spell Mastery (Lv.18)", ability: "int" },
        wizard_signature_1: { label: "Signature Spell (Lv.20)", ability: "int" },
        wizard_signature_2: { label: "Signature Spell (Lv.20)", ability: "int" },
      },
    },
  });
  regClass("Artificer", {
    multiclassPrerequisites: [{ int: 13 }],
    spellcasting: {
      ability: "int",
      casterProgression: "artificer",
      preparedMode: "prepared",
      preparedSpellsProgression: _PREP_HALF,
      preparedFormula: { ability: "int", addLevel: true, levelDivisor: 2, levelRound: "ceil", min: 1 },
      cantripKnown: [2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3],
      ritualCasting: true,
    },
  });

  regSubclass("Bard_Dance", {
    unarmoredDefense: [{ name: "Dance of the Wind", base: 10, abilities: ["dex", "cha"], allowShield: false, minLevel: 3 }],
    unarmedStrike: {
      minLevel: 3,
      requiresNoArmor: true,
      requiresNoShield: true,
      attackAbility: "dex",
      damage: {
        kind: "featureDie",
        className: "Bard",
        feature: "bardicInspiration",
        ability: "dex",
        label: "Bardic Damage (Unarmed)",
      },
      badge: "Bardic Damage",
    },
  });
  regSubclass("Fighter_Eldritch Knight", {
    spellcasting: {
      ability: "int",
      casterProgression: "1/3",
      preparedSpellsProgression: _PREP_THIRD,
      choiceSpellSources: {
        subclass_ek_cantrip_1: { label: "Eldritch Knight", ability: "int" },
        subclass_ek_cantrip_2: { label: "Eldritch Knight", ability: "int" },
      },
    },
  });
  regSubclass("Paladin_Noble Genies", {
    unarmoredDefense: [{ name: "Genie's Splendor", base: 10, abilities: ["dex", "cha"], allowShield: true, minLevel: 3 }],
  });
  regSubclass("Rogue_Arcane Trickster", {
    spellcasting: {
      ability: "int",
      casterProgression: "1/3",
      preparedSpellsProgression: _PREP_THIRD,
      choiceSpellSources: {
        subclass_at_cantrip_1: { label: "Arcane Trickster", ability: "int" },
        subclass_at_cantrip_2: { label: "Arcane Trickster", ability: "int" },
      },
    },
  });

  regSpecies("Dwarf_XPHB", {
    hitPoints: { bonusPerLevel: 1 },
  });
  regSpecies("Hill Dwarf_XPHB", {
    hitPoints: { bonusPerLevel: 1 },
  });
  regSpecies("Dwarf_PHB", {
    hitPoints: { bonusPerLevel: 1 },
  });
  regSpecies("Hill Dwarf_PHB", {
    hitPoints: { bonusPerLevel: 1 },
  });
})(typeof window !== "undefined" ? window : globalThis);
