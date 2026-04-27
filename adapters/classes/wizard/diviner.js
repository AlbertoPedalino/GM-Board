registerSubclassAdapter("Wizard_Diviner", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Diviner", [
  {
    "name": "Portent",
    "icon": "",
    "cat": "action",
    "uses": "2–3 / LR",
    "resKey": "portent",
    "minLevel": 2,
    "desc": "After a Long Rest: roll 2d20 (3d20 at lv.14), keep the results. Before any creature makes an attack roll, ability check, or saving throw, you can replace the result with one of your Portent dice (expending it). You can do this before or after the roll, but before the DM says whether it succeeds or fails. Recharge: Long Rest."
  },
  {
    "name": "The Third Eye",
    "icon": "",
    "cat": "action",
    "uses": "1 / SR",
    "resKey": "third_eye",
    "minLevel": 10,
    "desc": "Action: gain one of these benefits until your next Short or Long Rest: (1) Darkvision 60 ft; (2) Ethereal Sight — see into the Ethereal Plane within 60 ft; (3) Greater Comprehension — read any language; (4) See Invisibility — see invisible creatures within 10 ft. Recharge: Short Rest."
  }
]);
registerSubclassSheetResources("Wizard_Diviner", [
  {
    "key": "portent",
    "name": "Portent",
    "icon": "eye",
    "recharge": "LR",
    "max": (lv) => lv >= 14 ? 3 : 2
  },
  {
    "key": "third_eye",
    "name": "The Third Eye",
    "icon": "eye",
    "recharge": "SR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
