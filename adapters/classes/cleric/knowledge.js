const _KNOWLEDGE_LANGUAGES = [
  'Common', 'Elvish', 'Dwarvish', 'Giant', 'Gnomish', 'Goblin',
  'Halfling', 'Orc', 'Draconic', 'Infernal', 'Celestial', 'Undercommon',
  'Abyssal', 'Sylvan', 'Deep Speech', 'Primordial',
];

registerSubclassAdapter("Cleric_Knowledge", function (cls, lv, specs) {
  if (lv >= 3) {
    // Blessings of Knowledge: proficiency + expertise in 2 skill, + 2 lingue
    specs.push({
      key: 'subclass_knowledge_skills',
      label: 'Blessings of Knowledge — Skill (expertise)',
      type: 'expertise',
      from: ['Arcana', 'History', 'Nature', 'Religion'],
      count: 2,
      level: 3
    });
    specs.push({
      key: 'subclass_knowledge_lang_1',
      label: 'Blessings of Knowledge — Language 1',
      type: 'language_choice',
      from: _KNOWLEDGE_LANGUAGES,
      count: 1,
      level: 3
    });
    specs.push({
      key: 'subclass_knowledge_lang_2',
      label: 'Blessings of Knowledge — Language 2',
      type: 'language_choice',
      from: _KNOWLEDGE_LANGUAGES,
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Cleric_Knowledge", [
  {
    "name": "Channel: Knowledge of the Ages",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "desc": "Choose a skill or tool: for 10 minutes gain proficiency (or double proficiency if already proficient)."
  }
]);
// [SheetRuntime] END
