(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Mage Slayer", [
      {
        name: "Mage Slayer: Interrupt",
        icon: "zap-off",
        cat: "action",
        uses: "Reaction",
        desc: "When a creature within your reach casts a spell, make one melee weapon attack against that creature."
      },
      {
        name: "Mage Slayer: Resilience",
        icon: "shield",
        cat: "action",
        uses: "Passive",
        desc: "Advantage on saving throws against spells cast by creatures within 5 ft of you."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
