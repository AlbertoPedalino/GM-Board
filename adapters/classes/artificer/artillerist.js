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
    "uses": "1 / LR",
    "resKey": "eldritch_cannon",
    "minLevel": 3,
    "desc": "Action: conjure a Small or Tiny Eldritch Cannon within 5 ft (or in your hand if Tiny). Choose type: Flamethrower (15 ft cone, DEX save = spell DC, 2d8 fire, half on success), Force Ballista (ranged spell attack, 2d8 force, pushed 5 ft), Protector (you + allies within 10 ft gain THP = 1d8 + INT mod). Bonus Action each turn to activate. Lasts 1 hour or until destroyed (AC 18, HP = 5 × Artificer level). 1/LR or expend a spell slot. At lv.15 (Fortified Position): can have 2 active simultaneously."
  },
  {
    "name": "Arcane Firearm",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 5,
    "desc": "Passive: after a Long Rest, use Woodcarver's Tools to carve sigils into a wand, staff, or rod — it becomes your Arcane Firearm. While holding it as a spellcasting focus, once per turn when you cast an Artificer spell through it, roll 1d8 and add it to one damage or healing roll of that spell."
  },
  {
    "name": "Detonate Cannon",
    "icon": "",
    "cat": "action",
    "uses": "1 per Cannon",
    "minLevel": 9,
    "damageFormula": "3d8",
    "damageButtonLabel": ({ formula }) => `${formula} force`,
    "damageKind": "damage",
    "rollLabelPrefix": "Detonate",
    "desc": "Action: while within 60 ft of your Eldritch Cannon, command it to detonate. Each creature within 20 ft must succeed on a STR save (DC = spell save DC) or take 3d8 Force damage (half on success). The cannon is then destroyed."
  },
  {
    "name": "Fortified Position",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "Passive: you always have Half Cover while within 10 ft of one of your Eldritch Cannons. You can now have two Eldritch Cannons active simultaneously — creating a second one still costs an action and a use (or spell slot)."
  }
]);
registerSubclassSheetResources("Artificer_Artillerist", [
  {
    "key": "eldritch_cannon",
    "name": "Eldritch Cannon",
    "icon": "crosshair",
    "recharge": "LR",
    "max": () => 1
  }
]);
registerSubclassSheetProficiencies("Artificer_Artillerist", [
  { type: "tool", values: ["Woodcarver's Tools"], minLevel: 3 },
  { type: "weapon", values: ["Firearms"], minLevel: 3 }
]);
// [SheetRuntime] END
