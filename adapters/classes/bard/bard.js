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
    specs.push({ key: 'bard_expertise_1', label: 'Expertise 1 (Bard)', type: 'expertise', from: [], count: 1, level: 2 });
    specs.push({ key: 'bard_expertise_2', label: 'Expertise 2 (Bard)', type: 'expertise', from: [], count: 1, level: 2 });
  }
  if (lv >= 9) {
    specs.push({ key: 'bard_expertise_3', label: 'Expertise 3 (Bard)', type: 'expertise', from: [], count: 1, level: 9 });
    specs.push({ key: 'bard_expertise_4', label: 'Expertise 4 (Bard)', type: 'expertise', from: [], count: 1, level: 9 });
  }
  if (lv >= 10) {
    specs.push({ key: 'bard_magical_secrets_1', label: 'Magical Secrets 1 (Lv.10)', type: 'spell_choice', spellFilter: { spellLevel: null, classes: null, allSpells: true }, count: 1, level: 10 });
    specs.push({ key: 'bard_magical_secrets_2', label: 'Magical Secrets 2 (Lv.10)', type: 'spell_choice', spellFilter: { spellLevel: null, classes: null, allSpells: true }, count: 1, level: 10 });
  }
  if (lv >= 18) {
    specs.push({ key: 'bard_magical_secrets_3', label: 'Magical Secrets 3 (Lv.18)', type: 'spell_choice', spellFilter: { spellLevel: null, classes: null, allSpells: true }, count: 1, level: 18 });
    specs.push({ key: 'bard_magical_secrets_4', label: 'Magical Secrets 4 (Lv.18)', type: 'spell_choice', spellFilter: { spellLevel: null, classes: null, allSpells: true }, count: 1, level: 18 });
  }
  if (lv >= 19) {
    specs.push({ key: 'bard_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

