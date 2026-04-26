(function (global) {
  "use strict";
  if (typeof global.registerFeatAdapter !== "function") return;

  global.registerFeatAdapter("Ability Score Improvement", function (feat) {
    return {
      ...feat,
      choiceUi: {
        ...(feat.choiceUi && typeof feat.choiceUi === "object" ? feat.choiceUi : {}),
        abilityScoreIncrease: { modes: ["double", "split"] }
      }
    };
  });
})(typeof window !== "undefined" ? window : globalThis);
