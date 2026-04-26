registerClassAdapter("Barbarian", function (cls, lv, specs) {
  if (lv >= 1) {
    const weapons = typeof allItemsDb !== 'undefined'
      ? allItemsDb
          .filter(function (i) { return (i.type === 'M' || i.type === 'R') && (!i.rarity || i.rarity === 'none'); })
          .map(function (i) { return i.name; })
      : [];
    specs.push({
      key: 'barbarian_weapon_mastery',
      label: 'Weapon Mastery (choose 2)',
      type: 'generic_choice',
      from: weapons,
      count: 2,
      level: 1
    });
  }
  if (lv >= 3) {
    const allSkills = typeof SKILLS !== 'undefined'
      ? SKILLS.map(function (s) { return s.n; })
      : ['Acrobatics','Animal Handling','Arcana','Athletics','Perception',
         'Sleight of Hand','Stealth','Investigation','Deception','Insight',
         'Intimidation','Medicine','Nature','History','Performance',
         'Persuasion','Religion','Survival'];
    specs.push({
      key: 'barbarian_primal_knowledge',
      label: 'Primal Knowledge (Extra Skill)',
      type: 'skill_choice',
      from: allSkills,
      count: 1,
      level: 3
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'barbarian_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Barbarian", [
  {
    "name": "Rage",
    "icon": "",
    "cat": "bonus",
    "uses": "2+ / LR (+1 SR)",
    "resKey": "rage",
    "desc": "Bonus Action. Enter Rage for 1 minute: +2 damage on attacks (→+3 lv.9, →+4 lv.16), resistance to Bludgeoning/Piercing/Slashing, advantage on STR checks and saves. Uses: 2 (lv.1), 3 (lv.3), 4 (lv.6), 5 (lv.12), 6 (lv.17), unlimited (lv.20). Recharge: Long Rest; recover 1 expended use on a Short Rest."
  },
  {
    "name": "Reckless Attack",
    "icon": "",
    "cat": "attack",
    "uses": "Unlimited",
    "desc": "When you make your first attack on your turn, gain advantage on all weapon attack rolls using STR this turn. Enemies gain advantage on attack rolls against you until the start of your next turn."
  },
  {
    "name": "Danger Sense",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 2,
    "desc": "You have advantage on DEX saving throws against effects you can see. You can't be surprised while you are conscious."
  },
  {
    "name": "Fast Movement",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 5,
    "desc": "Your Speed increases by 10 ft while you aren't wearing Heavy Armor."
  },
  {
    "name": "Feral Instinct",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "Advantage on Initiative rolls. If you are surprised at the start of combat, you can act normally on your first turn as long as you enter your Rage before doing anything else."
  },
  {
    "name": "Brutal Strike",
    "icon": "",
    "cat": "attack",
    "uses": "While Raging",
    "minLevel": 9,
    "damageFormula": "1d10",
    "damageButtonLabel": "+1d10",
    "desc": "When you use Reckless Attack and have advantage, forgo the advantage on one attack to deal +1d10 damage and trigger a Brutal Strike effect: Forceful Blow (push 15 ft or knock Prone) or Hamstring Blow (target's Speed halved until start of your next turn)."
  },
  {
    "name": "Relentless Rage",
    "icon": "",
    "cat": "reaction",
    "uses": "DC 10+ CON",
    "minLevel": 11,
    "desc": "When you are reduced to 0 HP while Raging and don't die outright, you can make a DC 10 CON save to drop to 1 HP instead. Each time you use this feature the DC increases by 5, resetting on a Long Rest."
  },
  {
    "name": "Persistent Rage",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "Your Rage only ends early if you fall unconscious or choose to end it. No longer ends from not attacking or taking damage."
  },
  {
    "name": "Indomitable Might",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 18,
    "desc": "If your total for a STR check is lower than your STR score, use your STR score in its place."
  }
]);
registerClassSheetResources("Barbarian", [
  {
    "key": "rage",
    "name": "Rage",
    "icon": "angry",
    "recharge": "LR",
    "max": (lv)=>lv>=20?Infinity:lv>=17?6:lv>=12?5:lv>=6?4:lv>=3?3:2,
    "srRecover": 1
  }
]);
// [SheetRuntime] END
