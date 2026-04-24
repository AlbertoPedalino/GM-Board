// Berserker (XPHB)
registerSubclassAdapter("Barbarian_Berserker", function (cls, lv, specs) {});

registerSubclassSheetActions("Barbarian_Berserker", [
  { name: "Frenzy",                  icon: "", cat: "bonus",    uses: "While Raging",    minLevel: 3,
    desc: "When you enter your Rage, choose to enter Frenzy. While Frenzied and Raging, you can make one extra weapon attack as a Bonus Action at the end of each of your turns. When the Rage ends, you gain 1 Exhaustion level." },
  { name: "Mindless Rage",           icon: "", cat: "action",   uses: "Passive",         minLevel: 6,
    desc: "You can't be Charmed or Frightened while Raging. If you have the Charmed or Frightened condition when you enter your Rage, that condition is suspended for the duration." },
  { name: "Intimidating Presence",   icon: "", cat: "bonus",    uses: "While Raging",    minLevel: 10,
    desc: "Bonus Action: attempt to frighten one creature within 30 ft you can see (WIS save, DC = 8 + PB + CHA mod). On fail, creature has the Frightened condition until your Rage ends or you are more than 60 ft away. Can be repeated each turn against new targets." },
  { name: "Retaliation",             icon: "", cat: "reaction", uses: "Passive",         minLevel: 14,
    desc: "When you take damage from a creature within 5 ft, you can use your Reaction to make one melee attack against that creature." },
]);

// World Tree (XPHB)
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

// Zealot (XPHB)
registerSubclassAdapter("Barbarian_Zealot", function (cls, lv, specs) {});

registerSubclassSheetActions("Barbarian_Zealot", [
  { name: "Divine Fury",       icon: "", cat: "attack",  uses: "Passive",  minLevel: 3,
    desc: "While Raging, the first time each turn you hit a creature with an attack, deal extra 1d6 + half your Barbarian level Necrotic or Radiant damage (chosen when you gain this feature)." },
  { name: "Warrior of the Gods",icon:"", cat: "action",  uses: "Passive",  minLevel: 6,
    desc: "When a spell effect revives you, the caster needs no material components. Also, when you have 0 HP at the start of your turn while Raging, you can expend one Rage use to regain 1 HP and keep fighting." },
  { name: "Fanatical Focus",   icon: "", cat: "action",  uses: "1 / Rage", minLevel: 10,
    desc: "When you fail a saving throw while Raging, you can reroll it and must use the new result. Usable once per Rage." },
  { name: "Rage Beyond Death", icon: "", cat: "action",  uses: "Passive",  minLevel: 14,
    desc: "While Raging, you can't be reduced below 1 HP. If you would die, you remain at 1 HP until your Rage ends, at which point you die if still at 0 HP." },
]);
