import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';

registerSubclassAdapter("Bard_Glamour", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Bard_Glamour", [
  { name: "Beguiling Magic", icon: "", cat: "bonus", uses: "1 / LR", resKey: "glamour_beguiling", minLevel: 3,
    desc: "Charm Person and Mirror Image are always prepared for you. Immediately after you cast an Enchantment or Illusion spell using a spell slot, you can cause one creature you can see within 60 ft to make a WIS saving throw (spell save DC). On a failed save, it has the Charmed or Frightened condition (your choice) for 1 minute; it repeats the save at the end of each of its turns, ending the effect on a success. 1/LR, or restore by expending one use of Bardic Inspiration (no action required)." },
  { name: "Mantle of Inspiration", icon: "", cat: "bonus", uses: "With Bardic Insp.", minLevel: 3,
    desc: "Bonus Action: expend one use of Bardic Inspiration and roll the die. Choose a number of creatures within 60 ft up to your CHA modifier (min 1). Each gains Temporary HP equal to two times the number rolled, and can immediately use its Reaction to move up to its Speed without provoking Opportunity Attacks." },
  { name: "Mantle of Majesty", icon: "", cat: "bonus", uses: "1 / LR", resKey: "glamour_majesty", minLevel: 6,
    desc: "Command is always prepared for you. Bonus Action: cast Command without expending a spell slot and take on an unearthly appearance for 1 minute or until Concentration ends. During this time, you can cast Command as a Bonus Action without expending a spell slot on each of your turns. Any creature Charmed by you automatically fails its saving throw against Command you cast with this feature. 1/LR, or restore by expending a level 3+ spell slot (no action required)." },
  { name: "Unbreakable Majesty", icon: "", cat: "bonus", uses: "1 / SR", resKey: "glamour_unbreakable", minLevel: 14,
    desc: "Bonus Action: assume a magically majestic presence for 1 minute or until you have the Incapacitated condition. For the duration, whenever a creature hits you with an attack roll for the first time on a turn, the attacker must succeed on a CHA saving throw (spell save DC) or the attack misses instead (the creature recoils from your majesty). 1/SR or LR." },
]);

registerSubclassSheetResources("Bard_Glamour", [
  { key: "glamour_beguiling",  name: "Beguiling Magic",   icon: "sparkles", recharge: "LR", max: (lv) => lv >= 3  ? 1 : 0 },
  { key: "glamour_majesty",    name: "Mantle of Majesty",  icon: "crown",    recharge: "LR", max: (lv) => lv >= 6  ? 1 : 0 },
  { key: "glamour_unbreakable",name: "Unbreakable Majesty",icon: "shield",   recharge: "SR", max: (lv) => lv >= 14 ? 1 : 0 },
]);
// [SheetRuntime] END
