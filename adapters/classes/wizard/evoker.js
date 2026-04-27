registerSubclassAdapter("Wizard_Evoker", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Evoker", [
  {
    "name": "Potent Cantrip",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 2,
    "desc": "When a creature succeeds on a saving throw against one of your cantrips, it takes half damage (but suffers no other effects from the cantrip)."
  },
  {
    "name": "Sculpt Spells",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "When you cast an Evocation spell that forces saving throws, choose up to (1 + spell level) creatures you can see. Chosen creatures automatically succeed on the save and take no damage from the spell."
  },
  {
    "name": "Empowered Evocation",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "Whenever you cast an Evocation spell from the Wizard spell list, add your Intelligence modifier to one damage roll of that spell."
  },
  {
    "name": "Overchannel",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "overchannel",
    "minLevel": 14,
    "desc": "When you cast an Evocation spell of level 1–5, maximize all damage dice. First use per LR: no extra cost. Each subsequent use before a LR: take 2d12 Necrotic damage per spell level (no save). Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Wizard_Evoker", [
  {
    "key": "overchannel",
    "name": "Overchannel",
    "icon": "zap",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
