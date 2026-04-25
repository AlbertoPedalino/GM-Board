registerClassAdapter("Paladin", function (cls, lv, specs) {
  if (lv >= 2) {
    specs.push({
      key: 'paladin_fighting_style',
      label: 'Fighting Style',
      type: 'feat_cat',
      categories: ['FS'],
      count: 1,
      level: 2
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'paladin_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Paladin", [
  {
    "name": "Divine Sense",
    "icon": "",
    "cat": "action",
    "uses": "CHA+1 / LR",
    "resKey": "divine_sense",
    "desc": "Action: for 10 minutes, detect the presence of any Aberration, Celestial, Fiend, Fiendish objects, Undead, or consecrated/desecrated ground within 60 ft. Uses = 1 + CHA modifier per Long Rest."
  },
  {
    "name": "Lay on Hands",
    "icon": "",
    "cat": "action",
    "uses": "Pool / LR",
    "resKey": "lay_on_hands",
    "desc": "Touch a creature to restore HP from your pool (1 HP per point spent), or spend 5 points to remove one disease or neutralize one poison. Pool = 5 × Paladin level. Recharge: Long Rest."
  },
  {
    "name": "Divine Smite",
    "icon": "",
    "cat": "reaction",
    "uses": "Spell slot",
    "minLevel": 1,
    "desc": "Reaction when you hit with a Melee weapon. Expend a spell slot: deal 2d8 Radiant damage (+1d8 per slot level above 1st, max 6d8). Critical hit: extra 1d8. Once per turn."
  },
  {
    "name": "Sacred Weapon",
    "icon": "",
    "cat": "bonus",
    "uses": "CHA mod+1 / LR",
    "resKey": "paladin_channel_div",
    "minLevel": 3,
    "desc": "Bonus Action: imbue a weapon with holy power for 1 minute. The weapon is magical, emits bright light (20 ft) and dim light (20 ft more), and you add your CHA modifier to attack rolls. Ends if you're Incapacitated."
  },
  {
    "name": "Channel Divinity",
    "icon": "",
    "cat": "action",
    "uses": "1-2 / SR",
    "resKey": "paladin_channel_div",
    "minLevel": 3,
    "desc": "Subclass-specific option (see your Oath). Uses: 1 (lv.3–10), 2 (lv.11+). Recharge: Short Rest."
  },
  {
    "name": "Aura of Protection",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "While conscious: you and friendly creatures within 10 ft gain +CHA modifier to saving throws (min +1). Range increases to 30 ft at lv.18."
  },
  {
    "name": "Aura of Courage",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "While conscious: friendly creatures within your aura can't have the Frightened condition."
  },
  {
    "name": "Radiant Strikes",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 11,
    "desc": "Your weapon and Unarmed Strike attacks deal an extra 1d8 Radiant damage."
  }
]);
registerClassSheetResources("Paladin", [
  {
    "key": "lay_on_hands",
    "name": "Lay on Hands",
    "icon": "hands",
    "recharge": "LR",
    "max": (lv)=>lv*5,
    "pool": true
  },
  {
    "key": "divine_sense",
    "name": "Divine Sense",
    "icon": "cross",
    "recharge": "LR",
    "max": ()=>Math.max(1,getMod(getFinal('cha')))+1
  },
  {
    "key": "paladin_channel_div",
    "name": "Channel Divinity",
    "icon": "sparkles",
    "recharge": "SR",
    "max": (lv)=>lv>=11?2:1
  }
]);
// [SheetRuntime] END
