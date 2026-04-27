registerSubclassAdapter("Fighter_Champion", function (cls, lv, specs) {
  if (lv >= 10) {
    specs.push({
      key: 'subclass_champion_extra_fs',
      label: 'Extra Fighting Style (Champion)',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 10
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
    "desc": "Your weapon attacks score a Critical Hit on a roll of 19 or 20 (lv.3). At lv.15 (Superior Critical), you score a critical on 18–20."
  },
  {
    "name": "Heroic Warrior",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "At the start of each of your turns in combat, you can regain one expended use of Second Wind."
  },
  {
    "name": "Survivor",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 18,
    "desc": "At the start of each of your turns in combat, if you have fewer HP than half your maximum, you regain HP equal to 5 + your CON modifier (minimum 1). Does not function at 0 HP."
  }
]);
// [SheetRuntime] END
