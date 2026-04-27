registerSubclassAdapter("Ranger_Beast Master", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_beast_companion_type',
      label: 'Primal Companion',
      type: 'generic_choice',
      from: ['Beast of the Land', 'Beast of the Sea', 'Beast of the Sky'],
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Ranger_Beast Master", [
  {
    "name": "Animal Companion",
    "icon": "",
    "cat": "bonus",
    "uses": "Commands / turn",
    "minLevel": 3,
    "desc": "Bonus Action: command your Primal Companion to take the Attack, Dash, Disengage, Dodge, or Help action. It acts on your initiative and uses your Proficiency Bonus. If it dies: spend 8 hours to bond a new companion."
  },
  {
    "name": "Exceptional Training",
    "icon": "",
    "cat": "bonus",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "Your Primal Companion's attacks count as magical. On any turn you don't command it, it can take the Dash, Disengage, or Help action on its own."
  },
  {
    "name": "Bestial Fury",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 11,
    "desc": "When you command your Primal Companion to attack, it can make two attacks instead of one."
  },
  {
    "name": "Share Spells",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "When you cast a spell targeting yourself, you can also affect your Primal Companion with the spell if it is within 30 ft of you."
  }
]);
// [SheetRuntime] END
