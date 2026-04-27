registerSubclassAdapter("Sorcerer_Clockwork", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Sorcerer_Clockwork", [
  {
    "name": "Restore Balance",
    "icon": "",
    "cat": "reaction",
    "uses": "PB / LR",
    "resKey": "clockwork_restore",
    "minLevel": 3,
    "desc": "Reaction when a creature within 60 ft you can see is about to roll a d20 with Advantage or Disadvantage: cancel that Advantage or Disadvantage before the roll. Recharge: Proficiency Bonus per Long Rest."
  },
  {
    "name": "Bastion of Law",
    "icon": "",
    "cat": "action",
    "uses": "1–5 Sorcery Points",
    "resKey": "sorc_pts",
    "minLevel": 6,
    "desc": "Action: spend 1–5 Sorcery Points and touch a creature to give it Protection Dice (d8s) equal to points spent. When it takes damage, spend one die (no action) to reduce the damage by that roll. Pool lasts until you finish a Long Rest or use this again."
  },
  {
    "name": "Trance of Order",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / LR",
    "resKey": "clockwork_trance",
    "minLevel": 14,
    "desc": "Bonus Action: enter a state of clockwork order for 1 minute. Attack rolls against you can't benefit from Advantage, and when you make an attack roll or saving throw you can treat a d20 roll of 9 or lower as a 10. Recharge: Long Rest."
  },
  {
    "name": "Clockwork Cavalcade",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "clockwork_cavalcade",
    "minLevel": 18,
    "desc": "Action: call spirits of order into a 30-ft cube. Creatures of your choice regain 10d6 HP; damaged objects/constructs are repaired; effects from spells of 6th level or lower are dispelled. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Sorcerer_Clockwork", [
  {
    "key": "clockwork_restore",
    "name": "Restore Balance",
    "icon": "settings",
    "recharge": "LR",
    "max": (lv) => lv >= 17 ? 6 : lv >= 13 ? 5 : lv >= 9 ? 4 : lv >= 5 ? 3 : 2
  },
  {
    "key": "clockwork_trance",
    "name": "Trance of Order",
    "icon": "clock",
    "recharge": "LR",
    "max": () => 1
  },
  {
    "key": "clockwork_cavalcade",
    "name": "Clockwork Cavalcade",
    "icon": "cog",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
