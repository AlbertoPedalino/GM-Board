import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("Defensive Duelist", [
  {
    name: "Parry",
    icon: "shield",
    cat: "action",
    uses: "Reaction",
    desc: "When you are hit by an attack while holding a Finesse weapon, add your Proficiency Bonus to your AC for that attack, potentially causing it to miss."
  }
]);
