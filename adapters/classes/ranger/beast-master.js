registerSubclassAdapter("Ranger_Beast Master", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_beast_companion_type',
      label: 'Primal Companion',
      type: 'generic_choice',
      from: ['Beast of the Land', 'Beast of the Sea', 'Beast of the Sky'],
      count: 1,
      level: 3
    });
  }
});
