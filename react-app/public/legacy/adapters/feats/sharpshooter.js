(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Sharpshooter", [
      {
        name: "Sharpshooter",
        icon: "crosshair",
        cat: "action",
        uses: "Passive",
        desc: "No Disadvantage on ranged attack rolls at long range. Ignore half and three-quarters cover. Once per turn when you hit with a ranged weapon, deal extra damage equal to your Proficiency Bonus."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
