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
    "name": "Moonlight Step",
    "icon": "",
    "cat": "bonus",
    "uses": "PB / LR",
    "resKey": "moon_moonlight_step",
    "minLevel": 10,
    "desc": "Bonus Action: teleport up to 30 ft to an unoccupied space you can see. You can also cast a Druid spell of 1st level or higher with a Bonus Action casting time after teleporting. Uses = Proficiency Bonus per Long Rest."
  },
  {
    "name": "Lunar Form",
    "icon": "",
    "cat": "bonus",
    "uses": "While in Wild Shape",
    "minLevel": 14,
    "desc": "While in Wild Shape, you can switch between New Moon Form and Full Moon Form as a Bonus Action. New Moon Form: Unarmed Strikes deal extra Necrotic damage equal to your WIS modifier. Full Moon Form: emit bright light 10 ft and dim 10 ft beyond; creatures that hit you take Radiant damage equal to your WIS modifier."
  }
]);
registerSubclassSheetResources("Druid_Moon", [
  {
    "key": "moon_moonlight_step",
    "name": "Moonlight Step",
    "icon": "moon",
    "recharge": "LR",
    "max": (lv) => lv >= 17 ? 6 : lv >= 13 ? 5 : lv >= 9 ? 4 : lv >= 5 ? 3 : 2
  }
]);
// [SheetRuntime] END
