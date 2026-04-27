registerSubclassAdapter("Paladin_Vengeance", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Vengeance", [
  {
    "name": "Channel: Vow of Enmity",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Bonus Action: gain Advantage on all attack rolls against one visible creature within 10 ft for 1 minute or until it dies or falls Unconscious."
  },
  {
    "name": "Relentless Avenger",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "After hitting with an Opportunity Attack: immediately move up to half your Speed without provoking further Opportunity Attacks."
  },
  {
    "name": "Soul of Vengeance",
    "icon": "",
    "cat": "reaction",
    "uses": "At will",
    "minLevel": 15,
    "desc": "Reaction when the target of your Vow of Enmity makes an attack: immediately make one melee weapon attack against that creature."
  },
  {
    "name": "Avenging Angel",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / LR",
    "resKey": "vengeance_avenging_angel",
    "minLevel": 20,
    "desc": "Bonus Action: transform for 1 hour. Sprout wings (Fly Speed = 60 ft). Emit a 30-ft aura: enemies entering or starting their turn in the aura must succeed on a WIS save (spell save DC) or be Frightened for 1 minute (repeat save at end of each turn). Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Paladin_Vengeance", [
  {
    "key": "vengeance_avenging_angel",
    "name": "Avenging Angel",
    "icon": "feather",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
