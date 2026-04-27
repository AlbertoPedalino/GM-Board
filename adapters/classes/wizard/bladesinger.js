registerSubclassAdapter("Wizard_Bladesinger", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Bladesinger", [
  {
    "name": "Bladesong",
    "icon": "",
    "cat": "bonus",
    "uses": "PB / LR",
    "resKey": "bladesong",
    "minLevel": 3,
    "desc": "Bonus Action: activate Bladesong for 1 minute. While active: +INT modifier to AC, +10 ft walking speed, Advantage on DEX (Acrobatics) checks, +INT modifier to Concentration saves. Ends early if you don armour/shield, are Incapacitated, or use both hands for a weapon attack. Recharge: Long Rest."
  },
  {
    "name": "Extra Attack",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "You can attack twice when you take the Attack action. If you cast a Bladesinger cantrip as part of this Attack action, you can replace one of those attacks with the cantrip."
  },
  {
    "name": "Song of Defense",
    "icon": "",
    "cat": "reaction",
    "uses": "Reaction + Spell Slot",
    "minLevel": 10,
    "desc": "While Bladesong is active: when you or a creature within 60 ft takes damage, use your Reaction and expend a spell slot to reduce that damage by 5 × the slot's level."
  },
  {
    "name": "Song of Victory",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "While Bladesong is active, add your Intelligence modifier to the damage rolls of your melee weapon attacks."
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
