registerSubclassAdapter("Wizard_Transmuter", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Transmuter", [
  {
    "name": "Minor Alchemy",
    "icon": "",
    "cat": "action",
    "uses": "Action (at will)",
    "minLevel": 2,
    "desc": "Action: touch one non-magical object made of wood, stone, iron, copper, or silver and transform it into a different one of those materials. Object must be Tiny or Small. The transformation lasts 1 hour, or until you use this feature again."
  },
  {
    "name": "Transmuter's Stone",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "transmuter_stone",
    "minLevel": 6,
    "desc": "Action: create a Transmuter's Stone (or replace existing one). Whoever holds it gains one of these benefits (your choice at creation): Darkvision 60 ft, +10 ft speed, proficiency in CON saves, or resistance to Acid/Cold/Fire/Lightning/Thunder (one type). You can change the benefit with an action. Recharge: Long Rest (to create a new one)."
  },
  {
    "name": "Shapechanger",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "shapechanger",
    "minLevel": 10,
    "desc": "Action: cast Polymorph on yourself without expending a spell slot. If you concentrate until the spell ends, you can resume your normal form and regain HP equal to the form's remaining HP. Recharge: Long Rest."
  },
  {
    "name": "Master Transmuter",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR (costs Stone)",
    "resKey": "transmuter_stone",
    "minLevel": 14,
    "desc": "Action: destroy your Transmuter's Stone and choose one effect: (1) Major Transformation — cast Polymorph on a creature within 10 ft (no slot, lasts 1 hour); (2) Panacea — remove curses, diseases, poison and restore all HP of a creature within 10 ft; (3) Restore Life — cast Raise Dead on a creature within 10 ft (no components); (4) Restore Youth — reduce a willing creature's apparent age by 3d10 years (min 13). Recharge: Long Rest (requires recreating the Stone)."
  }
]);
registerSubclassSheetResources("Wizard_Transmuter", [
  {
    "key": "transmuter_stone",
    "name": "Transmuter's Stone",
    "icon": "gem",
    "recharge": "LR",
    "max": () => 1
  },
  {
    "key": "shapechanger",
    "name": "Shapechanger",
    "icon": "refresh-cw",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
