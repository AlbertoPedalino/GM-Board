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
  { name: "Rage of the Gods",    icon: "", cat: "reaction", uses: "While Raging", minLevel: 14,
    desc: "While Raging: gain Fly Speed equal to your Speed (hover); gain Resistance to Necrotic, Psychic, and Radiant damage. Reaction — when a creature within 30 ft of you drops to 0 HP, spend one use of Rage to cause that creature to drop to a number of HP equal to your Barbarian level instead." },
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
