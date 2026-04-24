// Life Domain (XPHB): tutte le feature sono passive, nessuna scelta di build.
// L3: Disciple of Life, Preserve Life (CD)
// L6: Blessed Healer
// L17: Supreme Healing
registerSubclassAdapter("Cleric_Life", function (cls, lv, specs) {
  // nessuna spec
});

// [SheetRuntime] START
registerSubclassSheetActions("Cleric_Life", [
  {
    "name": "Channel: Preserve Life",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "desc": "Within 30 ft: distribute HP equal to 5 x Cleric level among any creatures of your choice (excluding Undead and Constructs), without exceeding each creature's maximum."
  }
]);
// [SheetRuntime] END
