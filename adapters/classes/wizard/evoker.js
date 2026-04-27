registerSubclassAdapter("Wizard_Evoker", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Evoker", [
  {
    "name": "Sculpt Spells",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 2,
    "desc": "When you cast an Evocation spell that forces a saving throw, choose up to (1 + spell level) creatures you can see. Chosen creatures automatically succeed on the save and take no damage from the spell."
  },
  {
    "name": "Overchannel",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "overchannel",
    "minLevel": 14,
    "desc": "When you cast an Evocation spell of level 1–5, maximize all damage dice (no roll needed). First use per LR: no cost. Each subsequent use before a LR: take 2d12 Necrotic damage per spell level, no save. Recharge: Long Rest."
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
