registerSubclassAdapter("Paladin_Noble Genies", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_noble_genies_kind',
      label: 'Genie Kind',
      type: 'generic_choice',
      from: ['Dao (Earth/Bludgeoning)', 'Djinni (Air/Thunder)', 'Efreeti (Fire/Fire)', 'Marid (Water/Cold)'],
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Noble Genies", [
  {
    "name": "Channel: Genie's Flight",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "You and allies within 30 ft gain a flying speed equal to your walking speed for 1 minute."
  }
]);
// [SheetRuntime] END
