// Metamagic XPHB 2024
const _METAMAGIC = [
  'Careful Spell', 'Distant Spell', 'Empowered Spell', 'Extended Spell',
  'Heightened Spell', 'Quickened Spell', 'Seeking Spell', 'Subtle Spell',
  'Transmuted Spell', 'Twinned Spell',
];

// Progressione: +2 a L2, +2 a L10, +2 a L17 (totale max 6)
const _MM_SLOTS = [
  { idx: 1, level: 2 }, { idx: 2, level: 2 },
  { idx: 3, level: 10 }, { idx: 4, level: 10 },
  { idx: 5, level: 17 }, { idx: 6, level: 17 },
];

registerClassAdapter("Sorcerer", function (cls, lv, specs) {
  _MM_SLOTS.forEach(function (slot) {
    if (lv >= slot.level) {
      specs.push({
        key: 'sorcerer_metamagic_' + slot.idx,
        label: 'Metamagic ' + slot.idx,
        type: 'generic_choice',
        from: _METAMAGIC,
        count: 1,
        level: slot.level
      });
    }
  });
  if (lv >= 19) {
    specs.push({ key: 'sorcerer_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});
