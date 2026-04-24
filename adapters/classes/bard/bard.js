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

registerClassSheetActions("Bard", [
  { name: "Bardic Inspiration", icon: "", cat: "bonus",  uses: "CHA mod / SR", resKey: "bardic_insp",
    desc: "Bonus Action: give one Bardic Inspiration die to a creature within 60 ft (not yourself). Die size: d6 (lv.1–4), d8 (lv.5–9), d10 (lv.10–14), d12 (lv.15–20). Recipient adds the die to one attack roll, ability check, or saving throw within 10 minutes. Recharge: Short Rest (lv.5+) or Long Rest." },
  { name: "Jack of All Trades", icon: "", cat: "action", uses: "Passive", minLevel: 2,
    desc: "Add half your Proficiency Bonus (rounded down) to any ability check that doesn't already use your Proficiency Bonus." },
  { name: "Expertise",          icon: "", cat: "action", uses: "Passive", minLevel: 2,
    desc: "Choose two skill proficiencies: double your Proficiency Bonus for those skills (lv.2). Choose two more at lv.9." },
  { name: "Font of Inspiration",icon: "", cat: "action", uses: "Passive", minLevel: 5,
    desc: "Your Bardic Inspiration recharges on a Short Rest as well as a Long Rest." },
  { name: "Countercharm",       icon: "", cat: "action", uses: "Passive", minLevel: 7,
    desc: "As an Action, begin a performance that lasts until the end of your next turn. Friendly creatures within 30 ft who can hear you gain Advantage on saving throws against being Charmed or Frightened." },
  { name: "Magical Secrets",    icon: "", cat: "action", uses: "Passive", minLevel: 10,
    desc: "Learn 2 spells from any class's spell list (of a level you can cast). They count as Bard spells. Gain 2 more at lv.18." },
  { name: "Words of Creation",  icon: "", cat: "action", uses: "Passive", minLevel: 20,
    desc: "You learn Power Word Heal and Power Word Kill. Both are always prepared and count as Bard spells. You can cast each once per turn." },
]);

registerClassSheetResources("Bard", [
  { key: 'bardic_insp', name: 'Bardic Inspiration', icon: 'music', recharge: 'SR',
    actionName: 'Bardic Inspiration',
    max: () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('cha')) : 3) },
]);
