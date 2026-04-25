registerSubclassAdapter("Paladin_Vengeance", function (cls, lv, specs) {});

registerSubclassSheetActions("Paladin_Vengeance", [
  {
    "name": "Channel: Vow of Enmity",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Bonus action: advantage on all attacks against one visible creature within 10 ft for 1 minute (or until it dies or hides)."
  }
]);
