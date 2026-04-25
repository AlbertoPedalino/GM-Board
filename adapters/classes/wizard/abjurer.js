registerSubclassAdapter("Wizard_Abjurer", function (cls, lv, specs) {});

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
