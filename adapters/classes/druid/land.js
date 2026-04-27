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
    "minLevel": 6,
    "desc": "After a Short Rest: regain spell slots whose combined levels are no greater than half your Druid level (rounded up). Recharge: Long Rest."
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
