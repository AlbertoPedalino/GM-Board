(function (global) {
  "use strict";

  if (typeof global.registerFeatAdapter === "function") {
    global.registerFeatAdapter("Ritual Caster", function (feat) {
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
    global.registerFeatSheetActions("Ritual Caster", [
      {
        name: "Ritual Casting",
        icon: "book-open",
        cat: "action",
        uses: "Passive",
        desc: "You have a ritual book. When you gain this feat, add two 1st-level ritual spells from the chosen class. Cast any ritual spell from your book in 10 extra minutes without expending a spell slot. Add rituals by copying from scrolls or spellbooks."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
