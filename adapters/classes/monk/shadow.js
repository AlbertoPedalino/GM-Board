registerSubclassAdapter("Monk_Shadow", function (cls, lv, specs) {});

registerSubclassSheetActions("Monk_Shadow", [
  {
    "name": "Shadow Arts",
    "icon": "",
    "cat": "bonus",
    "uses": "1-3 Ki",
    "resKey": "ki",
    "minLevel": 3,
    "desc": "Spend Ki to cast: Darkness (2Ki), Silence (2Ki), Pass Without Trace (2Ki). At lv.6: Dominate Beast (3Ki), Dimension Door (4Ki)."
  }
]);
