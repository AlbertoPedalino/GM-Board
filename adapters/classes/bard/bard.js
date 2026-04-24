// Bard XPHB: Expertise + Musical Instrument proficiency hardcoded (not in JSON).
const _BARD_INSTRUMENTS = [
  'Bagpipes','Drum','Dulcimer','Flute','Hand Drum',
  'Horn','Lute','Lyre','Pan Flute','Shawm','Viol',
];

registerClassAdapter("Bard", function (cls, lv, specs) {
  if (lv >= 1) {
    specs.push({ key: 'bard_instrument_1', label: 'Musical Instrument 1 (Bard)', type: 'generic_choice', from: _BARD_INSTRUMENTS, count: 1, level: 1 });
    specs.push({ key: 'bard_instrument_2', label: 'Musical Instrument 2 (Bard)', type: 'generic_choice', from: _BARD_INSTRUMENTS, count: 1, level: 1 });
    specs.push({ key: 'bard_instrument_3', label: 'Musical Instrument 3 (Bard)', type: 'generic_choice', from: _BARD_INSTRUMENTS, count: 1, level: 1 });
  }
  if (lv >= 2) {
    specs.push({ key: 'bard_expertise_1', label: 'Expertise (Bard)', type: 'expertise', from: [], count: 1, level: 2 });
    specs.push({ key: 'bard_expertise_2', label: 'Expertise (Bard)', type: 'expertise', from: [], count: 1, level: 2 });
  }
  if (lv >= 9) {
    specs.push({ key: 'bard_expertise_3', label: 'Expertise Lv9 (Bard)', type: 'expertise', from: [], count: 1, level: 9 });
    specs.push({ key: 'bard_expertise_4', label: 'Expertise Lv9 (Bard)', type: 'expertise', from: [], count: 1, level: 9 });
  }
  if (lv >= 19) {
    specs.push({ key: 'bard_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});
