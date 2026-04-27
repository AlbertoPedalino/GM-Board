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
    "name": "Draconic Resilience",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Your hit point maximum increases by 1 per Sorcerer level. When you aren't wearing armor, your base AC equals 13 + your DEX modifier."
  },
  {
    "name": "Elemental Affinity",
    "icon": "",
    "cat": "action",
    "uses": "Passive / 1 Sorc Pt",
    "resKey": "sorc_pts",
    "minLevel": 6,
    "desc": "When you cast a spell with a damage type matching your Dragon Ancestor, add your CHA modifier to one damage roll. Spend 1 Sorcery Point to also gain Resistance to that damage type for 1 hour."
  },
  {
    "name": "Dragon Wings",
    "icon": "",
    "cat": "bonus",
    "uses": "Toggle",
    "minLevel": 14,
    "desc": "Bonus Action: sprout draconic wings, gaining a Fly Speed equal to your walking speed. Retract them as a Bonus Action."
  },
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
