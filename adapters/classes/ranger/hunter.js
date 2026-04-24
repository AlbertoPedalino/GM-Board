registerSubclassAdapter("Ranger_Hunter", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_hunter_prey',
      label: "Hunter's Prey",
      type: 'generic_choice',
      from: ['Colossus Slayer', 'Giant Killer', 'Horde Breaker'],
      count: 1,
      level: 3
    });
  }
  if (lv >= 7) {
    specs.push({
      key: 'subclass_hunter_defensive',
      label: 'Defensive Tactics',
      type: 'generic_choice',
      from: ['Escape the Horde', 'Multiattack Defense', 'Steel Will'],
      count: 1,
      level: 7
    });
  }
  if (lv >= 15) {
    specs.push({
      key: 'subclass_hunter_superior',
      label: "Superior Hunter's Defense",
      type: 'generic_choice',
      from: ['Evasion', 'Stand Against the Tide', 'Uncanny Dodge'],
      count: 1,
      level: 15
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Ranger_Hunter", [
  {
    "name": "Hunter's Prey",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Choose: Colossus Slayer (+1d8 vs wounded creatures, 1/turn), Giant Killer (reaction to attack giants that hit you), Horde Breaker (extra attack on creature adjacent to your target)."
  }
]);
// [SheetRuntime] END
