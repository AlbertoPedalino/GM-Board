registerSubclassAdapter("Cleric_Knowledge", function (cls, lv, specs) {
  if (lv >= 3) {
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
      from: window._ALL_LANGS || [],
      count: 1,
      level: 3
    });
    specs.push({
      key: 'subclass_knowledge_lang_2',
      label: 'Blessings of Knowledge — Language 2',
      type: 'language_choice',
      from: window._ALL_LANGS || [],
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
    "desc": "Choose a skill or tool: until you finish a Long Rest, you gain proficiency with it (or Expertise if already proficient)."
  },
  {
    "name": "Channel: Read Thoughts",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "minLevel": 6,
    "desc": "Choose a creature within 60 ft you can see. For 1 minute, read its surface thoughts (it is unaware). You can also use your action to end the effect early and cast Suggestion on the target without expending a spell slot; it automatically fails its saving throw."
  },
  {
    "name": "Channel: Visions of the Past",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "minLevel": 17,
    "desc": "Hold an object or stand in a location to receive visions of events from its recent past (up to WIS score × Cleric level days ago). Concentration for up to 1 minute."
  }
]);
// [SheetRuntime] END
