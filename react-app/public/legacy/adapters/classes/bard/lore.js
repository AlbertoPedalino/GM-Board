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
    specs.push({ key: 'subclass_lore_magical_discovery_1', label: 'Magical Discoveries 1 (Lore Lv.6)', type: 'spell_choice', spellFilter: { spellLevel: null, classes: ['Cleric', 'Druid', 'Wizard'] }, count: 1, level: 6 });
    specs.push({ key: 'subclass_lore_magical_discovery_2', label: 'Magical Discoveries 2 (Lore Lv.6)', type: 'spell_choice', spellFilter: { spellLevel: null, classes: ['Cleric', 'Druid', 'Wizard'] }, count: 1, level: 6 });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Bard_Lore", [
  { name: "Bonus Proficiencies", icon: "", cat: "action", uses: "Passive", minLevel: 3,
    desc: "Gain proficiency in three skills of your choice. Select them in the builder." },
  { name: "Cutting Words", icon: "", cat: "reaction", uses: "With Bardic Insp.", minLevel: 3,
    desc: "When a creature you can see within 60 ft makes a damage roll or succeeds on an ability check or attack roll, use your Reaction and expend one Bardic Inspiration: roll the die and subtract the result from the creature's roll, potentially reducing damage or turning a success into a failure." },
  { name: "Magical Discoveries", icon: "", cat: "action", uses: "Passive", minLevel: 6,
    desc: "Choose 2 spells (cantrips or spells for which you have slots) from the Cleric, Druid, or Wizard spell list. They are always prepared as Bard spells. On each Bard level up, you can replace one of the chosen spells with another that meets these requirements." },
  { name: "Peerless Skill", icon: "", cat: "action", uses: "With Bardic Insp.", minLevel: 14,
    desc: "When you make an ability check or attack roll and fail, expend one use of Bardic Inspiration: roll the die and add the result to the d20, potentially turning failure into success. If the roll still fails, the Bardic Inspiration is not expended." },
]);
// [SheetRuntime] END
