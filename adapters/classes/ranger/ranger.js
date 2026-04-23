registerClassAdapter("Ranger", function (cls, lv, specs) {
  if (lv >= 1) {
    // Weapon Mastery: scegli 2 armi con cui sei competente
    const weapons = typeof allItemsDb !== 'undefined'
      ? allItemsDb
          .filter(function (i) { return (i.type === 'M' || i.type === 'R') && (!i.rarity || i.rarity === 'none'); })
          .map(function (i) { return i.name; })
      : [];
    specs.push({
      key: 'ranger_weapon_mastery_1',
      label: 'Weapon Mastery 1',
      type: 'generic_choice',
      from: weapons,
      count: 1,
      level: 1
    });
    specs.push({
      key: 'ranger_weapon_mastery_2',
      label: 'Weapon Mastery 2',
      type: 'generic_choice',
      from: weapons,
      count: 1,
      level: 1
    });
  }
  if (lv >= 2) {
    // Deft Explorer: expertise in 1 skill
    specs.push({
      key: 'ranger_expertise_1',
      label: 'Expertise (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 2
    });
    specs.push({
      key: 'ranger_fighting_style',
      label: 'Fighting Style',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 2
    });
  }
  if (lv >= 9) {
    specs.push({
      key: 'ranger_expertise_2',
      label: 'Expertise Lv9 (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 9
    });
    specs.push({
      key: 'ranger_expertise_3',
      label: 'Expertise Lv9 (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 9
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'ranger_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});
