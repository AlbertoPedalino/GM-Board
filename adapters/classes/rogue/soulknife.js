registerSubclassAdapter("Rogue_Soulknife", function (cls, lv, specs) {});

registerSubclassSheetActions("Rogue_Soulknife", [
  {
    "name": "Psychic Blades",
    "icon": "",
    "cat": "attack",
    "uses": "Psychic",
    "minLevel": 3,
    "desc": "Materialize psychic blades (finesse, throwable): 1d6 psychic damage + DEX. Materialize a second blade as bonus action. Blades disappear after the attack."
  }
]);
