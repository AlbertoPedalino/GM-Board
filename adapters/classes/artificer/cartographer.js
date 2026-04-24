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
