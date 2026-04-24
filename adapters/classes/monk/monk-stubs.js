// Warrior of the Open Hand (XPHB): Open Hand Technique, Wholeness of Body, Quivering Palm — tutto passivo.
registerSubclassAdapter("Monk_Open Hand", function (cls, lv, specs) {});
// Warrior of Shadow (XPHB): Shadow Arts, Shadow Step, Cloak of Shadows, Death Strike — tutto passivo.
registerSubclassAdapter("Monk_Shadow", function (cls, lv, specs) {});
// Warrior of the Elements (XPHB): Elemental Attunement, Elemental Burst, Stride of the Elements — tutto passivo.
registerSubclassAdapter("Monk_Elements", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Monk_Open Hand", [
  {
    "name": "Open Hand Technique",
    "icon": "",
    "cat": "attack",
    "uses": "With Flurry",
    "desc": "When using Flurry of Blows, add one of these effects: knock prone (DEX save), push 15ft (STR save), prevent reactions until your next turn."
  }
]);
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
registerSubclassSheetActions("Monk_Elements", [
  {
    "name": "Elemental Disciplines",
    "icon": "",
    "cat": "action",
    "uses": "1+ Ki",
    "resKey": "ki",
    "minLevel": 3,
    "desc": "Spend Ki to shape elements: waves of water, columns of fire, earth tremors, gusts of wind. Each discipline requires specific Ki amounts."
  }
]);
// [SheetRuntime] END
