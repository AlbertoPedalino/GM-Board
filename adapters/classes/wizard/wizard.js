registerClassAdapter("Wizard", function (cls, lv, specs) {
  if (lv >= 2) {
    // Scholar: expertise in una skill a scelta (nomi dal SKILLS globale + inglese per History/Nature)
    specs.push({
      key: 'wizard_scholar',
      label: 'Scholar (Expertise)',
      type: 'expertise',
      from: ['Arcana', 'Investigation', 'Medicine', 'Religion', 'History', 'Nature'],
      count: 1,
      level: 2
    });
  }
  if (lv >= 18) {
    // Spell Mastery: 1 spell L1 + 1 spell L2 sempre preparate e gratis
    specs.push({
      key: 'wizard_spell_mastery_l1',
      label: 'Spell Mastery — Spell L1',
      type: 'spell_choice',
      spellFilter: { spellLevel: 1, classes: ['Wizard'] },
      count: 1,
      level: 18
    });
    specs.push({
      key: 'wizard_spell_mastery_l2',
      label: 'Spell Mastery — Spell L2',
      type: 'spell_choice',
      spellFilter: { spellLevel: 2, classes: ['Wizard'] },
      count: 1,
      level: 18
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'wizard_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
  if (lv >= 20) {
    // Signature Spells: 2 spell L3 gratuite 1×/SR
    specs.push({
      key: 'wizard_signature_1',
      label: 'Signature Spell 1',
      type: 'spell_choice',
      spellFilter: { spellLevel: 3, classes: ['Wizard'] },
      count: 1,
      level: 20
    });
    specs.push({
      key: 'wizard_signature_2',
      label: 'Signature Spell 2',
      type: 'spell_choice',
      spellFilter: { spellLevel: 3, classes: ['Wizard'] },
      count: 1,
      level: 20
    });
  }
});
