// Attrezzi artigiani disponibili (XPHB)
const _MONK_ARTISAN_TOOLS = [
  "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies",
  "Carpenter's Tools", "Cartographer's Tools", "Cobbler's Tools",
  "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools",
  "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies",
  "Potter's Tools", "Smith's Tools", "Tinker's Tools",
  "Weaver's Tools", "Woodcarver's Tools",
];

// Strumenti musicali disponibili (XPHB)
const _MONK_INSTRUMENTS = [
  'Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Hand Drum',
  'Horn', 'Lute', 'Lyre', 'Pan Flute', 'Shawm', 'Viol',
];

registerClassAdapter("Monk", function (cls, lv, specs) {
  if (lv >= 1) {
    specs.push({
      key: 'monk_tool_proficiency',
      label: 'Tool Proficiency (Tools or Instrument)',
      type: 'generic_choice',
      from: _MONK_ARTISAN_TOOLS.concat(_MONK_INSTRUMENTS),
      count: 1,
      level: 1
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'monk_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});
