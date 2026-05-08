import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("Crossbow Expert", [
  {
    name: "Crossbow Expert",
    icon: "crosshair",
    cat: "action",
    uses: "Passive",
    desc: "Ignore the Loading property of crossbows you are proficient with. Being within 5 ft of a creature doesn't impose disadvantage on your ranged attack rolls."
  },
  {
    name: "Dual-Crossbow Attack",
    icon: "crosshair",
    cat: "action",
    uses: "Bonus Action",
    desc: "When you attack with a one-handed weapon, you can make an additional attack with a Hand Crossbow you are holding as a Bonus Action."
  }
]);
