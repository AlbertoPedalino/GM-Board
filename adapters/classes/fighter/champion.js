registerSubclassAdapter("Fighter_Champion", function (cls, lv, specs) {
  if (lv >= 7) {
    specs.push({
      key: 'subclass_champion_extra_fs',
      label: 'Fighting Style Aggiuntivo (Champion)',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 7
    });
  }
});
