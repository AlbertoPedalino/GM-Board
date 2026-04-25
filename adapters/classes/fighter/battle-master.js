const _BM_MANEUVERS = [
  'Ambush', 'Bait and Switch', "Commander's Strike", 'Commanding Presence',
  'Disarming Attack', 'Distracting Strike', 'Evasive Footwork', 'Feinting Attack',
  'Goading Attack', 'Lunging Attack', 'Maneuvering Attack', 'Menacing Attack',
  'Parry', 'Precision Attack', 'Pushing Attack', 'Rally', 'Riposte',
  'Sweeping Attack', 'Tactical Assessment', 'Trip Attack',
];

const _BM_ARTISAN_TOOLS = [
  "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies",
  "Carpenter's Tools", "Cartographer's Tools", "Cobbler's Tools",
  "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools",
  "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies",
  "Potter's Tools", "Smith's Tools", "Tinker's Tools",
  "Weaver's Tools", "Woodcarver's Tools",
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
      from: _BM_ARTISAN_TOOLS,
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
    "uses": "Superiority Dice d8",
    "resKey": "superiority_dice",
    "desc": "Spend a Superiority Die (d8 to d10 to d12) to add effects to attacks: Disarm, Push, Distract, Command, Taunt, Riposte, Feint, Precision Attack, etc. Recharge: short or long rest."
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
