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
    "choiceKey": "armorer_model",
    "model": "Guardian",
    "attackAbility": "int",
    "damageFormula": "1d8",
    "damageButtonLabel": ({ formula }) => `${formula} thunder`,
    "damageKind": "damage",
    "desc": "Guardian model melee weapon (INT to attack/damage). On hit, the target has Disadvantage on attack rolls against creatures other than you until the start of your next turn."
  },
  {
    "name": "Defensive Field",
    "icon": "",
    "cat": "bonus",
    "uses": "PB / LR",
    "resKey": "defensive_field",
    "minLevel": 3,
    "choiceKey": "armorer_model",
    "model": "Guardian",
    "desc": "Guardian model. Bonus Action: gain THP equal to your Artificer level. Uses: Proficiency Bonus per Long Rest. Recharge: Long Rest."
  },
  {
    "name": "Lightning Launcher",
    "icon": "",
    "cat": "attack",
    "uses": "At will",
    "minLevel": 3,
    "choiceKey": "armorer_model",
    "model": "Infiltrator",
    "attackAbility": "int",
    "damageFormula": "1d6",
    "damageButtonLabel": ({ formula }) => `${formula} lightning`,
    "damageKind": "damage",
    "desc": "Infiltrator model ranged weapon (range 90/300, INT to attack/damage). Once per turn, one creature hit by it also takes an extra 1d6 Lightning damage."
  },
  {
    "name": "Force Demolisher",
    "icon": "",
    "cat": "attack",
    "uses": "At will",
    "minLevel": 3,
    "choiceKey": "armorer_model",
    "model": "Dreadnaught",
    "attackAbility": "int",
    "damageFormula": "1d10",
    "damageButtonLabel": ({ formula }) => `${formula} force`,
    "damageKind": "damage",
    "desc": "Dreadnaught model melee weapon (INT to attack/damage, 1d10 Force). On hit: push the target up to 10 ft away or pull it 10 ft toward you."
  },
  {
    "name": "Giant Stature",
    "icon": "",
    "cat": "bonus",
    "uses": "INT mod / LR",
    "resKey": "armorer_giant_stature",
    "minLevel": 3,
    "choiceKey": "armorer_model",
    "model": "Dreadnaught",
    "desc": "Bonus Action. Enlarge your armor for 1 minute: reach +5 ft, and if you are smaller than Large you become Large (space permitting). Uses equal to INT modifier (minimum 1), regained on Long Rest."
  },
  {
    "name": "Extra Attack",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 5,
    "desc": "Passive: you can attack twice whenever you take the Attack action on your turn."
  },
  {
    "name": "Armor Modifications",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 9,
    "desc": "Passive: your Arcane Armor can hold four infusions at once (instead of the normal two), and the required attunement slot does not count against your normal limit for this armor."
  },
  {
    "name": "Perfected Armor (Guardian)",
    "icon": "",
    "cat": "reaction",
    "uses": "Reaction",
    "minLevel": 15,
    "choiceKey": "armorer_model",
    "model": "Guardian",
    "desc": "Deflect Attack: when a creature you can see targets a creature other than you that is within 5 ft of your armor, use your Reaction to impose Disadvantage on the attack roll."
  },
  {
    "name": "Perfected Armor (Infiltrator)",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 15,
    "choiceKey": "armorer_model",
    "model": "Infiltrator",
    "desc": "Passive: once per turn, when you hit a creature with your Lightning Launcher, that creature has Disadvantage on attack rolls against creatures other than you until the start of your next turn, and the creature takes an extra 1d6 Lightning damage."
  },
  {
    "name": "Perfected Armor (Dreadnought)",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 15,
    "choiceKey": "armorer_model",
    "model": "Dreadnaught",
    "desc": "Passive: when you hit with your Force Demolisher, you can push the target up to 30 ft away in a direction of your choice (no size restriction), or pull it 30 ft toward you."
  }
]);
registerSubclassSheetResources("Artificer_Armorer", [
  {
    "key": "defensive_field",
    "name": "Defensive Field",
    "icon": "shield",
    "recharge": "LR",
    "max": (lv) => lv >= 17 ? 6 : lv >= 13 ? 5 : lv >= 9 ? 4 : lv >= 5 ? 3 : 2
  },
  {
    "key": "armorer_giant_stature",
    "name": "Giant Stature",
    "icon": "maximize",
    "recharge": "LR",
    "max": () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('int')) : 1)
  }
]);
registerSubclassSheetProficiencies("Artificer_Armorer", [
  { type: "tool", values: ["Smith's Tools"], minLevel: 3 },
  { type: "armor", values: ["Heavy"], minLevel: 3 }
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

if (typeof registerSubclassChoiceDetailDataProvider === "function") {
  registerSubclassChoiceDetailDataProvider("Artificer", "Armorer", function (choiceKey, values, subFeatures) {
    if (choiceKey !== "armorer_model") return null;
    if (!Array.isArray(values) || !values.length) return null;
    if (!Array.isArray(subFeatures) || !subFeatures.length) return null;

    function canon(v) {
      const k = String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (k === "dreadnaught" || k.includes("dreadnought")) return "dreadnought";
      if (k.includes("guardian")) return "guardian";
      if (k.includes("infiltrator")) return "infiltrator";
      return "";
    }

    const target = canon(values[0]);
    if (!target) return null;

    const ordered = subFeatures.slice().sort(function (a, b) { return (a.level || 0) - (b.level || 0); });

    function walk(node) {
      if (!node) return null;
      if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) { var r = walk(node[i]); if (r) return r; }
        return null;
      }
      if (typeof node !== "object") return null;
      if (node.name && canon(node.name) === target && (node.entries || node.entry)) return node;
      var kids = [node.entries, node.entry, node.items, node.rows];
      for (var j = 0; j < kids.length; j++) { var r2 = walk(kids[j]); if (r2) return r2; }
      return null;
    }

    var direct = ordered.find(function (f) { return canon(f && f.name) === target && (f.entries || f.entry); });
    if (direct) return direct;
    return walk(ordered.map(function (f) { return f.entries; }));
  });
}
