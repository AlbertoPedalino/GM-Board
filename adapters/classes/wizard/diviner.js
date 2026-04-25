registerSubclassAdapter("Wizard_Diviner", function (cls, lv, specs) {});

registerSubclassSheetActions("Wizard_Diviner", [
  {
    "name": "Portent",
    "icon": "",
    "cat": "action",
    "uses": "2 / LR",
    "resKey": "portent",
    "minLevel": 2,
    "desc": "After a long rest: roll 2d20, keep the results. Before any creature makes a roll, you can replace it with one of your Portent dice (used or unused)."
  }
]);
