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
