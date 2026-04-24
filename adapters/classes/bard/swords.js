registerSubclassAdapter("Bard_Swords", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_swords_fighting_style',
      label: 'Fighting Style (College of Swords)',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 3
    });
  }
});

registerSubclassSheetActions("Bard_Swords", [
  { name: "Blade Flourish",    icon: "", cat: "attack", uses: "Per attack action", minLevel: 3,
    desc: "When you take the Attack action, your walking speed increases by 10 ft. If a weapon attack hits, choose one option: Defensive Flourish (spend 1 Bardic Inspiration die, add roll to AC until your next turn and to damage), Slashing Flourish (spend 1 die, deal extra damage to another creature within 5 ft), or Mobile Flourish (spend 1 die, push target 5+die ft, then move toward them without OA)." },
  { name: "Extra Attack",      icon: "", cat: "attack", uses: "Passive",          minLevel: 6,
    desc: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
  { name: "Master's Flourish", icon: "", cat: "attack", uses: "Passive",          minLevel: 14,
    desc: "When you use a Blade Flourish option, you can roll a d6 and use it instead of expending a Bardic Inspiration die." },
]);
