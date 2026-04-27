registerSubclassAdapter("Warlock_Celestial", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Celestial", [
  {
    "name": "Healing Light",
    "icon": "",
    "cat": "bonus",
    "uses": "Pool / LR",
    "resKey": "celestial_heal_light",
    "minLevel": 1,
    "desc": "Bonus Action: expend 1–5 dice from your Healing Light pool to restore HP to a creature within 60 ft (1d6 per die). Max dice per use: 1 + CHA mod. Pool = Warlock level + CHA mod (min 1) dice. Recharge: Long Rest."
  },
  {
    "name": "Radiant Soul",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "Resistance to Radiant damage. When you cast a spell that deals Radiant or Fire damage, add your CHA modifier to one damage roll of that spell."
  },
  {
    "name": "Celestial Resilience",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "When you finish a Short or Long Rest, gain temporary HP equal to your Warlock level + CHA modifier. Up to 5 chosen creatures also gain temporary HP equal to half your Warlock level + CHA modifier."
  },
  {
    "name": "Searing Vengeance",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "celestial_searing_ven",
    "minLevel": 14,
    "damageFormula": "2d8",
    "damageButtonLabel": ({ formula }) => `${formula} radiant`,
    "damageKind": "damage",
    "desc": "At the start of your turn when you would regain HP from a death saving throw success: instead radiate blinding light. Regain HP equal to half your max HP. Each creature within 30 ft takes 2d8 Radiant damage + CHA mod and is Blinded until the end of your next turn (DEX save for half, not blinded). Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Warlock_Celestial", [
  {
    "key": "celestial_heal_light",
    "name": "Healing Light",
    "icon": "sun",
    "recharge": "LR",
    "max": (lv) => Math.max(1, lv + (typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('cha')) : 0)),
    "pool": true
  },
  {
    "key": "celestial_searing_ven",
    "name": "Searing Vengeance",
    "icon": "flame",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
