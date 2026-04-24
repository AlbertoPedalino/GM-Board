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

// [SheetRuntime] START
registerClassSheetActions("Sorcerer", [
  {
    "name": "Innate Sorcery",
    "icon": "",
    "cat": "bonus",
    "uses": "2 / LR",
    "resKey": "sorc_pts",
    "minLevel": 1,
    "desc": "Bonus Action: unleash magical energy for 1 minute. During this time your spell save DC increases by 1, and you have Advantage on the attack rolls of Sorcerer spells you cast. Uses: 2 per Long Rest."
  },
  {
    "name": "Font of Magic",
    "icon": "",
    "cat": "action",
    "uses": "Sorcery Points",
    "resKey": "sorc_pts",
    "minLevel": 2,
    "desc": "Sorcery Points = Sorcerer level (replenish on Long Rest). Spend points to create spell slots or convert slots into points. Creating a slot: lv.1=2pt, lv.2=3pt, lv.3=5pt, lv.4=6pt, lv.5=7pt."
  },
  {
    "name": "Metamagic",
    "icon": "",
    "cat": "action",
    "uses": "Sorcery Points",
    "resKey": "sorc_pts",
    "minLevel": 2,
    "desc": "Modify spells with Sorcery Points. Options: Careful (2pt, allies auto-succeed save), Distant (1pt, double range), Empowered (1pt, reroll damage dice up to CHA mod), Extended (1pt, double duration), Heightened (3pt, target has Disadvantage on first save), Quickened (2pt, cast as Bonus Action), Seeking (1pt/miss, reroll attack), Subtle (1pt, no V or S component), Transmuted (1pt, change damage type), Twinned (1pt, second target same spell)."
  },
  {
    "name": "Sorcerous Restoration",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 5,
    "desc": "Regain expended Sorcery Points when you finish a Short Rest. Number restored = half your Sorcerer level (rounded down)."
  },
  {
    "name": "Sorcery Incarnate",
    "icon": "",
    "cat": "action",
    "uses": "Innate Sorcery",
    "minLevel": 20,
    "desc": "While your Innate Sorcery feature is active: if you have no uses of Metamagic, you can use two Metamagic options simultaneously on a spell; additionally, each Metamagic option can be applied twice."
  }
]);
registerClassSheetResources("Sorcerer", [
  {
    "key": "sorc_pts",
    "name": "Sorcery Points",
    "icon": "orbit",
    "recharge": "LR",
    "max": (lv)=>lv,
    "pool": true
  }
]);
// [SheetRuntime] END
