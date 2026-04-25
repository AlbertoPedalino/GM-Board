registerSubclassAdapter("Paladin_Ancients", function (cls, lv, specs) {});

registerSubclassSheetActions("Paladin_Ancients", [
  {
    "name": "Channel: Nature's Wrath",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Fey and Celestials within 30 ft regain 2d6+CHA HP. Undead and Fiends must succeed on a WIS save (DC=8+PB+CHA) or be Frightened for 1 minute."
  }
]);
