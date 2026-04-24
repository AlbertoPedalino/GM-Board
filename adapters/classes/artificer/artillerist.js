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

// [SheetRuntime] START
registerSubclassSheetActions("Artificer_Artillerist", [
  {
    "name": "Eldritch Cannon",
    "icon": "",
    "cat": "action",
    "uses": "Create/command",
    "minLevel": 3,
    "desc": "Create a magical cannon and command it in combat. Cannon type (Flamethrower, Force Ballista, Protector) is chosen when you create it."
  }
]);
// [SheetRuntime] END
