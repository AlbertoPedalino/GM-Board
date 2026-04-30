(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Great Weapon Master", [
      {
        name: "Cleave",
        icon: "swords",
        cat: "action",
        uses: "Bonus Action",
        desc: "When you score a critical hit or reduce a creature to 0 HP with a Heavy melee weapon, make one more melee attack with a Heavy weapon as a Bonus Action."
      },
      {
        name: "Great Weapon Master: Bonus Damage",
        icon: "swords",
        cat: "action",
        uses: "Passive",
        desc: "When you hit with a Heavy weapon attack, add your Proficiency Bonus to the damage roll."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
