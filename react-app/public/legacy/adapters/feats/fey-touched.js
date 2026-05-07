(function (global) {
  "use strict";

  if (typeof global.registerFeatAdapter !== "function") return;

  global.registerFeatAdapter("Fey Touched", function (feat) {
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
})(typeof window !== "undefined" ? window : globalThis);
