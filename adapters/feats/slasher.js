(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Slasher", [
      {
        name: "Slasher: Hamstring",
        icon: "activity",
        cat: "action",
        uses: "Passive",
        desc: "Once per turn when you hit a creature with a slashing weapon, reduce its Speed by 10 ft until the start of your next turn."
      },
      {
        name: "Slasher: Critical Strike",
        icon: "zap",
        cat: "action",
        uses: "Passive",
        desc: "On a critical hit with a slashing weapon, the target has Disadvantage on attack rolls until the start of your next turn."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
