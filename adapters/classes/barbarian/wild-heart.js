const _WILD_HEART_ANIMALS = ['Bear', 'Eagle', 'Elk', 'Tiger', 'Wolf'];

registerSubclassAdapter("Barbarian_Wild Heart", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_wild_heart_aspect_1',
      label: 'Bestial Soul (Wild Heart)',
      type: 'generic_choice',
      from: _WILD_HEART_ANIMALS,
      count: 1,
      level: 3
    });
  }
  if (lv >= 6) {
    specs.push({
      key: 'subclass_wild_heart_aspect_2',
      label: 'Bestial Soul Lv6 (Wild Heart)',
      type: 'generic_choice',
      from: _WILD_HEART_ANIMALS,
      count: 1,
      level: 6
    });
  }
  if (lv >= 14) {
    specs.push({
      key: 'subclass_wild_heart_aspect_3',
      label: 'Power of the Wilds (Wild Heart)',
      type: 'generic_choice',
      from: _WILD_HEART_ANIMALS,
      count: 1,
      level: 14
    });
  }
});
