const _BM_MANEUVERS = [
  'Ambush', 'Bait and Switch', "Commander's Strike", 'Commanding Presence',
  'Disarming Attack', 'Distracting Strike', 'Evasive Footwork', 'Feinting Attack',
  'Goading Attack', 'Lunging Attack', 'Maneuvering Attack', 'Menacing Attack',
  'Parry', 'Precision Attack', 'Pushing Attack', 'Rally',
];


const _BM_STUDENT_SKILLS = [
  'Acrobatics', 'Animal Handling', 'Athletics', 'Insight',
  'Intimidation', 'Perception', 'Survival',
];

// +3 a L3, +2 a L7, +2 a L10, +2 a L15 (totale max 9)
const _BM_SLOTS = [
  { idx: 1, level: 3 }, { idx: 2, level: 3 }, { idx: 3, level: 3 },
  { idx: 4, level: 7 }, { idx: 5, level: 7 },
  { idx: 6, level: 10 }, { idx: 7, level: 10 },
  { idx: 8, level: 15 }, { idx: 9, level: 15 },
];

registerSubclassAdapter("Fighter_Battle Master", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_bm_student_tool',
      label: "Student of War — Artisan's Tool",
      type: 'generic_choice',
      from: window._ARTISAN_TOOLS || [],
      count: 1,
      level: 3
    });
    specs.push({
      key: 'subclass_bm_student_skill',
      label: "Student of War — Skill Proficiency",
      type: 'skill_choice',
      from: _BM_STUDENT_SKILLS,
      count: 1,
      level: 3
    });
  }
  _BM_SLOTS.forEach(function (slot) {
    if (lv >= slot.level) {
      specs.push({
        key: 'subclass_bm_maneuver_' + slot.idx,
        label: 'Battle Maneuver ' + slot.idx,
        type: 'generic_choice',
        from: _BM_MANEUVERS,
        count: 1,
        level: slot.level
      });
    }
  });
});

// [SheetRuntime] START
registerSubclassSheetActions("Fighter_Battle Master", [
  {
    "name": "Combat Maneuvers",
    "icon": "",
    "cat": "attack",
    "uses": "Superiority Dice",
    "resKey": "superiority_dice",
    "minLevel": 3,
    "desc": "Spend Superiority Dice (d8 at lv.3, d10 at lv.7, d12 at lv.18) to enhance attacks. Maneuvers chosen at character creation from the full list. Save DC = 8 + PB + STR or DEX (highest). Recharge: Short or Long Rest."
  },
  {
    "name": "Know Your Enemy",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / LR",
    "resKey": "know_your_enemy",
    "minLevel": 7,
    "desc": "Bonus Action: choose a creature within 30 ft you can see. Learn its Immunities, Resistances, and Vulnerabilities. Recharge: Long Rest (or expend one Superiority Die to restore the use, no action required)."
  },
  {
    "name": "Relentless",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "Passive: when you roll Initiative and have no Superiority Dice remaining, you regain 1 Superiority Die."
  },
  {
    "name": "Ultimate Combat Superiority",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 18,
    "desc": "Your Superiority Die becomes a d12."
  }
]);
registerSubclassSheetResources("Fighter_Battle Master", [
  {
    "key": "superiority_dice",
    "name": "Superiority Dice",
    "actionName": "Combat Maneuvers",
    "icon": "swords",
    "recharge": "SR",
    "max": (lv)=>lv>=15?6:lv>=7?5:4,
    "die": (lv)=>lv>=18?"d12":lv>=7?"d10":"d8",
    "pool": true
  },
  {
    "key": "know_your_enemy",
    "name": "Know Your Enemy",
    "icon": "eye",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
