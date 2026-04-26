(function (global) {
  "use strict";
  if (typeof global.registerFeatAdapter !== "function") return;

  global.registerFeatAdapter("Tough", function (feat) {
    return { ...feat, hpBonusPerLevel: 2 };
  });
})(typeof window !== "undefined" ? window : globalThis);
