registerSubclassAdapter("Monk_Mercy", function (cls, lv, specs) {});

registerSubclassSheetActions("Monk_Mercy", [
  {
    "name": "Hand of Harm",
    "icon": "",
    "cat": "attack",
    "uses": "Focus Point",
    "minLevel": 3,
    "desc": "When you hit with an Unarmed Strike, expend Focus to deal extra necrotic damage."
  },
  {
    "name": "Hand of Healing",
    "icon": "",
    "cat": "bonus",
    "uses": "Focus Point",
    "minLevel": 3,
    "desc": "Expend Focus to heal a creature you touch; can be used with Flurry of Blows."
  }
]);
