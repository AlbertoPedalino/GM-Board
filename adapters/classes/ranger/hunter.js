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
    "noRoll": true,
    "desc": "Choose: Colossus Slayer (+1d8 vs wounded creatures, 1/turn), Giant Killer (reaction to attack giants that hit you), Horde Breaker (extra attack on creature adjacent to your target)."
  },
  {
    "name": "Defensive Tactics",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "Choose: Escape the Horde (Opportunity Attacks against you have Disadvantage), Multiattack Defense (+4 AC against subsequent attacks from a creature that hit you this turn), or Steel Will (Advantage on saves against being Frightened)."
  },
  {
    "name": "Multiattack",
    "icon": "",
    "cat": "action",
    "uses": "Action",
    "minLevel": 11,
    "desc": "Choose: Volley (Action, fire a volley at any number of creatures in a 10-ft radius within 40 ft, expending one arrow per target — each takes 1 hit from your weapon), or Whirlwind Attack (Action, make a melee attack against every creature within 5 ft of you)."
  },
  {
    "name": "Superior Hunter's Defense",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "Choose: Evasion (DEX save: no damage on success, half on fail), Stand Against the Tide (when missed by a melee attack, redirect it to another creature within reach), or Uncanny Dodge (Reaction: halve one attack's damage against you)."
  }
]);
// [SheetRuntime] END
