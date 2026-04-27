const _BM_MANEUVERS = [
  'Ambush', 'Bait and Switch', "Commander's Strike", 'Commanding Presence',
  'Disarming Attack', 'Distracting Strike', 'Evasive Footwork', 'Feinting Attack',
  'Goading Attack', 'Lunging Attack', 'Maneuvering Attack', 'Menacing Attack',
  'Parry', 'Precision Attack', 'Pushing Attack', 'Rally', 'Riposte',
  'Sweeping Attack', 'Tactical Assessment', 'Trip Attack',
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
    "desc": "Spend Superiority Dice (d8 at lv.3, d10 at lv.7, d12 at lv.15) to enhance attacks. Maneuvers chosen at character creation from the full list. Save DC = 8 + PB + STR or DEX (highest). Recharge: Short or Long Rest."
  },
  {
    "name": "Know Your Enemy",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "Passive: if you spend at least 1 minute observing or interacting with a creature outside combat, the DM tells you how that creature compares to you in two of the following: STR, DEX, CON, AC, current HP, total class levels, Fighter levels."
  },
  {
    "name": "Relentless",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "Passive: if you have no Superiority Dice remaining at the start of your turn, you regain 1 Superiority Die."
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
    "pool": true
  }
]);
// [SheetRuntime] END
