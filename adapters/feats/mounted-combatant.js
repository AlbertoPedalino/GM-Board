import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("Mounted Combatant", [
  {
    name: "Mounted Combatant",
    icon: "activity",
    cat: "action",
    uses: "Passive",
    desc: "Advantage on melee attack rolls against unmounted creatures smaller than your mount. You can force an attack targeting your mount to target you instead. When your mount fails a Dex saving throw, you can use your Reaction to let it succeed or halve the damage on a fail."
  },
  {
    name: "Redirect Attack",
    icon: "shield",
    cat: "action",
    uses: "Reaction",
    desc: "When your mount is targeted by an attack, redirect that attack to yourself instead."
  }
]);
