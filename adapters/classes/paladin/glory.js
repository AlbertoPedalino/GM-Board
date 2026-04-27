registerSubclassAdapter("Paladin_Glory", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Glory", [
  {
    "name": "Channel: Peerless Athlete",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Action: for 10 minutes, you gain Proficiency Bonus to Athletics and Acrobatics checks, your carrying capacity and the weight you can push, drag, or lift doubles, and your jump distance triples."
  },
  {
    "name": "Channel: Inspiring Smite",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "minLevel": 3,
    "desc": "Immediately after dealing Divine Smite damage, use a Bonus Action (costs 1 Channel Divinity) to distribute Temporary HP equal to 2d8 + CHA modifier among yourself and any creatures within 30 ft (at least 1 HP per recipient)."
  },
  {
    "name": "Aura of Alacrity",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "Your Speed increases by your CHA modifier (min +1 ft). While conscious, friendly creatures who start their turn within your aura also gain the same Speed bonus for that turn. Range: 10 ft (30 ft at lv.18)."
  },
  {
    "name": "Glorious Defense",
    "icon": "",
    "cat": "reaction",
    "uses": "CHA mod / LR",
    "resKey": "glory_glorious_defense",
    "minLevel": 15,
    "desc": "Reaction when you or a creature within 10 ft is hit by an attack: add CHA modifier (min +1) to the target's AC for that attack. If it then misses, make one weapon attack against the attacker (if within range). Uses: CHA modifier per Long Rest."
  },
  {
    "name": "Living Legend",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / LR",
    "resKey": "glory_living_legend",
    "minLevel": 20,
    "desc": "Bonus Action (1 minute): use CHA instead of STR or DEX for attack and damage rolls. Once per turn, reroll a failed attack roll or saving throw and use the new result. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Paladin_Glory", [
  {
    "key": "glory_glorious_defense",
    "name": "Glorious Defense",
    "icon": "shield",
    "recharge": "LR",
    "max": () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('cha')) : 1)
  },
  {
    "key": "glory_living_legend",
    "name": "Living Legend",
    "icon": "crown",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
