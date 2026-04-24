registerSubclassAdapter("Artificer_Battle Smith", function (cls, lv, specs) {
  if (lv < 3) return;
  const bonusCount = typeof _artificerGetConditionalBonusCount === 'function'
    ? _artificerGetConditionalBonusCount(["Smith's Tools"])
    : 0;
  if (!bonusCount) return;
  specs.push({
    key: 'battlesmith_bonus_tool',
    label: 'Battle Smith - Bonus Artisan Tool',
    type: 'generic_choice',
    from: _ARTISAN_TOOLS,
    count: bonusCount,
    level: 3
  });
});

// [SheetRuntime] START
registerSubclassSheetActions("Artificer_Battle Smith", [
  {
    "name": "Steel Defender",
    "icon": "",
    "cat": "bonus",
    "uses": "Command each turn",
    "minLevel": 3,
    "desc": "Your Steel Defender acts on your initiative and can be commanded in combat. It protects allies and can impose disadvantage on attacks."
  },
  {
    "name": "Arcane Jolt",
    "icon": "",
    "cat": "attack",
    "uses": "Limited / LR",
    "minLevel": 9,
    "desc": "When you or your Steel Defender hits, channel arcane energy to deal extra force damage or restore hit points."
  }
]);
// [SheetRuntime] END
