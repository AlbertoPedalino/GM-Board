registerSubclassAdapter("Artificer_Artillerist", function (cls, lv, specs) {
  if (lv < 3) return;
  const bonusCount = typeof _artificerGetConditionalBonusCount === 'function'
    ? _artificerGetConditionalBonusCount(["Woodcarver's Tools"])
    : 0;
  if (!bonusCount) return;
  specs.push({
    key: 'artillerist_bonus_tool',
    label: 'Artillerist - Bonus Artisan Tool',
    type: 'generic_choice',
    from: _ARTISAN_TOOLS,
    count: bonusCount,
    level: 3
  });
});
