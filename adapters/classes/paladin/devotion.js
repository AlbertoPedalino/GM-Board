registerSubclassAdapter("Paladin_Devotion", function (cls, lv, specs) {});

registerSubclassSheetActions("Paladin_Devotion", [
  {
    "name": "Channel: Sacred Weapon",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Bonus action: infuse your held weapon for 1 minute. Add CHA mod to attack rolls (min +1). The weapon sheds bright light in a 20-ft radius."
  }
]);
