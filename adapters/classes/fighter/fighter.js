registerClassAdapter("Fighter", function (cls, lv, specs) {
  if (lv >= 1) {
    const weapons = typeof allItemsDb !== 'undefined'
      ? allItemsDb
          .filter(i => (i.type === 'M' || i.type === 'R') && (!i.rarity || i.rarity === 'none'))
          .map(i => i.name)
      : [];
    specs.push({
      key: 'fighter_weapon_mastery',
      label: 'Weapon Mastery (choose 3)',
      type: 'generic_choice',
      from: weapons,
      count: 3,
      level: 1
    });
    specs.push({
      key: 'fighter_fighting_style',
      label: 'Fighting Style',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 1
    });
  }
  if (lv >= 19) {
    specs.push({
      key: 'fighter_epic_boon',
      label: 'Epic Boon',
      type: 'feat_cat',
      categories: ['EB'],
      count: 1,
      level: 19
    });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Fighter", [
  {
    name: 'Second Wind',
    icon: '',
    cat: 'bonus',
    uses: '1-3 / SR',
    resKey: 'second_wind',
    healFormula: ({ ownerLevel }) => {
      const lvNum = Number(ownerLevel || 1);
      return `1d10${lvNum >= 0 ? '+' : ''}${lvNum}`;
    },
    damageKind: 'heal',
    damageButtonLabel: ({ formula }) => `Heal ${String(formula || '')}`,
    rollLabelPrefix: 'Heal',
    desc: 'Bonus Action: regain 1d10 + Fighter level HP. Uses: 2 (lv.1), 3 (lv.4), 4 (lv.10). Recharge: Short or Long Rest.'
  },
  {
    name: 'Action Surge',
    icon: '',
    cat: 'action',
    uses: '1-2 / SR',
    resKey: 'action_surge',
    minLevel: 2,
    desc: 'Take one additional action on your turn. Uses: 1 (lv.2-16), 2 (lv.17+). Recharge: Short or Long Rest.'
  },
  {
    name: 'Tactical Mind',
    icon: '',
    cat: 'reaction',
    uses: 'Second Wind',
    minLevel: 2,
    damageFormula: '1d10',
    damageKind: 'utility',
    damageButtonLabel: '+1d10',
    rollLabelPrefix: 'Roll',
    desc: 'When you fail an ability check, you can expend a use of Second Wind (as a Reaction) to add 1d10 to the check result, possibly changing the outcome.'
  },
  {
    name: 'Extra Attack',
    icon: '',
    cat: 'attack',
    uses: 'Passive',
    minLevel: 5,
    desc: 'Attack twice when you take the Attack action (lv.5). Three times at lv.11. Four times at lv.20.'
  },
  {
    name: 'Tactical Master',
    icon: '',
    cat: 'attack',
    uses: 'Passive',
    minLevel: 9,
    desc: 'Passive: when you attack with a weapon whose Mastery property you can use, you can replace that Mastery property with Push, Sap, or Slow for that attack only.'
  },
  {
    name: 'Studied Attacks',
    icon: '',
    cat: 'attack',
    uses: 'Passive',
    minLevel: 13,
    desc: 'Passive: when you miss with an attack roll using a weapon, you gain Advantage on your next attack roll against the same target before the end of your next turn.'
  },
  {
    name: 'Indomitable',
    icon: '',
    cat: 'reaction',
    uses: '1-3 / LR',
    resKey: 'indomitable',
    minLevel: 9,
    desc: 'When you fail a saving throw, you can reroll it, adding your Fighter level to the result, and must use the new result. Uses: 1 (lv.9-12), 2 (lv.13-16), 3 (lv.17+). Recharge: Long Rest.'
  },
  {
    name: 'Tactical Shift',
    icon: '',
    cat: 'bonus',
    uses: 'On Second Wind',
    minLevel: 5,
    desc: "When you use Second Wind, you can move up to half your Speed without provoking Opportunity Attacks."
  }
]);
registerClassSheetResources("Fighter", [
  {
    key: 'second_wind',
    name: 'Second Wind',
    icon: 'wind',
    recharge: 'SR',
    max: (lv)=>lv>=10?4:lv>=4?3:2
  },
  {
    key: 'action_surge',
    name: 'Action Surge',
    icon: 'zap',
    recharge: 'SR',
    max: (lv)=>lv>=17?2:1
  },
  {
    key: 'indomitable',
    name: 'Indomitable',
    icon: 'shield',
    recharge: 'LR',
    max: (lv)=>lv>=17?3:lv>=13?2:1
  }
]);
// [SheetRuntime] END