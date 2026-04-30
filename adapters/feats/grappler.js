(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Grappler", [
      {
        name: "Grappler",
        icon: "hand",
        cat: "action",
        uses: "Passive",
        desc: "Advantage on attack rolls against a creature you are Grappling. You can Grapple creatures up to one size larger than you. When you hit a Grappled creature, deal an extra 1d6 damage."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
