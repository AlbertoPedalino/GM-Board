// Bard XPHB: le feature Expertise non hanno struttura JSON → hardcodate qui.
// type:'expertise' mostra solo le skill di cui il personaggio è già competente.
registerClassAdapter("Bard", function (cls, lv, specs) {
  if (lv >= 2) {
    specs.push({
      key: 'bard_expertise_1',
      label: 'Expertise (Bard)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 2
    });
    specs.push({
      key: 'bard_expertise_2',
      label: 'Expertise (Bard)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 2
    });
  }
  if (lv >= 9) {
    specs.push({
      key: 'bard_expertise_3',
      label: 'Expertise Lv9 (Bard)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 9
    });
    specs.push({
      key: 'bard_expertise_4',
      label: 'Expertise Lv9 (Bard)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 9
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'bard_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});
