registerSubclassAdapter("Monk_Open Hand", function (cls, lv, specs) {});

registerSubclassSheetActions("Monk_Open Hand", [
  {
    "name": "Open Hand Technique",
    "icon": "",
    "cat": "attack",
    "uses": "With Flurry",
    "desc": "When using Flurry of Blows, add one of these effects: knock prone (DEX save), push 15ft (STR save), prevent reactions until your next turn."
  }
]);
