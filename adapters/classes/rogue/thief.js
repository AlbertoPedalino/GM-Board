registerSubclassAdapter("Rogue_Thief", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Rogue_Thief", [
  {
    "name": "Fast Hands",
    "icon": "",
    "cat": "bonus",
    "uses": "Unlimited",
    "minLevel": 3,
    "desc": "You can use Cunning Action to make a Sleight of Hand check, use Thieves' Tools to disarm a trap or open a lock, or take the Use an Object action."
  },
  {
    "name": "Second-Story Work",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: climbing costs no extra movement. When you make a running jump, the distance increases by a number of feet equal to your DEX modifier."
  },
  {
    "name": "Supreme Sneak",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 9,
    "desc": "Passive: you can apply your Sneak Attack damage even if no ally is adjacent to your target, as long as you took the Hide action this turn before the attack and are hidden from the target."
  },
  {
    "name": "Use Magic Device",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 13,
    "desc": "Passive: you ignore all class, race, and level requirements for using magic items."
  },
  {
    "name": "Thief's Reflexes",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 17,
    "desc": "Passive: you can take two turns during the first round of any combat. You take your first turn at your normal initiative count and your second turn at your initiative count minus 10."
  }
]);
// [SheetRuntime] END
