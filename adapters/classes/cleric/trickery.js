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
    "name": "Channel: Invoke Duplicity",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel / Conc.",
    "resKey": "channel_div",
    "desc": "Create an illusory duplicate of yourself within 30 ft. As a bonus action you can move it (up to 30 ft). You can cast spells as if you were in its space."
  }
]);
// [SheetRuntime] END
