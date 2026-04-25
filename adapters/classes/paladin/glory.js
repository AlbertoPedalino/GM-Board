registerSubclassAdapter("Paladin_Glory", function (cls, lv, specs) {});

registerSubclassSheetActions("Paladin_Glory", [
  {
    "name": "Channel: Gift of the Brave",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Chosen creatures within 30 ft gain for 1 minute: +PB to Athletics/Acrobatics checks, +10 ft movement speed."
  }
]);
