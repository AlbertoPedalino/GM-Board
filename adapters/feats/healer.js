(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Healer", [
      {
        name: "Healer's Kit Stabilize",
        icon: "heart",
        cat: "action",
        uses: "Bonus Action",
        desc: "Expend one use of a Healer's Kit to stabilize a creature that has 0 HP. It regains 1 HP instead of making death saving throws."
      },
      {
        name: "Healer's Kit Heal",
        icon: "heart",
        cat: "action",
        uses: "Action",
        desc: "Expend one use of a Healer's Kit to restore 1d6 + 4 + target's maximum Hit Dice HP to a creature. A creature can benefit from this once per Short or Long Rest."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
