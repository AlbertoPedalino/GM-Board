registerSubclassAdapter("Druid_Stars", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Druid_Stars", [
  {
    "name": "Starry Form",
    "icon": "",
    "cat": "bonus",
    "uses": "Wild Shape charge",
    "resKey": "wild_shape",
    "minLevel": 3,
    "desc": "Spend a Wild Shape use to assume a constellation form for 10 minutes (no stat change). Choose — Archer: Bonus Action after casting a spell, make a ranged spell attack (60 ft, 1d8+WIS Radiant on hit); Chalice: when you cast a healing spell, you or ally within 30 ft also regains 1d8+WIS HP; Dragon: you gain 10+WIS temp HP and can't lose Concentration from taking damage."
  },
  {
    "name": "Cosmic Omen",
    "icon": "",
    "cat": "reaction",
    "uses": "1 / SR",
    "resKey": "stars_cosmic_omen",
    "minLevel": 6,
    "desc": "After each Long Rest, roll 1d6. Odd = Weal, Even = Woe. Once per Short Rest, use Reaction when a visible creature rolls a d20: Weal → add 1d6 to the roll; Woe → subtract 1d6 from the roll."
  },
  {
    "name": "Twinkling Constellations",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "Starry Form improvements: Archer deals 2d8+WIS (instead of 1d8+WIS). Chalice healing also removes one of: Blinded, Deafened, or Paralyzed. Dragon: gain Fly Speed 20 ft and the ability to hover."
  },
  {
    "name": "Full of Stars",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "While in Starry Form: you become translucent and starry. Gain Resistance to Bludgeoning, Piercing, and Slashing damage."
  }
]);
registerSubclassSheetResources("Druid_Stars", [
  {
    "key": "stars_cosmic_omen",
    "name": "Cosmic Omen",
    "icon": "star",
    "recharge": "SR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
