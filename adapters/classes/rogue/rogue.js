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
      type: 'generic_choice',
      from: _ROGUE_LANGUAGES,
      count: 1,
      level: 1
    });
  }
  if (lv >= 6) {
    const expertiseFrom6 = [];
    specs.push({
      key: 'rogue_expertise_3',
      label: 'Expertise Lv6 (Rogue)',
      type: 'expertise',
      from: expertiseFrom6,
      count: 1,
      level: 6
    });
    specs.push({
      key: 'rogue_expertise_4',
      label: 'Expertise Lv6 (Rogue)',
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
