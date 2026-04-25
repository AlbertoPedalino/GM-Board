registerSubclassAdapter("Monk_Elements", function (cls, lv, specs) {});

registerSubclassSheetActions("Monk_Elements", [
  {
    "name": "Elemental Disciplines",
    "icon": "",
    "cat": "action",
    "uses": "1+ Ki",
    "resKey": "ki",
    "minLevel": 3,
    "desc": "Spend Ki to shape elements: waves of water, columns of fire, earth tremors, gusts of wind. Each discipline requires specific Ki amounts."
  }
]);
