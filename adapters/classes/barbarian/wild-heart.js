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

registerSubclassSheetActions("Barbarian_Wild Heart", [
  {
    name: "Bestial Soul",
    icon: "",
    cat: "action",
    uses: "Passive",
    minLevel: 3,
    desc: "Choose a Wild Heart aspect and gain its movement/survival benefits while raging."
  },
  {
    name: "Bestial Soul (Improved)",
    icon: "",
    cat: "action",
    uses: "Passive",
    minLevel: 6,
    desc: "Gain the level 6 Wild Heart adaptation from your selected aspect."
  },
  {
    name: "Power of the Wilds",
    icon: "",
    cat: "bonus",
    uses: "Rage feature",
    minLevel: 14,
    desc: "Unlock the level 14 Wild Heart manifestation based on your selected aspect."
  }
]);
