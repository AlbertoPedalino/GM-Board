import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("Polearm Master", [
  {
    name: "Polearm Bonus Attack",
    icon: "swords",
    cat: "action",
    uses: "Bonus Action",
    desc: "When you take the Attack action with a glaive, halberd, pike, quarterstaff, or spear, make one melee attack with the opposite end of the weapon as a Bonus Action (1d4 bludgeoning)."
  },
  {
    name: "Polearm Opportunity Attack",
    icon: "swords",
    cat: "action",
    uses: "Reaction",
    desc: "When a creature enters the reach you have with a polearm, make one opportunity attack against that creature."
  }
]);
