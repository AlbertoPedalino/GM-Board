registerSubclassAdapter("Rogue_Assassin", function (cls, lv, specs) {});

registerSubclassSheetActions("Rogue_Assassin", [
  {
    "name": "Assassinate",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Advantage on all attacks against creatures that have not yet acted in combat. Attacks against unaware creatures that result in a hit are automatic critical hits."
  }
]);
