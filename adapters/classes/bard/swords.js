registerSubclassAdapter("Bard_Swords", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_swords_fighting_style',
      label: 'Fighting Style (College of Swords)',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 3
    });
  }
});

