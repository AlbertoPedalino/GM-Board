registerSubclassAdapter("Wizard_Abjurer", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Abjurer", [
  {
    "name": "Arcane Ward",
    "icon": "",
    "cat": "action",
    "uses": "Ward HP",
    "minLevel": 2,
    "desc": "An Arcane Ward surrounds you whenever you cast an Abjuration spell. Ward HP = 2 × Wizard level + INT modifier. When you take damage, the ward absorbs it first. Restore ward HP equal to 2 × spell level each time you cast an Abjuration spell of level 1+. Resets fully on Long Rest."
  },
  {
    "name": "Projected Ward",
    "icon": "",
    "cat": "reaction",
    "uses": "Reaction",
    "minLevel": 6,
    "desc": "When a creature within 30 ft of you takes damage, use your Reaction: your Arcane Ward absorbs that damage instead of the target. The ward loses HP as normal."
  },
  {
    "name": "Spell Breaker",
    "icon": "",
    "cat": "reaction",
    "uses": "Reaction + Spell Slot",
    "minLevel": 10,
    "desc": "When you or a creature you can see within 60 ft succeeds on a saving throw against a spell, use your Reaction and expend a spell slot to end the spell that forced the save if its level ≤ the slot expended. Also, you add your Proficiency Bonus to Dispel Magic checks."
  },
  {
    "name": "Spell Resistance",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "You have Advantage on saving throws against spells. Additionally, you have Resistance to the damage of spells."
  }
]);
// [SheetRuntime] END
