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
