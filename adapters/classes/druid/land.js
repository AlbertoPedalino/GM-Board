registerSubclassAdapter("Druid_Land", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_land_terrain',
      label: 'Land Type (Circle of the Land)',
      type: 'generic_choice',
      from: ['Arid', 'Polar', 'Temperate', 'Tropical'],
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Druid_Land", [
  {
    "name": "Natural Recovery",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "natural_recovery",
    "minLevel": 2,
    "desc": "After a short rest: regain spell slots with total levels <= half Druid level (min 1)."
  },
  {
    "name": "Land's Aid",
    "icon": "",
    "cat": "bonus",
    "uses": "Wild Shape charge",
    "resKey": "wild_shape",
    "minLevel": 6,
    "desc": "Bonus Action: spend one Wild Shape use. Choose a point within 60 ft. One creature of your choice within 10 ft must succeed on a CON save (spell save DC) or take 2d6 Necrotic damage (half on success). A second creature of your choice within 10 ft regains 2d6 HP."
  },
  {
    "name": "Nature's Ward",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "Immune to Poison damage and the Poisoned condition. Immune to disease. Elementals and Fey can't charm or frighten you."
  },
  {
    "name": "Nature's Sanctuary",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "When a Fey, Plant creature, or Elemental attacks you: it must succeed on a WIS save (spell save DC) or choose a different target. On a successful save, it is immune to this effect for 24 hours."
  }
]);
registerSubclassSheetResources("Druid_Land", [
  {
    "key": "natural_recovery",
    "name": "Natural Recovery",
    "icon": "leaf",
    "recharge": "LR",
    "max": ()=>1
  }
]);
// [SheetRuntime] END
