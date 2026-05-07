(function (global) {
  "use strict";

  if (typeof global.registerFeatAdapter === "function") {
    global.registerFeatAdapter("Artificer Initiate", function (feat) {
      return {
        ...feat,
        choiceUi: {
          ...(feat.choiceUi && typeof feat.choiceUi === "object" ? feat.choiceUi : {}),
          spellAbility: {
            keySuffix: "spell_ability",
            label: "Spellcasting Ability",
            options: [
              { value: "int", label: "Intelligence" }
            ]
          }
        }
      };
    });
  }

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Artificer Initiate", [
      {
        name: "Artificer Cantrip & Spell",
        icon: "flask-conical",
        cat: "action",
        uses: "Passive",
        desc: "You know one Artificer cantrip and one 1st-level Artificer spell. Cast the 1st-level spell once per Long Rest without a spell slot (or using slots). Intelligence is your spellcasting ability. You gain proficiency with one artisan's tool usable as a spellcasting focus."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
