// Trickery Domain (XPHB): tutte le feature sono passive o azioni fisse, nessuna scelta di build.
// L3: Blessing of the Trickster, Invoke Duplicity (CD)
// L6: Trickery Domain Spells (automatiche)
// L17: Improved Duplicity
registerSubclassAdapter("Cleric_Trickery", function (cls, lv, specs) {
  // nessuna spec
});

// [SheetRuntime] START
registerSubclassSheetActions("Cleric_Trickery", [
  {
    "name": "Blessing of the Trickster",
    "icon": "",
    "cat": "action",
    "uses": "Action (at will)",
    "minLevel": 3,
    "desc": "Touch a willing creature. It has Advantage on DEX (Stealth) checks for 1 hour. Ends early if you use this feature again."
  },
  {
    "name": "Channel: Invoke Duplicity",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel / Conc.",
    "resKey": "channel_div",
    "desc": "Create an illusory duplicate of yourself within 30 ft. As a Bonus Action move it up to 30 ft. You can cast spells as if occupying its space. Lv.17: up to 4 duplicates simultaneously."
  }
]);
// [SheetRuntime] END
