registerSubclassAdapter("Wizard_Bladesinger", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Bladesinger", [
  {
    "name": "Bladesong",
    "icon": "",
    "cat": "bonus",
    "uses": "PB / LR",
    "resKey": "bladesong",
    "minLevel": 2,
    "desc": "Bonus Action: activate Bladesong for 1 minute. While active: +INT modifier to AC, walking speed +10 ft, Advantage on DEX (Acrobatics) checks, +INT modifier to Concentration saves. Ends early if you don armour/shield, are incapacitated, or use both hands for a weapon attack. Recharge: Long Rest."
  },
  {
    "name": "Song of Defense",
    "icon": "",
    "cat": "reaction",
    "uses": "Reaction + Spell Slot",
    "minLevel": 10,
    "desc": "While Bladesong is active: when you or a creature within 60 ft takes damage, use your Reaction and expend a spell slot to reduce that damage by 5 × the slot's level."
  }
]);
registerSubclassSheetResources("Wizard_Bladesinger", [
  {
    "key": "bladesong",
    "name": "Bladesong",
    "icon": "music",
    "recharge": "LR",
    "max": (lv) => lv >= 17 ? 6 : lv >= 13 ? 5 : lv >= 9 ? 4 : lv >= 5 ? 3 : 2
  }
]);
// [SheetRuntime] END
