// Abjurer (XPHB): Abjuration Savant, Arcane Ward, Projected Ward, Spell Resistance — tutto passivo.
registerSubclassAdapter("Wizard_Abjurer", function (cls, lv, specs) {});
// Diviner (XPHB): Divination Savant, Portent (dadi fissi, no scelta build), Expert Divination — tutto passivo.
registerSubclassAdapter("Wizard_Diviner", function (cls, lv, specs) {});
// Evoker (XPHB): Evocation Savant, Sculpt Spells, Potent Cantrip, Empowered Evocation — tutto passivo.
registerSubclassAdapter("Wizard_Evoker", function (cls, lv, specs) {});
// Illusionist (XPHB): Illusion Savant, Improved Minor Illusion (cantrip automatico), Malleable Illusions — tutto passivo.
registerSubclassAdapter("Wizard_Illusionist", function (cls, lv, specs) {});
// Transmuter (XPHB): Transmutation Savant, Transmuter's Stone (scelta a uso, non build), Shapechanger — tutto passivo.
registerSubclassAdapter("Wizard_Transmuter", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Evoker", [
  {
    "name": "Sculpt Spells",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 2,
    "desc": "When you cast an evocation spell that affects an area: choose up to PB visible creatures — they take no damage from the slot (they may still take minimum damage if applicable)."
  }
]);
registerSubclassSheetActions("Wizard_Diviner", [
  {
    "name": "Portent",
    "icon": "",
    "cat": "action",
    "uses": "2 / LR",
    "resKey": "portent",
    "minLevel": 2,
    "desc": "After a long rest: roll 2d20, keep the results. Before any creature makes a roll, you can replace it with one of your Portent dice (used or unused)."
  }
]);
registerSubclassSheetActions("Wizard_Abjurer", [
  {
    "name": "Arcane Ward",
    "icon": "",
    "cat": "reaction",
    "uses": "Ward HP",
    "minLevel": 2,
    "desc": "Maintain an Arcane Ward (HP = level*2+INT). Use reaction to reduce damage taken by you or an ally within 30 ft by (Ward HP remaining). Recharges when you cast Abjuration spells or on a long rest."
  }
]);
// [SheetRuntime] END
