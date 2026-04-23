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
        label: 'Magician — Cantrip Aggiuntivo',
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
