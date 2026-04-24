// Circle of the Moon (XPHB): Lunar Form, Lunar Radiance, Full of the Moon, Moonlight Step — tutto passivo.
registerSubclassAdapter("Druid_Moon", function (cls, lv, specs) {});
// Circle of the Sea (XPHB): Wrath of the Sea, Aquatic Affinity, Stormborn — tutto passivo.
registerSubclassAdapter("Druid_Sea", function (cls, lv, specs) {});
// Circle of Stars (XPHB): Starry Form (scelta a uso, non build), Star Map, Twinkling Constellations — tutto passivo.
registerSubclassAdapter("Druid_Stars", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Druid_Moon", [
  {
    "name": "Enhanced Wild Shape",
    "icon": "",
    "cat": "action",
    "uses": "2 / SR",
    "resKey": "wild_shape",
    "minLevel": 2,
    "desc": "Wild Shape: CR 1 (lv.2), CR 2 (lv.6), etc. At lv.10 you can assume Elemental form. Cost is always 1 Wild Shape use."
  }
]);
// [SheetRuntime] END
