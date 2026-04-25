registerSubclassAdapter("Artificer_Cartographer", function (cls, lv, specs) {
  if (lv < 3) return;
  const bonusCount = typeof _artificerGetConditionalBonusCount === 'function'
    ? _artificerGetConditionalBonusCount(["Calligrapher's Supplies", "Cartographer's Tools"])
    : 0;
  if (!bonusCount) return;
  specs.push({
    key: 'cartographer_bonus_tool',
    label: 'Cartographer - Bonus Artisan Tool',
    type: 'generic_choice',
    from: _ARTISAN_TOOLS,
    count: bonusCount,
    level: 3
  });
});

// [SheetRuntime] START
registerSubclassSheetActions("Artificer_Cartographer", [
  {
    "name": "Adventurer's Atlas",
    "icon": "",
    "cat": "action",
    "uses": "After Long Rest",
    "minLevel": 3,
    "desc": "Create magical maps that support navigation and coordination for you and bonded creatures."
  }
]);
registerSubclassSheetProficiencies("Artificer_Cartographer", [
  { type: "tool", values: ["Calligrapher's Supplies", "Cartographer's Tools"], minLevel: 3 }
]);
// [SheetRuntime] END
