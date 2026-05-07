(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Tavern Brawler", [
      {
        name: "Unarmed Strike",
        icon: "hand",
        cat: "action",
        uses: "Passive",
        desc: "Proficiency with improvised weapons. Your unarmed strikes deal 1d4 + Strength modifier bludgeoning damage."
      },
      {
        name: "Grapple Attempt",
        icon: "hand",
        cat: "action",
        uses: "Bonus Action",
        desc: "When you hit a creature with an unarmed strike or an improvised weapon, attempt to Grapple that creature as a Bonus Action."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
