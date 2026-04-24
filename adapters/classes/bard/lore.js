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
  if (lv >= 6) {
    specs.push({ key: 'subclass_lore_magical_discovery_1', label: 'Magical Discoveries 1 (Lore Lv.6)', type: 'spell_choice', spellFilter: { spellLevel: null, classes: null, allSpells: true }, count: 1, level: 6 });
    specs.push({ key: 'subclass_lore_magical_discovery_2', label: 'Magical Discoveries 2 (Lore Lv.6)', type: 'spell_choice', spellFilter: { spellLevel: null, classes: null, allSpells: true }, count: 1, level: 6 });
  }
});

