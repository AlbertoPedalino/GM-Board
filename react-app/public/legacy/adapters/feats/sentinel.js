(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Sentinel", [
      {
        name: "Sentinel: Stop",
        icon: "eye",
        cat: "action",
        uses: "Passive",
        desc: "When you hit a creature with an Opportunity Attack, its Speed becomes 0 for the rest of the turn."
      },
      {
        name: "Sentinel: No Escape",
        icon: "eye",
        cat: "action",
        uses: "Passive",
        desc: "Creatures within your reach provoke Opportunity Attacks even if they take the Disengage action."
      },
      {
        name: "Sentinel: Guard",
        icon: "shield",
        cat: "action",
        uses: "Reaction",
        desc: "When a creature within 5 ft makes an attack against a target other than you, make one melee weapon attack against the attacking creature."
      }
    ]);
  }
})(typeof window !== "undefined" ? window : globalThis);
