registerSubclassAdapter("Wizard_Abjurer", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Abjurer", [
  {
    "name": "Arcane Ward",
    "icon": "",
    "cat": "action",
    "uses": "Ward HP",
    "minLevel": 2,
    "desc": "Passive: an Arcane Ward surrounds you whenever you cast an Abjuration spell. Ward HP = 2 × Wizard level + INT modifier. When you take damage, the ward absorbs it first. When the ward drops to 0 HP, excess damage hits you. Restore ward HP = 2 × spell level each time you cast an Abjuration spell of level 1+. Resets fully on Long Rest."
  },
  {
    "name": "Projected Ward",
    "icon": "",
    "cat": "reaction",
    "uses": "Reaction",
    "minLevel": 6,
    "desc": "When a creature within 30 ft of you takes damage, use your Reaction: your Arcane Ward absorbs that damage instead of the target. The ward loses HP as normal."
  }
]);
// [SheetRuntime] END
