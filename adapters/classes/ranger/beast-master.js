registerSubclassAdapter("Ranger_Beast Master", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_beast_companion_type',
      label: 'Primal Companion',
      type: 'generic_choice',
      from: ['Beast of the Land', 'Beast of the Sea', 'Beast of the Sky'],
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Ranger_Beast Master", [
  {
    "name": "Animal Companion",
    "icon": "",
    "cat": "bonus",
    "uses": "Commands / turn",
    "minLevel": 3,
    "desc": "Bonus action: command your beast companion to attack, move, or use special abilities. If it dies: find a new one (8h ritual)."
  }
]);
// [SheetRuntime] END
