const _BANNERET_LANGUAGES = [
  'Common', 'Elvish', 'Dwarvish', 'Giant', 'Gnomish', 'Goblin',
  'Halfling', 'Orc', 'Draconic', 'Infernal', 'Celestial', 'Undercommon',
  'Abyssal', 'Sylvan', 'Deep Speech',
];

// Royal Envoy: se già competenti in Persuasione, si sceglie 1 tra queste
const _BANNERET_ENVOY_SKILLS = ['Animal Handling', 'Insight', 'Intimidation', 'Performance'];

registerSubclassAdapter("Fighter_Banneret", function (cls, lv, specs) {
  if (lv >= 3) {
    // Royal Envoy: competenza (o expertise) in Persuasione + 1 lingua
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
