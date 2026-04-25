registerSubclassAdapter("Wizard_Evoker", function (cls, lv, specs) {});

registerSubclassSheetActions("Wizard_Evoker", [
  {
    "name": "Sculpt Spells",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 2,
    "desc": "When you cast an evocation spell that affects an area: choose up to PB visible creatures — they take no damage from the slot (they may still take minimum damage if applicable)."
  }
]);
