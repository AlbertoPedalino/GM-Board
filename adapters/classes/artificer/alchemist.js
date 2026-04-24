registerSubclassAdapter("Artificer_Alchemist", function (cls, lv, specs) {
  if (lv < 3) return;
  const bonusCount = typeof _artificerGetConditionalBonusCount === 'function'
    ? _artificerGetConditionalBonusCount(["Alchemist's Supplies", 'Herbalism Kit'])
    : 0;
  if (!bonusCount) return;
  specs.push({
    key: 'alchemist_bonus_tool',
    label: 'Alchemist - Bonus Artisan Tool',
    type: 'generic_choice',
    from: _ARTISAN_TOOLS,
    count: bonusCount,
    level: 3
  });
});
