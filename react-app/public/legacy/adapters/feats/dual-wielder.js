(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Dual Wielder", [
      {
        name: "Dual Wielder",
        icon: "swords",
        cat: "action",
        uses: "Passive",
        desc: "+1 AC while wielding a weapon in each hand. Two-Weapon Fighting attacks can use any one-handed weapon (not just Light). Can draw or stow two weapons simultaneously."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
