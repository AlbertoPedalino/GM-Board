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
