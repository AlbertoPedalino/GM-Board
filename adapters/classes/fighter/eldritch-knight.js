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
    "name": "Weapon Bond",
    "icon": "",
    "cat": "bonus",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "You can summon a bonded weapon from within 60 ft as a bonus action. You cannot be disarmed of bonded weapons."
  }
]);
// [SheetRuntime] END
