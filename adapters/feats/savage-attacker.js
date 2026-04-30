(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Savage Attacker", [
      {
        name: "Savage Attacker",
        icon: "activity",
        cat: "action",
        uses: "Passive",
        desc: "Once per turn when you roll damage for a melee weapon attack, reroll the weapon's damage dice and use either result."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
