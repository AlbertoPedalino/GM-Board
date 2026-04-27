registerSubclassAdapter("Barbarian_World Tree", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Barbarian_World Tree", [
  { name: "Vitality of the Tree", icon: "", cat: "action",   uses: "Passive",      minLevel: 3,
    desc: "When you Rage, and at the start of each of your turns while Raging, you gain temporary HP equal to your Proficiency Bonus." },
  { name: "Branches of the Tree", icon: "", cat: "reaction", uses: "While Raging", minLevel: 6,
    desc: "When a creature you can see starts its turn within 30 ft of you while you're Raging, use your Reaction: that creature must succeed on a WIS save (DC = 8 + PB + STR mod) or be teleported to an unoccupied space within 30 ft that you can see. Its speed becomes 0 for the rest of the turn." },
  { name: "Battering Roots",      icon: "", cat: "bonus",    uses: "While Raging", minLevel: 10,
    desc: "While Raging, melee weapons you wield have the Push and Reach properties (if they don't already). On a hit, you can use a Bonus Action to move the target up to 15 ft horizontally (STR save, DC = 8 + PB + STR mod, negates)." },
  { name: "Travel Along the Tree",icon: "", cat: "bonus",    uses: "While Raging", minLevel: 14,
    desc: "While Raging, Bonus Action: teleport up to 60 ft to an unoccupied space you can see. When your Rage ends, you may teleport up to 6 willing creatures you can see within 10 ft to unoccupied spaces within 500 ft (their choice of destination)." },
]);
// [SheetRuntime] END
