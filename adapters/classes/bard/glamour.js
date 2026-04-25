registerSubclassAdapter("Bard_Glamour", function (cls, lv, specs) {});

registerSubclassSheetActions("Bard_Glamour", [
  { name: "Beguiling Magic",       icon: "", cat: "bonus",   uses: "When casting Illusion/Enchantment", minLevel: 3,
    desc: "When you cast an Illusion or Enchantment spell with a spell slot, you can target a creature within 60 ft. It must succeed on a WIS save or be Charmed/Frightened (your choice) for 1 minute. It can repeat the save at the end of its turns." },
  { name: "Mantle of Inspiration", icon: "", cat: "bonus",   uses: "With Bardic Insp.",                 minLevel: 3,
    desc: "Bonus Action: expend one Bardic Inspiration. Choose creatures within 60 ft (up to CHA mod, min 1). Each gains temporary HP and can use its Reaction to move up to its Speed without provoking OA." },
  { name: "Mantle of Majesty",     icon: "", cat: "bonus",   uses: "1 / LR", resKey: "glamour_majesty", minLevel: 6,
    desc: "Bonus Action (Concentration, up to 1 minute): assume magical majesty and can cast Command as a Bonus Action each turn without expending spell slots." },
  { name: "Unbreakable Majesty",   icon: "", cat: "bonus",   uses: "1 / LR", resKey: "glamour_unbreakable", minLevel: 14,
    desc: "Bonus Action (Concentration, up to 1 minute): when a creature attacks you for the first time on a turn, it must pass a CHA save or choose a new target / lose the attack." },
]);

registerSubclassSheetResources("Bard_Glamour", [
  { key: "glamour_majesty",     name: "Mantle of Majesty",   icon: "crown",  recharge: "LR", actionName: "Mantle of Majesty",   max: () => 1 },
  { key: "glamour_unbreakable", name: "Unbreakable Majesty", icon: "shield", recharge: "LR", actionName: "Unbreakable Majesty", max: () => 1 },
]);
