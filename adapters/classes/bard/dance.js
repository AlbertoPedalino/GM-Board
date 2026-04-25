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
