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
    "desc": "Critical hit on 19-20 (lv.3). On 18-20 at lv.15."
  }
]);
// [SheetRuntime] END
