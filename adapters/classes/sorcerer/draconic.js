import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';

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
    "desc": "Passive: your Hit Point maximum increases by 3 at lv.3 and by 1 for each additional Sorcerer level. While you aren't wearing armor, your base AC equals 10 + DEX modifier + CHA modifier."
  },
  {
    "name": "Elemental Affinity",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "Choose one damage type: Acid, Cold, Fire, Lightning, or Poison. You have permanent Resistance to that damage type. When you cast a spell that deals damage of that type, you can add your CHA modifier to one damage roll of that spell."
  },
  {
    "name": "Dragon Wings",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / LR",
    "resKey": "draconic_wings",
    "minLevel": 14,
    "desc": "Bonus Action: cause draconic wings to appear on your back for 1 hour, or until you dismiss them (no action required). For the duration, you have a Fly Speed of 60 ft. 1/LR, or spend 3 Sorcery Points (no action) to restore this use."
  },
  {
    "name": "Dragon Companion",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR (free slot)",
    "resKey": "draconic_companion",
    "minLevel": 18,
    "desc": "You can cast Summon Dragon without a Material component. Once per Long Rest you can cast it without expending a spell slot; additional castings require a spell slot. Whenever you start casting the spell, you can modify it to not require Concentration — if you do, the spell's duration becomes 1 minute."
  }
]);
registerSubclassSheetResources("Sorcerer_Draconic", [
  {
    "key": "draconic_wings",
    "name": "Dragon Wings",
    "icon": "feather",
    "recharge": "LR",
    "max": () => 1
  },
  {
    "key": "draconic_companion",
    "name": "Dragon Companion (free cast)",
    "icon": "star",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
