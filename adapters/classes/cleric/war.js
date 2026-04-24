// War Domain (XPHB): tutte le feature sono passive o azioni fisse, nessuna scelta di build.
// L3: War Priest, Guided Strike (CD)
// L6: War God's Blessing
// L17: Avatar of Battle (resistenze B/P/S)
registerSubclassAdapter("Cleric_War", function (cls, lv, specs) {
  // nessuna spec
});

// [SheetRuntime] START
registerSubclassSheetActions("Cleric_War", [
  {
    "name": "War Priest",
    "icon": "",
    "cat": "bonus",
    "uses": "PB / LR",
    "resKey": "war_priest",
    "minLevel": 3,
    "desc": "After taking the Attack action on your turn, you can make one weapon attack as a Bonus Action. Uses = your Proficiency Bonus per Long Rest."
  },
  {
    "name": "Channel: Guided Strike",
    "icon": "",
    "cat": "reaction",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "minLevel": 3,
    "desc": "Reaction when you or an ally within 30 ft misses an attack: expend one Channel Divinity use to add +10 to the roll, potentially turning a miss into a hit."
  },
  {
    "name": "Channel: War God's Blessing",
    "icon": "",
    "cat": "reaction",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "minLevel": 6,
    "desc": "Reaction when an ally within 30 ft makes an attack roll: expend one Channel Divinity use to add +10 to that roll. Can turn a miss into a hit."
  }
]);
registerSubclassSheetResources("Cleric_War", [
  {
    "key": "war_priest",
    "name": "War Priest",
    "icon": "swords",
    "recharge": "LR",
    "max": ()=>getPB()
  }
]);
// [SheetRuntime] END
