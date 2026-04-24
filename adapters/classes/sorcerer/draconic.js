const _DRAGON_ANCESTORS = [
  'Black (Acid)', 'Blue (Lightning)', 'Brass (Fire)', 'Bronze (Lightning)',
  'Copper (Acid)', 'Gold (Fire)', 'Green (Poison)', 'Red (Fire)',
  'Silver (Cold)', 'White (Cold)',
];

registerSubclassAdapter("Sorcerer_Draconic", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_draconic_ancestor',
      label: 'Dragon Ancestor (Draconic Sorcery)',
      type: 'generic_choice',
      from: _DRAGON_ANCESTORS,
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Sorcerer_Draconic", [
  {
    "name": "Draconic Presence",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "minLevel": 18,
    "desc": "Action: emanate draconic awe in 60 ft. Each creature must succeed on a WIS save (spell save DC) or be frightened/charmed for 1 minute."
  }
]);
// [SheetRuntime] END
