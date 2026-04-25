registerSubclassAdapter("Bard_Valor", function (cls, lv, specs) {});

registerSubclassSheetActions("Bard_Valor", [
  { name: "Combat Inspiration", icon: "", cat: "reaction", uses: "With Bardic Insp.", minLevel: 3,
    desc: "Allies with your Bardic Inspiration can add the die to a weapon damage roll after hitting, or to AC as a Reaction against one attack (declare before knowing outcome)." },
  { name: "Martial Training",   icon: "", cat: "action",   uses: "Passive",           minLevel: 3,
    desc: "You gain proficiency with Martial weapons, Medium Armor, and Shields." },
  { name: "Extra Attack",       icon: "", cat: "attack",   uses: "Passive",           minLevel: 6,
    desc: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
  { name: "Battle Magic",       icon: "", cat: "bonus",    uses: "After casting Bard spell", minLevel: 14,
    desc: "When you cast a Bard spell using your action, you can make one weapon attack as a Bonus Action." },
]);

registerSubclassSheetProficiencies("Bard_Valor", [
  { type: "armor", values: ["Medium", "Shield"], minLevel: 3 },
  { type: "weapon", values: ["Martial"], minLevel: 3 },
]);
