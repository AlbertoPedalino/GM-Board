(function (global) {
  "use strict";

  if (typeof global.registerFeatSheetActions === "function") {
    global.registerFeatSheetActions("Alert", [
      {
        name:  "Alert",
        icon:  "eye",
        cat:   "action",
        uses:  "Passive",
        desc:  "Add your Proficiency Bonus to Initiative rolls. You can't be Surprised."
      },
      {
        name:  "Swap Initiative",
        icon:  "arrow-left-right",
        cat:   "action",
        uses:  "Reaction",
        desc:  "When you roll Initiative, you can swap your result with that of one willing creature you can see within 30 feet of you. Neither of you can be Surprised."
      }
    ]);
  }

})(typeof window !== "undefined" ? window : globalThis);
