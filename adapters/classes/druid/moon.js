registerSubclassAdapter("Druid_Moon", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Druid_Moon", [
  {
    "name": "Circle Forms",
    "icon": "",
    "cat": "bonus",
    "uses": "Wild Shape charge",
    "resKey": "wild_shape",
    "minLevel": 3,
    "desc": "Wild Shape into Beasts of higher CR than the base limit: CR 1 (lv.3), CR 2 (lv.5), scaling up (CR = Druid level ÷ 3, rounded down, max CR 10 at lv.9+). Beast form has temporary HP equal to twice your Druid level."
  },
  {
    "name": "Elemental Wild Shape",
    "icon": "",
    "cat": "bonus",
    "uses": "2 Wild Shape charges",
    "resKey": "wild_shape",
    "minLevel": 10,
    "desc": "Spend 2 Wild Shape uses to transform into an Air, Earth, Fire, or Water Elemental for up to 10 minutes instead of a Beast."
  },
  {
    "name": "Thousand Forms",
    "icon": "",
    "cat": "action",
    "uses": "At will",
    "minLevel": 14,
    "desc": "You can cast Alter Self at will, without expending a spell slot."
  }
]);
// [SheetRuntime] END
