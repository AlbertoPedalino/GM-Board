registerSubclassAdapter("Sorcerer_Wild Magic", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Sorcerer_Wild Magic", [
  {
    "name": "Wild Magic Surge",
    "icon": "",
    "cat": "action",
    "uses": "DM discretion",
    "minLevel": 3,
    "desc": "Each time you cast a 1st-level or higher spell, the DM may have you roll a d20: on a 1, roll a d100 on the Wild Magic Surge table. At lv.14 (Controlled Chaos): roll twice and choose either result."
  },
  {
    "name": "Tides of Chaos",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "wild_tides",
    "minLevel": 3,
    "desc": "Gain Advantage on one attack roll, ability check, or saving throw of your choice. The DM may have you roll on the Wild Magic Surge table before you can regain this use. Recharge: Long Rest (or triggered surge)."
  },
  {
    "name": "Bend Luck",
    "icon": "",
    "cat": "reaction",
    "uses": "2 Sorcery Points",
    "resKey": "sorc_pts",
    "minLevel": 6,
    "desc": "Reaction when another creature you can see makes an attack roll, ability check, or saving throw: spend 2 Sorcery Points to roll 1d4 and add or subtract it from the roll (before the DM reveals the outcome)."
  },
  {
    "name": "Controlled Chaos",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "When you roll on the Wild Magic Surge table, roll twice and choose either result."
  },
  {
    "name": "Tamed Surge",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 18,
    "desc": "Whenever you roll on the Wild Magic Surge table, you can roll twice and use either result."
  }
]);
registerSubclassSheetResources("Sorcerer_Wild Magic", [
  {
    "key": "wild_tides",
    "name": "Tides of Chaos",
    "icon": "zap",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
