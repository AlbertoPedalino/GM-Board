import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("Sharpshooter", [
  {
    name: "Sharpshooter",
    icon: "crosshair",
    cat: "action",
    uses: "Passive",
    desc: "No Disadvantage on ranged attack rolls at long range. Ignore half and three-quarters cover. Once per turn when you hit with a ranged weapon, deal extra damage equal to your Proficiency Bonus."
  }
]);
