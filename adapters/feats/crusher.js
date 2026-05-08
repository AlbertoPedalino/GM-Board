import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("Crusher", [
  {
    name: "Crusher: Push",
    icon: "hand",
    cat: "action",
    uses: "Passive",
    desc: "Once per turn when you hit a creature with a bludgeoning damage weapon, push the creature 5 ft away from you (if it is no more than one size larger)."
  },
  {
    name: "Crusher: Enhanced Critical",
    icon: "zap",
    cat: "action",
    uses: "Passive",
    desc: "On a critical hit with a bludgeoning weapon, each creature within 30 ft of the target has Disadvantage on attack rolls until the start of your next turn."
  }
]);
