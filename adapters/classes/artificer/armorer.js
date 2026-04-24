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
