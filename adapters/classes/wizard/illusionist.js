registerSubclassAdapter("Wizard_Illusionist", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Illusionist", [
  {
    "name": "Improved Illusions",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: you can create auditory or visual components of illusions independently (no need for both). You add your Proficiency Bonus to the spell save DC of Illusion spells you cast."
  },
  {
    "name": "Phantasmal Creatures",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "When you cast an Illusion spell of level 1 or higher, you can make illusions more believable: creatures examining your illusion must beat your spell save DC with an Investigation check to disbelieve it. In addition, your Illusion spells that deal damage deal one extra die of damage."
  },
  {
    "name": "Illusory Self",
    "icon": "",
    "cat": "reaction",
    "uses": "1 / SR",
    "resKey": "illusory_self",
    "minLevel": 10,
    "desc": "When a creature makes an attack roll against you, use your Reaction to interpose an illusory duplicate. The attack automatically misses you. Recharge: Short Rest."
  },
  {
    "name": "Illusory Reality",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "When you cast an Illusion spell of level 1+, you can choose one non-magical, non-living object within the spell (up to 5-foot cube) and make it temporarily real for 1 minute. The object interacts with the world normally until it disappears at the end of the duration."
  }
]);
registerSubclassSheetResources("Wizard_Illusionist", [
  {
    "key": "illusory_self",
    "name": "Illusory Self",
    "icon": "user",
    "recharge": "SR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
