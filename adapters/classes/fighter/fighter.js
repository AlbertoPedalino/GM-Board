registerClassAdapter("Fighter", function (cls, lv, specs) {
  if (lv >= 1) {
    const weapons = typeof allItemsDb !== 'undefined'
      ? allItemsDb
          .filter(i => (i.type === 'M' || i.type === 'R') && (!i.rarity || i.rarity === 'none'))
          .map(i => i.name)
      : [];
    specs.push({
      key: 'fighter_weapon_mastery',
      label: 'Weapon Mastery (scegli 3)',
      type: 'generic_choice',
      from: weapons,
      count: 3,
      level: 1
    });
    specs.push({
      key: 'fighter_fighting_style',
      label: 'Fighting Style',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 1
    });
  }
  if (lv >= 19) {
    specs.push({
      key: 'fighter_epic_boon',
      label: 'Epic Boon',
      type: 'feat_cat',
      categories: ['EB'],
      count: 1,
      level: 19
    });
  }
});
