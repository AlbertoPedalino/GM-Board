import { registerFeatAdapter } from '../registry.js';
registerFeatAdapter("Tough", function (feat) {
  return { ...feat, hpBonusPerLevel: 2 };
});
