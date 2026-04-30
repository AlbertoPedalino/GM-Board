(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Skulker", [
      {
        name: "Skulker",
        icon: "eye-off",
        cat: "action",
        uses: "Passive",
        desc: "You can Hide when only Lightly Obscured. A missed ranged attack doesn't reveal your position when Hidden. No Disadvantage on Wisdom (Perception) checks that rely on sight while in dim light."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
