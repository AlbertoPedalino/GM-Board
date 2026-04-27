const _BANNERET_LANGUAGES = [
  'Common', 'Elvish', 'Dwarvish', 'Giant', 'Gnomish', 'Goblin',
  'Halfling', 'Orc', 'Draconic', 'Infernal', 'Celestial', 'Undercommon',
  'Abyssal', 'Sylvan', 'Deep Speech',
];

const _BANNERET_ENVOY_SKILLS = ['Animal Handling', 'Insight', 'Intimidation', 'Performance'];

registerSubclassAdapter("Fighter_Banneret", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_banneret_envoy_skill',
      label: 'Royal Envoy — Skill Bonus',
      type: 'skill_choice',
      from: _BANNERET_ENVOY_SKILLS,
      count: 1,
      level: 3
    });
    specs.push({
      key: 'subclass_banneret_language',
      label: 'Royal Envoy — Language',
      type: 'language_choice',
      from: _BANNERET_LANGUAGES,
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Fighter_Banneret", [
  {
    "name": "Royal Envoy",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: gain proficiency in Persuasion (or expertise if already proficient), an extra language, and proficiency in one of Animal Handling, Insight, Intimidation, or Performance."
  },
  {
    "name": "Rallying Cry",
    "icon": "",
    "cat": "bonus",
    "uses": "On Second Wind",
    "minLevel": 3,
    "desc": "When you use Second Wind, choose up to three creatures you can see within 60 ft. Each of those creatures regains HP equal to your Fighter level. This is in addition to the HP you regain."
  },
  {
    "name": "Inspiring Surge",
    "icon": "",
    "cat": "bonus",
    "uses": "On Action Surge",
    "minLevel": 10,
    "desc": "When you use Action Surge, choose one ally within 60 ft who can see or hear you. That creature can use its Reaction to make one melee or ranged weapon attack."
  },
  {
    "name": "Bulwark",
    "icon": "",
    "cat": "reaction",
    "uses": "On Indomitable",
    "minLevel": 14,
    "desc": "When you use Indomitable to reroll a saving throw, you can choose one ally within 60 ft who failed the same save. That ally also rerolls their saving throw and must use the new roll."
  }
]);
// [SheetRuntime] END
