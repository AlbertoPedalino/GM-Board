import { registerSubclassAdapter, registerSubclassSheetActions } from '../../registry.js';

// Trickery Domain (XPHB): tutte le feature sono passive o azioni fisse, nessuna scelta di build.
// L3: Blessing of the Trickster, Invoke Duplicity (CD)
// L6: Trickster's Transposition
// L17: Improved Duplicity
registerSubclassAdapter("Cleric_Trickery", function (cls, lv, specs) {
  // nessuna spec
});

// [SheetRuntime] START
registerSubclassSheetActions("Cleric_Trickery", [
  { name: "Blessing of the Trickster", icon: "", cat: "action", uses: "Until LR or reuse", minLevel: 3,
    desc: "Magic action: choose yourself or a willing creature within 30 ft to have Advantage on DEX (Stealth) checks. Lasts until you finish a Long Rest or use this feature again." },
  { name: "Channel: Invoke Duplicity", icon: "", cat: "bonus", uses: "1 Channel / 1 min", resKey: "channel_div",
    desc: "Bonus Action: expend one use of Channel Divinity to create a perfect visual illusion of yourself in an unoccupied space within 30 ft (not Concentration). Lasts 1 minute or until dismissed or Incapacitated. Benefits while active — Cast Spells: cast spells as if in the illusion's space (use your own senses); Distract: when both you and the illusion are within 5 ft of a creature that can see the illusion, you have Advantage on attack rolls against it; Move: Bonus Action to move the illusion up to 30 ft (within 120 ft of you)." },
  { name: "Trickster's Transposition", icon: "", cat: "bonus", uses: "With Invoke Duplicity", minLevel: 6,
    desc: "Whenever you take the Bonus Action to create or move the illusion of Invoke Duplicity, you can teleport, swapping places with the illusion." },
  { name: "Improved Duplicity", icon: "", cat: "action", uses: "Passive", minLevel: 17,
    desc: "Your Invoke Duplicity illusion gains two upgrades — Shared Distraction: you and your allies have Advantage on attack rolls against any creature within 5 ft of the illusion; Healing Illusion: when the illusion ends, you or one creature of your choice within 5 ft of it regains HP equal to your Cleric level." },
]);
// [SheetRuntime] END
