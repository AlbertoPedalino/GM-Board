registerSubclassAdapter("Fighter_Eldritch Knight", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_ek_cantrip_1',
      label: 'Eldritch Knight — Cantrip Wizard 1',
      type: 'spell_choice',
      spellFilter: { spellLevel: 0, classes: ['Wizard'] },
      count: 1,
      level: 3
    });
    specs.push({
      key: 'subclass_ek_cantrip_2',
      label: 'Eldritch Knight — Cantrip Wizard 2',
      type: 'spell_choice',
      spellFilter: { spellLevel: 0, classes: ['Wizard'] },
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Fighter_Eldritch Knight", [
  {
    "name": "War Magic",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "Passive: when you use your action to cast a Wizard cantrip, you can make one weapon attack as a Bonus Action."
  },
  {
    "name": "Eldritch Strike",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "Passive: when you hit a creature with a weapon attack, that creature has Disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn."
  },
  {
    "name": "Arcane Charge",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "Passive: when you use Action Surge, you can teleport up to 30 feet to an unoccupied space you can see, either before or after the additional action."
  },
  {
    "name": "Improved War Magic",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 18,
    "desc": "Passive: when you take the Attack action, you can replace ONE attack with casting any Wizard spell you know that has a casting time of 1 action (not limited to cantrips, unlike War Magic)."
  }
]);
// [SheetRuntime] END
