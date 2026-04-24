registerClassAdapter("Artificer", function (cls, lv, specs) {
  if (lv >= 19) {
    specs.push({
      key: 'artificer_epic_boon',
      label: 'Epic Boon',
      type: 'feat_cat',
      categories: ['EB'],
      count: 1,
      level: 19
    });
  }
});
