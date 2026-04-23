registerClassAdapter("Barbarian", function (cls, lv, specs) {
  if (lv >= 3) {
    const allSkills = typeof SKILLS !== 'undefined'
      ? SKILLS.map(function (s) { return s.n; })
      : ['Acrobatica','Animalesca','Arcana','Atletica','Consapevolezza',
         'Destrezza Manuale','Furtività','Indagare','Inganno','Intuizione',
         'Intimidazione','Medicina','Percezione','Perform','Persuasione',
         'Religione','Sopravvivenza'];
    specs.push({
      key: 'barbarian_primal_knowledge',
      label: 'Primal Knowledge (Skill Aggiuntiva)',
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
