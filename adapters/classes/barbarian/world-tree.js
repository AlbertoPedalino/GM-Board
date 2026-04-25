registerSubclassAdapter("Barbarian_World Tree", function (cls, lv, specs) {});

registerSubclassSheetActions("Barbarian_World Tree", [
  { name: "Vitality of the Tree", icon: "", cat: "action",   uses: "Passive",      minLevel: 3,
    desc: "When you Rage, and at the start of each of your turns while Raging, you gain temporary HP equal to your Proficiency Bonus." },
  { name: "Branches of the Tree", icon: "", cat: "reaction", uses: "While Raging", minLevel: 6,
    desc: "When a creature you can see starts its turn within 30 ft of you while you're Raging, use your Reaction: teleport that creature to an unoccupied space within 30 ft you can see (WIS save, DC = 8 + PB + STR mod negates). The creature's speed becomes 0 for the rest of the turn." },
  { name: "Travel Along the Tree",icon: "", cat: "bonus",    uses: "While Raging", minLevel: 10,
    desc: "While Raging, Bonus Action: teleport up to 60 ft to an unoccupied space you can see. When your Rage ends, you may teleport up to 6 willing creatures you can see within 10 ft to unoccupied spaces within 500 ft of you (their choice of destination)." },
  { name: "Mighty Impel",         icon: "", cat: "bonus",    uses: "While Raging", minLevel: 14,
    desc: "When you hit a Large or smaller creature with an attack while Raging, use a Bonus Action to move it up to 30 ft horizontally toward or away from you (STR save negates, DC = 8 + PB + STR mod)." },
]);
