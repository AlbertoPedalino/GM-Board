registerSubclassAdapter("Barbarian_Zealot", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Barbarian_Zealot", [
  { name: "Divine Fury",         icon: "", cat: "attack",  uses: "Passive",      minLevel: 3,
    damageFormula: ({ ownerLevel }) => `1d6+${Math.floor(Number(ownerLevel||1)/2)}`,
    damageButtonLabel: ({ formula }) => `+${formula} necrotic/radiant`,
    damageKind: "damage",
    desc: "While Raging, the first time each turn you hit a creature with an attack, deal extra Necrotic or Radiant damage (chosen when you gain this feature) equal to 1d6 + half your Barbarian level." },
  { name: "Fanatical Focus",     icon: "", cat: "reaction", uses: "1 / Rage",    minLevel: 6,
    desc: "When you fail a saving throw while Raging, use your Reaction to reroll it and use the new result. Usable once per Rage." },
  { name: "Zealous Presence",    icon: "", cat: "bonus",    uses: "1 / LR",      resKey: "zealous_presence", minLevel: 10,
    desc: "Bonus Action: unleash a battle cry infused with divine energy. Up to 10 creatures of your choice within 60 ft that can hear you gain Advantage on attack rolls and saving throws until the start of your next turn. Recharge: Long Rest." },
  { name: "Rage of the Gods",    icon: "", cat: "action",   uses: "Passive",     minLevel: 14,
    desc: "While Raging, you can't be reduced below 1 HP. If you would die from damage, you instead drop to 1 HP and your Rage continues. When your Rage ends, if you are at 0 HP, you die." },
]);
registerSubclassSheetResources("Barbarian_Zealot", [
  {
    "key": "zealous_presence",
    "name": "Zealous Presence",
    "icon": "megaphone",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
