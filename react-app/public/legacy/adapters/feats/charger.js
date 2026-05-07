(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Charger", [
      {
        name: "Charge Attack",
        icon: "wind",
        cat: "action",
        uses: "Bonus Action",
        desc: "When you take the Dash action, you can make one melee weapon attack or shove a creature as a Bonus Action. If you moved 10+ ft in a straight line before hitting, deal an extra 1d8 damage (once per turn)."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
