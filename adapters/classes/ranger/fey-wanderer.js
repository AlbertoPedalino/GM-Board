registerSubclassAdapter("Ranger_Fey Wanderer", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Ranger_Fey Wanderer", [
  {
    "name": "Dreadful Strikes",
    "icon": "",
    "cat": "attack",
    "uses": "1 / turn",
    "minLevel": 3,
    "damageFormula": ({ ownerLevel }) => Number(ownerLevel || 1) >= 11 ? "1d6" : "1d4",
    "damageButtonLabel": ({ formula }) => `+${formula} psychic`,
    "damageKind": "damage",
    "desc": "Once per turn when you hit with a weapon: deal extra Psychic damage (1d4; 1d6 at lv.11)."
  },
  {
    "name": "Otherworldly Glamour",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Add your WIS modifier to any CHA ability check (min +1). Gain proficiency in Deception, Performance, or Persuasion (your choice)."
  },
  {
    "name": "Beguiling Twist",
    "icon": "",
    "cat": "reaction",
    "uses": "1 / LR",
    "resKey": "fey_beguiling_twist",
    "minLevel": 7,
    "desc": "You have Advantage on saving throws against the Charmed and Frightened conditions. Also, as a Reaction when a creature within 120 ft that you can see succeeds on a save against Charmed or Frightened: redirect that effect to another creature within 30 ft of the first (WIS save, spell save DC, Charmed or Frightened for 1 minute). Recharge: Long Rest."
  },
  {
    "name": "Fey Reinforcements",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "fey_reinforcements",
    "minLevel": 11,
    "desc": "Action (Concentration, 1 hour): summon a spirit in the form of a Dryad, Pixie, or Sprite. It obeys your commands and uses your spell save DC. Recharge: Long Rest (or cast Summon Fey with a spell slot)."
  },
  {
    "name": "Misty Wanderer",
    "icon": "",
    "cat": "bonus",
    "uses": "WIS mod / LR",
    "resKey": "fey_misty_wanderer",
    "minLevel": 15,
    "desc": "Can cast Misty Step without expending a spell slot. When you do, bring one willing creature within 5 ft along with you. Uses: WIS modifier (min 1) per Long Rest."
  }
]);
registerSubclassSheetResources("Ranger_Fey Wanderer", [
  {
    "key": "fey_beguiling_twist",
    "name": "Beguiling Twist",
    "icon": "wind",
    "recharge": "LR",
    "max": () => 1
  },
  {
    "key": "fey_reinforcements",
    "name": "Fey Reinforcements",
    "icon": "star",
    "recharge": "LR",
    "max": () => 1
  },
  {
    "key": "fey_misty_wanderer",
    "name": "Misty Wanderer",
    "icon": "cloud",
    "recharge": "LR",
    "max": () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('wis')) : 1)
  }
]);
// [SheetRuntime] END
