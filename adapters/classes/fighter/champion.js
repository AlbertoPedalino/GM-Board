registerSubclassAdapter("Fighter_Champion", function (cls, lv, specs) {
  if (lv >= 7) {
    specs.push({
      key: 'subclass_champion_extra_fs',
      label: 'Extra Fighting Style (Champion)',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 7
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Fighter_Champion", [
  {
    "name": "Improved Critical",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: your weapon attacks score a Critical Hit on a roll of 19 or 20 (lv.3). At lv.15 (Superior Critical), critical on 18–20."
  },
  {
    "name": "Remarkable Athlete",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: add half your Proficiency Bonus (rounded up) to any STR, DEX, or CON check you are not already proficient in. When you make a running long jump, the distance increases by a number of feet equal to your STR modifier."
  },
  {
    "name": "Heroic Warrior",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "Passive: at the start of each of your turns in combat, you can regain one expended use of Second Wind."
  },
  {
    "name": "Survivor",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 18,
    "desc": "Passive: at the start of each of your turns in combat, if you have fewer HP than half your maximum, you regain HP equal to 5 + your CON modifier (minimum 1). This does not function if you have 0 HP."
  }
]);
// [SheetRuntime] END
