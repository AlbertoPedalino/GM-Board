import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("Grappler", [
  {
    name: "Grappler",
    icon: "hand",
    cat: "action",
    uses: "Passive",
    desc: "Advantage on attack rolls against a creature you are Grappling. You can Grapple creatures up to one size larger than you. When you hit a Grappled creature, deal an extra 1d6 damage."
  }
]);
