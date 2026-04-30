(function (global) {
  "use strict";

  if (typeof global.registerFeatAdapter === "function") {
    global.registerFeatAdapter("Spell Sniper", function (feat) {
      return {
        ...feat,
        choiceUi: {
          ...(feat.choiceUi && typeof feat.choiceUi === "object" ? feat.choiceUi : {}),
          spellAbility: {
            keySuffix: "spell_ability",
            label: "Spellcasting Ability",
            options: [
              { value: "int", label: "Intelligence" },
              { value: "wis", label: "Wisdom" },
              { value: "cha", label: "Charisma" }
            ]
          }
        }
      };
    });
  }

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Spell Sniper", [
      {
        name: "Spell Sniper",
        icon: "crosshair",
        cat: "action",
        uses: "Passive",
        desc: "You learn one cantrip that requires an attack roll from any class. Double the range of spells that require attack rolls. Your ranged spell attacks ignore half and three-quarters cover."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
