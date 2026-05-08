import { registerFeatSheetActions } from '../registry.js';
registerFeatSheetActions("War Caster", [
  {
    name: "War Caster: Concentration",
    icon: "anchor",
    cat: "action",
    uses: "Passive",
    desc: "Advantage on Constitution saving throws to maintain Concentration. You can perform somatic spell components even when holding weapons or a shield in both hands."
  },
  {
    name: "Spell as Opportunity Attack",
    icon: "zap",
    cat: "action",
    uses: "Reaction",
    desc: "When a creature provokes an Opportunity Attack from you, cast a spell with a casting time of 1 Action targeting that creature (instead of making a weapon attack)."
  }
]);
