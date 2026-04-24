registerSubclassAdapter("Artificer_Armorer", function (cls, lv, specs) {
  if (lv < 3) return;

  specs.push({
    key: 'armorer_model',
    label: 'Armorer - Armor Model (Arcane Armor)',
    type: 'generic_choice',
    from: ['Dreadnaught', 'Guardian', 'Infiltrator'],
    count: 1,
    level: 3
  });

  const bonusCount = typeof _artificerGetConditionalBonusCount === 'function'
    ? _artificerGetConditionalBonusCount(["Smith's Tools"])
    : 0;
  if (!bonusCount) return;
  specs.push({
    key: 'armorer_bonus_tool',
    label: 'Armorer - Bonus Artisan Tool',
    type: 'generic_choice',
    from: _ARTISAN_TOOLS,
    count: bonusCount,
    level: 3
  });
});

// [SheetRuntime] START
registerSubclassSheetActions("Artificer_Armorer", [
  {
    "name": "Arcane Armor",
    "icon": "",
    "cat": "action",
    "uses": "At will",
    "minLevel": 3,
    "desc": "Turn worn armor into Arcane Armor and customize it. You can change armor model on a Short or Long Rest while using Smith's Tools."
  },
  {
    "name": "Thunder Gauntlets",
    "icon": "",
    "cat": "attack",
    "uses": "At will",
    "minLevel": 3,
    "model": "Guardian",
    "desc": "Guardian model weapon. On hit, the target has disadvantage on attack rolls against creatures other than you until the start of your next turn."
  },
  {
    "name": "Defensive Field",
    "icon": "",
    "cat": "bonus",
    "uses": "PB / LR",
    "minLevel": 3,
    "model": "Guardian",
    "desc": "Guardian model. Gain temporary hit points as a Bonus Action; you can use this feature a number of times equal to your Proficiency Bonus per Long Rest."
  },
  {
    "name": "Lightning Launcher",
    "icon": "",
    "cat": "attack",
    "uses": "At will",
    "minLevel": 3,
    "model": "Infiltrator",
    "desc": "Infiltrator model ranged weapon. Once on each of your turns, one hit deals extra lightning damage."
  },
  {
    "name": "Force Demolisher",
    "icon": "",
    "cat": "attack",
    "uses": "At will",
    "minLevel": 3,
    "model": "Dreadnaught",
    "desc": "Dreadnaught model weapon. Arcane wrecking ball/sledgehammer that deals 1d10 Force damage. On hit against a creature at least one size smaller than you, you can push it 10 ft away or pull it 10 ft toward you."
  },
  {
    "name": "Giant Stature",
    "icon": "",
    "cat": "bonus",
    "uses": "INT mod / LR",
    "resKey": "armorer_giant_stature",
    "minLevel": 3,
    "model": "Dreadnaught",
    "desc": "Bonus Action. Enlarge your armor for 1 minute: reach +5 ft, and if you are smaller than Large you become Large (space permitting). Uses equal to INT modifier (minimum 1), regained on Long Rest."
  },
  {
    "name": "Perfected Armor (Guardian)",
    "icon": "",
    "cat": "reaction",
    "uses": "At will",
    "minLevel": 15,
    "model": "Guardian",
    "desc": "Guardian perfected armor feature."
  },
  {
    "name": "Perfected Armor (Infiltrator)",
    "icon": "",
    "cat": "reaction",
    "uses": "At will",
    "minLevel": 15,
    "model": "Infiltrator",
    "desc": "Infiltrator perfected armor feature."
  },
  {
    "name": "Perfected Armor (Dreadnought)",
    "icon": "",
    "cat": "reaction",
    "uses": "At will",
    "minLevel": 15,
    "model": "Dreadnaught",
    "desc": "Dreadnought perfected armor feature."
  }
]);
registerSubclassSheetResources("Artificer_Armorer", [
  {
    "key": "armorer_giant_stature",
    "name": "Giant Stature",
    "icon": "maximize",
    "recharge": "LR",
    "max": ()=>Math.max(1,getMod(getFinal('int')))
  }
]);
registerSubclassSheetFeatureFilter("Artificer_Armorer", (ctx, features) => {
  const prefix = String(ctx?.choicePrefix || "");
  const choiceKey = prefix + "armorer_model";
  const raw = ctx?.choices?.[choiceKey];
  const first = Array.isArray(raw) ? raw[0] : raw;
  const nk = String(first || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  let selected = "";
  if (nk === "dreadnaught" || nk.includes("dreadnought")) selected = "dreadnought";
  else if (nk.includes("guardian")) selected = "guardian";
  else if (nk.includes("infiltrator")) selected = "infiltrator";
  if (!selected) return features || [];
  return (features || []).filter(f => {
    const fk = String(f?.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    let tag = "";
    if (fk === "dreadnaught" || fk.includes("dreadnought")) tag = "dreadnought";
    else if (fk.includes("guardian")) tag = "guardian";
    else if (fk.includes("infiltrator")) tag = "infiltrator";
    if (!tag) return true;
    return tag === selected;
  });
});
// [SheetRuntime] END
