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
