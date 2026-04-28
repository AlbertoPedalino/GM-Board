registerSubclassAdapter("Fighter_Champion", function (cls, lv, specs) {
  if (lv >= 7) {
    specs.push({
      key: 'subclass_champion_extra_fs',
      label: 'Extra Fighting Style (Champion)',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 7
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Fighter_Champion", [
  { name: "Improved Critical", icon: "", cat: "attack", uses: "Passive", minLevel: 3,
    desc: "Your weapon attacks and Unarmed Strikes score a Critical Hit on a roll of 19 or 20. At level 15 (Superior Critical), the range becomes 18–20." },
  { name: "Remarkable Athlete", icon: "", cat: "action", uses: "Passive", minLevel: 3,
    desc: "Advantage on Initiative rolls and STR (Athletics) checks. Immediately after you score a Critical Hit, you can move up to half your Speed without provoking Opportunity Attacks." },
  { name: "Heroic Warrior", icon: "", cat: "action", uses: "Passive", minLevel: 10,
    desc: "During combat, you can give yourself Heroic Inspiration whenever you start your turn without it." },
  { name: "Survivor", icon: "", cat: "action", uses: "Passive", minLevel: 18,
    desc: "Two benefits — Defy Death: Advantage on Death Saving Throws; rolling 18–20 on a Death Save counts as rolling a 20. Heroic Rally: at the start of each of your turns, regain HP equal to 5 + your CON modifier if you are Bloodied and have at least 1 HP." },
]);
// [SheetRuntime] END
