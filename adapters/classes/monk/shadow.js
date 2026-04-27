registerSubclassAdapter("Monk_Shadow", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Monk_Shadow", [
  {
    "name": "Shadow Arts",
    "icon": "",
    "cat": "action",
    "uses": "Discipline Points",
    "resKey": "ki",
    "minLevel": 3,
    "desc": "Spend Discipline Points to cast (no material components): Darkness (2 DP), Darkvision (2 DP), Pass Without Trace (2 DP), Silence (2 DP). You can also cast Minor Illusion as a cantrip for free."
  },
  {
    "name": "Shadow Step",
    "icon": "",
    "cat": "bonus",
    "uses": "At will",
    "minLevel": 6,
    "desc": "Bonus Action while in dim light or darkness: teleport up to 60 ft to an unoccupied space you can see that is also in dim light or darkness. Gain Advantage on the first melee attack you make before the end of your turn."
  },
  {
    "name": "Cloak of Shadows",
    "icon": "",
    "cat": "action",
    "uses": "1 Discipline Point",
    "resKey": "ki",
    "minLevel": 11,
    "desc": "Action while in dim light or darkness: spend 1 Discipline Point to become Invisible. Ends at the start of your next turn, or when you attack or cast a spell."
  },
  {
    "name": "Opportunist",
    "icon": "",
    "cat": "reaction",
    "uses": "At will",
    "minLevel": 17,
    "desc": "Reaction when a creature within 5 ft is hit by an attack made by a creature other than you: make one melee attack against that creature."
  }
]);
// [SheetRuntime] END
