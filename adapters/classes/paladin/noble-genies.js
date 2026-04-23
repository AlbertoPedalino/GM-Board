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
