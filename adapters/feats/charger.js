import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("Charger", [
  {
    name: "Charge Attack",
    icon: "wind",
    cat: "action",
    uses: "Bonus Action",
    desc: "When you take the Dash action, you can make one melee weapon attack or shove a creature as a Bonus Action. If you moved 10+ ft in a straight line before hitting, deal an extra 1d8 damage (once per turn)."
  }
]);
