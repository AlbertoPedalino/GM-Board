registerSubclassAdapter("Monk_Shadow", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Monk_Shadow", [
  {
    "name": "Shadow Arts",
    "icon": "",
    "cat": "action",
    "uses": "1 Focus Point",
    "resKey": "ki",
    "minLevel": 3,
    "desc": "Spend 1 Focus Point to cast Darkness (no material components, WIS is spellcasting ability). You also know the Minor Illusion cantrip, castable at will."
  },
  {
    "name": "Shadow Step",
    "icon": "",
    "cat": "bonus",
    "uses": "At will",
    "minLevel": 6,
    "desc": "Bonus Action while in dim light or darkness: teleport up to 60 ft to an unoccupied space you can see that is also in dim light or darkness. Gain Advantage on the first melee attack you make before the end of your turn."
  },
  {
    "name": "Improved Shadow Step",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Focus Point",
    "resKey": "ki",
    "minLevel": 11,
    "desc": "Enhanced Shadow Step: spend 1 Focus Point when you use Shadow Step to remove the lighting restriction — you can teleport from any lighting condition. You also gain Advantage on the next melee attack before the end of your turn and can make one Unarmed Strike as part of the same Bonus Action."
  },
  {
    "name": "Cloak of Shadows",
    "icon": "",
    "cat": "bonus",
    "uses": "At will (in darkness)",
    "minLevel": 17,
    "desc": "Bonus Action while in dim light or darkness: become Invisible. Ends when you attack, cast a spell, or enter bright light."
  }
]);
// [SheetRuntime] END
