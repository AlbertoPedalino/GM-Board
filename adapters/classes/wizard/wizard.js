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

// [SheetRuntime] START
registerClassSheetActions("Wizard", [
  {
    "name": "Arcane Recovery",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "arc_recovery",
    "desc": "After a Short Rest: recover spell slots with a combined level equal to or less than half your Wizard level (rounded up, max 6th-level slots). Recharge: Long Rest."
  },
  {
    "name": "Spellbook",
    "icon": "",
    "cat": "action",
    "uses": "Always",
    "desc": "Contains your known Wizard spells. Cast prepared rituals without using a slot (+10 min). Copy new spells: costs 50 gp and 2 hours per spell level. Gain 2 free spells at each Wizard level."
  },
  {
    "name": "Memorize Spell",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / SR",
    "minLevel": 5,
    "desc": "After a Short Rest: replace one prepared spell with another Wizard spell from your spellbook. Recharge: Short Rest."
  },
  {
    "name": "Spell Mastery",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "minLevel": 18,
    "desc": "Choose 1 spell of 1st level and 1 of 2nd level from your spellbook: cast each at their lowest level without expending a spell slot, once per Long Rest each."
  },
  {
    "name": "Signature Spells",
    "icon": "",
    "cat": "action",
    "uses": "1 / SR each",
    "minLevel": 20,
    "desc": "Choose two 3rd-level Wizard spells: they are always prepared (don't count toward limit) and you can cast each once per Short Rest without a spell slot."
  }
]);
registerClassSheetResources("Wizard", [
  {
    "key": "arc_recovery",
    "name": "Arcane Recovery",
    "icon": "book-open",
    "recharge": "LR",
    "max": ()=>1
  }
]);
// [SheetRuntime] END
