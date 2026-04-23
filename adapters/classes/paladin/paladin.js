registerClassAdapter("Paladin", function (cls, lv, specs) {
  if (lv >= 2) {
    specs.push({
      key: 'paladin_fighting_style',
      label: 'Fighting Style',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 2
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'paladin_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});
