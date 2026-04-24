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

registerSubclassSheetActions("Bard_Lore", [
  { name: "Cutting Words",      icon: "", cat: "reaction", uses: "With Bardic Insp.", minLevel: 3,
    desc: "When a creature you can see within 60 ft makes an attack roll, ability check, or damage roll, use your Reaction and expend one Bardic Inspiration: roll the die and subtract the result from the roll. Declare after seeing the roll but before knowing the outcome." },
  { name: "Magical Discoveries",icon: "", cat: "action",   uses: "Passive",           minLevel: 6,
    desc: "Choose 2 spells from any class's spell list (of a level you can cast): they are added to your Bard spell list and treated as Bard spells. Select them in the character builder." },
  { name: "Peerless Skill",     icon: "", cat: "action",   uses: "Passive",           minLevel: 14,
    desc: "When you make an ability check and fail, you can expend one use of Bardic Inspiration, roll the die, and add the result to the check, potentially turning it into a success. Declare after seeing the roll but before the DM reveals the outcome." },
]);
