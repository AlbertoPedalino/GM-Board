import { registerSubclassAdapter, registerSubclassSheetActions } from '../../registry.js';

registerSubclassAdapter("Barbarian_Wild Heart", function (cls, lv, specs) {
  if (lv >= 6) {
    specs.push({
      key: 'subclass_wild_heart_aspect',
      label: 'Aspect of the Wilds (Wild Heart lv.6)',
      type: 'generic_choice',
      from: ['Owl', 'Panther', 'Salmon'],
      count: 1,
      level: 6
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Barbarian_Wild Heart", [
  {
    name: "Animal Speaker",
    icon: "",
    cat: "action",
    uses: "Ritual",
    minLevel: 3,
    desc: "You can cast Beast Sense and Speak with Animals, but only as Rituals (no spell slot required, 10 minutes each)."
  },
  {
    name: "Rage of the Wilds",
    icon: "",
    cat: "bonus",
    uses: "Choose per Rage",
    minLevel: 3,
    desc: "When you activate your Rage, choose one — Bear: Resistance to all damage except Force, Necrotic, Psychic, and Radiant; Eagle: take Disengage + Dash as part of the Rage Bonus Action; while Raging, can Bonus Action to take both Disengage and Dash; Wolf: your allies have Advantage on attack rolls against any enemy within 5 ft of you."
  },
  {
    name: "Aspect of the Wilds",
    icon: "",
    cat: "action",
    uses: "Passive (change on LR)",
    minLevel: 6,
    desc: "Choose a permanent trait (can change after each Long Rest) — Owl: Darkvision 60 ft (or +60 ft if already have it); Panther: Climb Speed = walking Speed; Salmon: Swim Speed = walking Speed."
  },
  {
    name: "Nature Speaker",
    icon: "",
    cat: "action",
    uses: "Ritual / LR",
    minLevel: 10,
    desc: "You can cast Commune with Nature as a Ritual. You always have this spell prepared; it doesn't count against the number of spells you can prepare."
  },
  {
    name: "Power of the Wilds",
    icon: "",
    cat: "bonus",
    uses: "Choose per Rage",
    minLevel: 14,
    desc: "When you activate your Rage, also choose one — Falcon: Fly Speed = walking Speed (while not wearing armor); Lion: enemies within 5 ft have Disadvantage on attack rolls against targets other than you or another Barbarian with this option; Ram: when you hit a Large or smaller creature with a melee attack, you can knock it Prone."
  }
]);
// [SheetRuntime] END
