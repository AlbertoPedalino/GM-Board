registerSubclassAdapter("Warlock_Fiend", function (cls, lv, specs) {});

registerSubclassSheetActions("Warlock_Fiend", [
  {
    "name": "Dark One's Blessing",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "desc": "When you kill a creature with CR >= 1: gain temporary HP equal to your Warlock level + CHA mod."
  }
]);
