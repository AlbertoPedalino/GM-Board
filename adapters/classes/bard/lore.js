registerSubclassAdapter("Bard_Lore", function (cls, lv, specs) {
  if (lv >= 3) {
    const allSkills = typeof SKILLS !== 'undefined'
      ? SKILLS.map(function (s) { return s.n; })
      : ['Acrobatics','Animal Handling','Arcana','Athletics','Deception',
         'History','Insight','Intimidation','Investigation','Medicine',
         'Nature','Perception','Performance','Persuasion','Religion',
         'Sleight of Hand','Stealth','Survival'];

    [1, 2, 3].forEach(function (i) {
      specs.push({
        key: 'subclass_lore_bonus_skill_' + i,
        label: 'Bonus Proficiency ' + i + ' (Lore)',
        type: 'skill_choice',
        from: allSkills,
        count: 1,
        level: 3
      });
    });
  }
});
