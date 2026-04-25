registerClassAdapter("Druid", function (cls, lv, specs) {
  if (lv >= 1) {
    specs.push({
      key: 'druid_primal_order',
      label: 'Primal Order',
      type: 'generic_choice',
      from: ['Magician', 'Warden'],
      count: 1,
      level: 1
    });
    var _order = typeof char !== 'undefined' && char.choices && char.choices.druid_primal_order;
    var _isMagician = Array.isArray(_order) ? _order.includes('Magician') : _order === 'Magician';
    if (_isMagician) {
      specs.push({
        key: 'druid_magician_cantrip',
        label: 'Magician — Extra Cantrip',
        type: 'spell_choice',
        spellFilter: { spellLevel: 0, classes: ['Druid'] },
        count: 1,
        level: 1
      });
    }
  }
  if (lv >= 7) {
    specs.push({
      key: 'druid_elemental_fury',
      label: 'Elemental Fury',
      type: 'generic_choice',
      from: ['Potent Spellcasting', 'Primal Strike'],
      count: 1,
      level: 7
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'druid_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Druid", [
  {
    "name": "Wild Shape",
    "icon": "",
    "cat": "bonus",
    "uses": "2 / LR",
    "resKey": "wild_shape",
    "minLevel": 2,
    "desc": "Bonus Action. Transform into a Beast you have seen. Max CR: 1/4 (lv.2), 1/2 (lv.4), 1 (lv.8). Retain INT/WIS/CHA scores and class features. Gain the beast's HP, attacks, and physical traits. Lasts until reduced to 0 HP, you end it (Bonus Action), or you fall unconscious. Recharge: Long Rest (2 uses)."
  },
  {
    "name": "Wild Resurgence",
    "icon": "",
    "cat": "bonus",
    "uses": "Situational",
    "minLevel": 5,
    "desc": "If you have no Wild Shape uses left, you can spend a spell slot of lv.1 or higher to regain one. Alternatively, you can expend one Wild Shape use to regain a lv.1 spell slot (once per LR)."
  },
  {
    "name": "Elemental Fury",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 9,
    "desc": "Choose a damage type: Fire or Cold. While in Wild Shape or when you make an Unarmed Strike, you deal +1d6 of that damage type to creatures you hit once per turn."
  },
  {
    "name": "Improved Wild Shape",
    "icon": "",
    "cat": "bonus",
    "uses": "Passive",
    "minLevel": 9,
    "desc": "Beast CR limit: lv.9 = CR 2, lv.10 = CR 3, and so on (CR = Druid level ÷ 3, rounded down, max CR 10)."
  }
]);
registerClassSheetResources("Druid", [
  {
    "key": "wild_shape",
    "name": "Wild Shape",
    "icon": "paw-print",
    "recharge": "SR",
    "max": ()=>2
  }
]);
registerClassSheetProficiencies("Druid", [
  { type: "language", values: ["Druidic"], minLevel: 1 }
]);
// [SheetRuntime] END
