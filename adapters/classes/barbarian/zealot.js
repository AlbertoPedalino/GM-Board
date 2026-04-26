registerSubclassAdapter("Barbarian_Zealot", function (cls, lv, specs) {});

registerSubclassSheetActions("Barbarian_Zealot", [
  { name: "Divine Fury",       icon: "", cat: "attack",  uses: "Passive",  minLevel: 3, noRoll: true,
    inlinePills: ({ ownerLevel }) => [{ icon: 'flame', label: 'Bonus Damage', value: `1d6+${Math.floor(Number(ownerLevel||1)/2)}` }],
    desc: "While Raging, the first time each turn you hit a creature with an attack, deal extra 1d6 + half your Barbarian level Necrotic or Radiant damage (chosen when you gain this feature)." },
  { name: "Warrior of the Gods",icon:"", cat: "action",  uses: "Passive",  minLevel: 6,
    desc: "When a spell effect revives you, the caster needs no material components. Also, when you have 0 HP at the start of your turn while Raging, you can expend one Rage use to regain 1 HP and keep fighting." },
  { name: "Fanatical Focus",   icon: "", cat: "action",  uses: "1 / Rage", minLevel: 10,
    desc: "When you fail a saving throw while Raging, you can reroll it and must use the new result. Usable once per Rage." },
  { name: "Rage Beyond Death", icon: "", cat: "action",  uses: "Passive",  minLevel: 14,
    desc: "While Raging, you can't be reduced below 1 HP. If you would die, you remain at 1 HP until your Rage ends, at which point you die if still at 0 HP." },
]);
