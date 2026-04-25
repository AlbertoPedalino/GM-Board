// College of Dance (XPHB)
registerSubclassAdapter("Bard_Dance", function (cls, lv, specs) {});

registerSubclassSheetActions("Bard_Dance", [
  { name: "Dazzling Footwork",    icon: "", cat: "action",   uses: "Passive",            minLevel: 3,
    desc: "While you aren't wearing armor or wielding a Shield, you gain Dance Virtuoso, Unarmored Defense, Agile Strikes, and Bardic Damage." },
  { name: "Dance Virtuoso",      icon: "", cat: "action",   uses: "Passive",            minLevel: 3,
    desc: "You have Advantage on Charisma (Performance) checks that involve dancing." },
  { name: "Unarmored Defense",   icon: "", cat: "action",   uses: "Passive",            minLevel: 3,
    desc: "While you aren't wearing armor or wielding a Shield: your base AC equals 10 + DEX mod + CHA mod." },
  { name: "Agile Strikes",       icon: "", cat: "attack",   uses: "With Bardic Insp.",  minLevel: 3,
    desc: "When you expend a Bardic Inspiration use as part of an action/bonus action/reaction, you can make one Unarmed Strike as part of that same action." },
  { name: "Bardic Damage",       icon: "", cat: "attack",   uses: "Passive",            minLevel: 3,
    desc: "You can use DEX for Unarmed Strike attack rolls. Your Unarmed Strike damage can be a roll of your Bardic Inspiration die + DEX mod (instead of normal damage)." },
  { name: "Inspiring Movement",  icon: "", cat: "reaction", uses: "With Bardic Insp.",  minLevel: 6,
    desc: "When an enemy ends its turn within 5 ft of you: expend one Bardic Inspiration and use your Reaction to move up to half Speed; then one ally within 30 ft can use their Reaction to move up to half Speed. This movement doesn't provoke Opportunity Attacks." },
  { name: "Tandem Footwork",     icon: "", cat: "reaction", uses: "With Bardic Insp.",  minLevel: 6,
    desc: "When you roll Initiative, you can expend one Bardic Inspiration: roll the die and you plus each ally within 30 ft who can see/hear you gains that bonus to Initiative." },
  { name: "Leading Evasion",     icon: "", cat: "reaction", uses: "Passive",            minLevel: 14,
    desc: "When an effect allows a DEX save for half damage: on success you take no damage, on failure half. If creatures within 5 ft make the same DEX save, you can share this benefit with them. Doesn't work while Incapacitated." },
]);

// College of Glamour (XPHB)
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

// College of Valor (XPHB)
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

// College of the Moon (FRHoF)
registerSubclassAdapter("Bard_Moon", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: "subclass_moon_primal_lore_skill",
      label: "Primal Lore Skill (Moon)",
      type: "skill_choice",
      from: ["Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Survival"],
      count: 1,
      level: 3,
    });
    specs.push({
      key: "subclass_moon_primal_lore_cantrip",
      label: "Primal Lore Cantrip (Moon)",
      type: "spell_choice",
      spellFilter: { spellLevel: 0, classes: ["Druid"] },
      count: 1,
      level: 3,
    });
  }
});

registerSubclassSheetActions("Bard_Moon", [
  { name: "Moon's Inspiration", icon: "", cat: "bonus",    uses: "With Bardic Insp.", minLevel: 3,
    desc: "Includes Inspired Eclipse (teleport and brief invisibility when granting Bardic Inspiration) and Lunar Vitality (boost healing by expending a Bardic Inspiration die once per turn)." },
  { name: "Primal Lore",        icon: "", cat: "action",   uses: "Passive",           minLevel: 3,
    desc: "You learn Druidic, gain one Druid cantrip (counts as Bard spell), and gain proficiency in one skill from the Primal Lore list." },
  { name: "Blessing of Moonlight", icon: "", cat: "action", uses: "1 / LR", resKey: "moon_blessing", minLevel: 6,
    desc: "You always have Moonbeam prepared. Once per Long Rest when you cast Moonbeam, you can modify it to grant extra healing to an additional creature on failed saves." },
  { name: "Eventide's Splendor", icon: "", cat: "reaction", uses: "Passive", minLevel: 14,
    desc: "Improves Moon's Inspiration: Inspired Eclipse can also affect the inspired ally, and Lunar Vitality can use 1d6 instead of expending a Bardic Inspiration die." },
]);

registerSubclassSheetResources("Bard_Moon", [
  { key: "moon_blessing", name: "Blessing of Moonlight", icon: "moon", recharge: "LR", actionName: "Blessing of Moonlight", max: () => 1 },
]);
