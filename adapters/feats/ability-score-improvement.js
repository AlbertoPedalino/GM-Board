import { registerFeatAdapter } from '../registry.js';
registerFeatAdapter("Ability Score Improvement", function (feat) {
    return {
      ...feat,
      choiceUi: {
        ...(feat.choiceUi && typeof feat.choiceUi === "object" ? feat.choiceUi : {}),
        abilityScoreIncrease: { modes: ["double", "split"] }
      }
    };
  });
