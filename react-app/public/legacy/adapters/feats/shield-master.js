(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Shield Master", [
      {
        name: "Shield Shove",
        icon: "shield",
        cat: "action",
        uses: "Bonus Action",
        desc: "If you attack with a weapon on your turn, shove a creature within 5 ft as a Bonus Action."
      },
      {
        name: "Shield Defense",
        icon: "shield",
        cat: "action",
        uses: "Passive",
        desc: "Add your shield's AC bonus to Dexterity saving throws. On a successful Dex save that deals half damage, take no damage instead (or half on a failed save) if you are not Incapacitated."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
