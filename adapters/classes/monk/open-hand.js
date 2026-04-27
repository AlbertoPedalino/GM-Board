registerSubclassAdapter("Monk_Open Hand", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Monk_Open Hand", [
  {
    "name": "Open Hand Technique",
    "icon": "",
    "cat": "attack",
    "uses": "With Flurry",
    "minLevel": 3,
    "desc": "When you hit a target with Flurry of Blows, impose one effect: knock Prone (DEX save), push 15 ft away (STR save), or prevent Reactions until your next turn. Save DC = 8 + PB + WIS."
  },
  {
    "name": "Wholeness of Body",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "open_hand_wholeness",
    "minLevel": 6,
    "desc": "Action: regain HP equal to 3 × your Monk level. Recharge: Long Rest."
  },
  {
    "name": "Fleet Step",
    "icon": "",
    "cat": "bonus",
    "uses": "With Step of the Wind",
    "minLevel": 11,
    "desc": "When you use Step of the Wind, you can also use Flurry of Blows as part of the same Bonus Action (spending 1 Focus Point for the Flurry as normal)."
  },
  {
    "name": "Quivering Palm",
    "icon": "",
    "cat": "attack",
    "uses": "3 Discipline Points",
    "resKey": "ki",
    "minLevel": 17,
    "damageFormula": "10d10",
    "damageButtonLabel": ({ formula }) => `${formula} necrotic`,
    "damageKind": "damage",
    "desc": "When you hit with an Unarmed Strike, spend 3 Discipline Points to set up lethal vibrations. Within 24 hours, use an Action to reduce the target to 0 HP (CON save, spell save DC, or take 10d10 Necrotic instead). Only one creature at a time."
  }
]);
registerSubclassSheetResources("Monk_Open Hand", [
  {
    "key": "open_hand_wholeness",
    "name": "Wholeness of Body",
    "icon": "heart",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
