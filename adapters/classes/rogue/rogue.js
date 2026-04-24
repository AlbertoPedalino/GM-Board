// Linguaggi standard XPHB (Thieves' Cant è automatico)
const _ROGUE_LANGUAGES = [
  'Common', 'Elvish', 'Dwarvish', 'Giant', 'Gnomish', 'Goblin',
  'Halfling', 'Orc', 'Draconic', 'Infernal', 'Celestial', 'Undercommon',
  'Abyssal', 'Sylvan', 'Deep Speech',
];

registerClassAdapter("Rogue", function (cls, lv, specs) {
  if (lv >= 1) {
    // Expertise (L1): 2 slot; uno può essere Thieves' Tools
    const expertiseFrom = typeof SKILLS !== 'undefined'
      ? SKILLS.map(function (s) { return s.n; }).concat(["Thieves' Tools"])
      : ["Thieves' Tools"];
    specs.push({
      key: 'rogue_expertise_1',
      label: 'Expertise 1 (Rogue)',
      type: 'expertise',
      from: expertiseFrom,
      count: 1,
      level: 1
    });
    specs.push({
      key: 'rogue_expertise_2',
      label: 'Expertise 2 (Rogue)',
      type: 'expertise',
      from: expertiseFrom,
      count: 1,
      level: 1
    });

    // Weapon Mastery: 2 armi con cui sei competente
    const weapons = typeof allItemsDb !== 'undefined'
      ? allItemsDb
          .filter(function (i) { return (i.type === 'M' || i.type === 'R') && (!i.rarity || i.rarity === 'none'); })
          .map(function (i) { return i.name; })
      : [];
    specs.push({
      key: 'rogue_weapon_mastery_1',
      label: 'Weapon Mastery 1',
      type: 'generic_choice',
      from: weapons,
      count: 1,
      level: 1
    });
    specs.push({
      key: 'rogue_weapon_mastery_2',
      label: 'Weapon Mastery 2',
      type: 'generic_choice',
      from: weapons,
      count: 1,
      level: 1
    });

    // Thieves' Cant: linguaggio bonus oltre al Gergo dei Ladri
    specs.push({
      key: 'rogue_thieves_cant_lang',
      label: "Bonus Language (Thieves' Cant)",
      type: 'language_choice',
      from: _ROGUE_LANGUAGES,
      count: 1,
      level: 1
    });
  }
  if (lv >= 6) {
    const expertiseFrom6 = typeof SKILLS !== 'undefined'
      ? SKILLS.map(function (s) { return s.n; }).concat(["Thieves' Tools"])
      : ["Thieves' Tools"];
    specs.push({
      key: 'rogue_expertise_3',
      label: 'Expertise 3 (Rogue)',
      type: 'expertise',
      from: expertiseFrom6,
      count: 1,
      level: 6
    });
    specs.push({
      key: 'rogue_expertise_4',
      label: 'Expertise 4 (Rogue)',
      type: 'expertise',
      from: expertiseFrom6,
      count: 1,
      level: 6
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'rogue_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Rogue", [
  {
    "name": "Sneak Attack",
    "icon": "",
    "cat": "attack",
    "uses": "1 / turn",
    "desc": "Once per turn, deal extra damage with a Finesse or ranged weapon if you have Advantage on the attack OR a conscious ally is within 5 ft of the target (you must not have Disadvantage). Dice: 1d6 at lv.1, +1d6 every 2 levels."
  },
  {
    "name": "Cunning Action",
    "icon": "",
    "cat": "bonus",
    "uses": "Unlimited",
    "minLevel": 2,
    "desc": "Bonus Action each turn: take the Dash, Disengage, or Hide action."
  },
  {
    "name": "Cunning Strike",
    "icon": "",
    "cat": "attack",
    "uses": "Sneak Attack die",
    "minLevel": 5,
    "desc": "When you deal Sneak Attack damage, you can forgo one Sneak Attack die to apply one Cunning Strike option: Disarm (DEX save or drops one item), Poison (CON save or Poisoned 1 min), Trip (DEX save or Prone), or Withdraw (your movement doesn't provoke OA this turn)."
  },
  {
    "name": "Evasion",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "DEX save: take no damage on success, half on failure. Doesn't work if Incapacitated."
  },
  {
    "name": "Reliable Talent",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 11,
    "desc": "When you make an ability check using a skill you are proficient in, treat a d20 roll of 9 or lower as a 10."
  },
  {
    "name": "Blindsense",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 ft of you."
  },
  {
    "name": "Slippery Mind",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "Proficiency in WIS and CHA saving throws."
  },
  {
    "name": "Stroke of Luck",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "minLevel": 20,
    "desc": "Once per Long Rest: turn a failed ability check into a success, or turn a miss into a hit."
  }
]);
// [SheetRuntime] END
