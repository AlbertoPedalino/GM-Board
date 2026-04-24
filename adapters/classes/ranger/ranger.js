registerClassAdapter("Ranger", function (cls, lv, specs) {
  if (lv >= 1) {
    // Weapon Mastery: scegli 2 armi con cui sei competente
    const weapons = typeof allItemsDb !== 'undefined'
      ? allItemsDb
          .filter(function (i) { return (i.type === 'M' || i.type === 'R') && (!i.rarity || i.rarity === 'none'); })
          .map(function (i) { return i.name; })
      : [];
    specs.push({
      key: 'ranger_weapon_mastery_1',
      label: 'Weapon Mastery 1',
      type: 'generic_choice',
      from: weapons,
      count: 1,
      level: 1
    });
    specs.push({
      key: 'ranger_weapon_mastery_2',
      label: 'Weapon Mastery 2',
      type: 'generic_choice',
      from: weapons,
      count: 1,
      level: 1
    });
  }
  if (lv >= 2) {
    // Deft Explorer: expertise in 1 skill
    specs.push({
      key: 'ranger_expertise_1',
      label: 'Expertise 1 (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 2
    });
    specs.push({
      key: 'ranger_fighting_style',
      label: 'Fighting Style',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 2
    });
  }
  if (lv >= 9) {
    specs.push({
      key: 'ranger_expertise_2',
      label: 'Expertise 2 (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 9
    });
    specs.push({
      key: 'ranger_expertise_3',
      label: 'Expertise 3 (Ranger)',
      type: 'expertise',
      from: [],
      count: 1,
      level: 9
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'ranger_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Ranger", [
  {
    "name": "Favored Enemy",
    "icon": "",
    "cat": "bonus",
    "uses": "Passive",
    "desc": "You always have Hunter's Mark prepared (doesn't count against spells known). You can cast it without expending a spell slot a number of times equal to your WIS modifier (min 1) per Long Rest."
  },
  {
    "name": "Hunter's Mark",
    "icon": "",
    "cat": "bonus",
    "uses": "WIS mod free / LR",
    "desc": "Bonus Action (Concentration): mark a creature you can see within 90 ft. +1d6 damage on every hit against it. Advantage on PER/Survival checks to find it. Can move the mark (Bonus Action) if the marked creature dies. At lv.17: no longer requires Concentration."
  },
  {
    "name": "Deft Explorer",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 2,
    "desc": "Expertise in one skill. Learn one language. At lv.6: learn a second language and gain a +10 ft Speed increase in one terrain type. At lv.10: Tireless—Exhaustion not granted from traveling; reduce Exhaustion after short rest."
  },
  {
    "name": "Roving",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "Your Speed increases by 10 ft. You gain Climb Speed and Swim Speed equal to your Speed."
  },
  {
    "name": "Extra Attack",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 5,
    "desc": "Attack twice when you take the Attack action."
  },
  {
    "name": "Evasion",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "DEX save: take no damage on success, half on failure. Doesn't work if you have the Incapacitated condition."
  },
  {
    "name": "Feral Senses",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 18,
    "desc": "No Disadvantage on attack rolls against creatures you can't see. You can hear invisible creatures in combat."
  }
]);
// [SheetRuntime] END
