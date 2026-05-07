(function (global) {
  "use strict";

  if (typeof global.registerFeatAdapter === "function") {
    global.registerFeatAdapter("Elemental Adept", function (feat) {
      return {
        ...feat,
        choiceUi: {
          ...(feat.choiceUi && typeof feat.choiceUi === "object" ? feat.choiceUi : {}),
          damageType: {
            keySuffix: "damage_type",
            label: "Energy Mastery",
            options: [
              { value: "acid",      label: "Acid" },
              { value: "cold",      label: "Cold" },
              { value: "fire",      label: "Fire" },
              { value: "lightning", label: "Lightning" },
              { value: "thunder",   label: "Thunder" }
            ]
          }
        }
      };
    });
  }

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Elemental Adept", [
      {
        name: "Energy Mastery",
        icon: "zap",
        cat: "action",
        uses: "Passive",
        desc: "Your spells ignore Resistance to your chosen damage type (Acid, Cold, Fire, Lightning, or Thunder). When you roll damage for a spell of that type, treat any 1 on a die as a 2. Can be taken multiple times for different types."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
