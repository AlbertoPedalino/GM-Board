registerClassAdapter("Barbarian", function (cls, lv, specs) {
  if (lv >= 1) {
    const weapons = typeof allItemsDb !== 'undefined'
      ? allItemsDb
          .filter(function (i) { return (i.type === 'M' || i.type === 'R') && (!i.rarity || i.rarity === 'none'); })
          .map(function (i) { return i.name; })
      : [];
    specs.push({
      key: 'barbarian_weapon_mastery',
      label: 'Weapon Mastery (choose 2)',
      type: 'generic_choice',
      from: weapons,
      count: 2,
      level: 1
    });
  }
  if (lv >= 3) {
    const allSkills = typeof SKILLS !== 'undefined'
      ? SKILLS.map(function (s) { return s.n; })
      : ['Acrobatics','Animal Handling','Arcana','Athletics','Perception',
         'Sleight of Hand','Stealth','Investigation','Deception','Insight',
         'Intimidation','Medicine','Nature','History','Performance',
         'Persuasion','Religion','Survival'];
    specs.push({
      key: 'barbarian_primal_knowledge',
      label: 'Primal Knowledge (Extra Skill)',
      type: 'skill_choice',
      from: allSkills,
      count: 1,
      level: 3
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'barbarian_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});
