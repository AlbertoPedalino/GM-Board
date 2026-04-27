registerSubclassAdapter("Paladin_Ancients", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Ancients", [
  {
    "name": "Channel: Nature's Wrath",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Action: conjure spectral vines. Each creature you choose within 10 ft must succeed on a STR or DEX save (their choice, spell save DC) or be Restrained. While Restrained, it repeats the save at the end of each of its turns, ending the effect on a success."
  },
  {
    "name": "Aura of Warding",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "While conscious, you and friendly creatures within your aura have Resistance to damage dealt by spells. Range: 10 ft (30 ft at lv.18)."
  },
  {
    "name": "Undying Sentinel",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "ancients_undying_sentinel",
    "minLevel": 15,
    "desc": "When you are reduced to 0 HP and not killed outright, drop to 1 HP instead. You also suffer no penalties from old age and cannot be magically aged. Recharge: Long Rest."
  },
  {
    "name": "Elder Champion",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "ancients_elder_champion",
    "minLevel": 20,
    "desc": "Action (Concentration, 1 minute): transform into an avatar of nature. Regain 10 HP at the start of each turn. Cast certain paladin spells as a Bonus Action. Fiends and Undead within 10 ft have Disadvantage on saves against your paladin spells and Channel Divinity. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Paladin_Ancients", [
  {
    "key": "ancients_undying_sentinel",
    "name": "Undying Sentinel",
    "icon": "shield",
    "recharge": "LR",
    "max": () => 1
  },
  {
    "key": "ancients_elder_champion",
    "name": "Elder Champion",
    "icon": "leaf",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
