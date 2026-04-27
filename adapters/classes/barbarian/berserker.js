registerSubclassAdapter("Barbarian_Berserker", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Barbarian_Berserker", [
  { name: "Frenzy",                  icon: "", cat: "bonus",    uses: "While Raging",    minLevel: 3,
    desc: "When you enter your Rage, choose to enter Frenzy. While Frenzied and Raging, make one extra weapon attack as a Bonus Action at the end of each of your turns (no Exhaustion cost in 2024)." },
  { name: "Mindless Rage",           icon: "", cat: "action",   uses: "Passive",         minLevel: 6,
    desc: "You can't be Charmed or Frightened while Raging. If you have the Charmed or Frightened condition when you enter your Rage, that condition is suspended for the duration." },
  { name: "Retaliation",             icon: "", cat: "reaction", uses: "Passive",         minLevel: 10,
    desc: "When you take damage from a creature within 5 ft, you can use your Reaction to make one melee attack against that creature." },
  { name: "Intimidating Presence",   icon: "", cat: "action",   uses: "At will",         minLevel: 14,
    desc: "Action: attempt to frighten one creature within 30 ft you can see (WIS save, DC = 8 + PB + CHA mod). On fail, creature has the Frightened condition until the end of your next turn. Repeat the Action each of your turns to extend the effect." },
]);
// [SheetRuntime] END
