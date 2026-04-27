registerSubclassAdapter("Paladin_Devotion", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Devotion", [
  {
    "name": "Channel: Sacred Weapon",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Action: for 1 minute, imbue your held weapon with divine energy. Add CHA modifier (min +1) to attack rolls. The weapon sheds bright light in a 20-ft radius and dim light 20 ft beyond. Ends if you're Incapacitated or sheathe/drop it."
  },
  {
    "name": "Aura of Devotion",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "While conscious, you and friendly creatures within your aura are immune to the Charmed condition. Range: 10 ft (30 ft at lv.18)."
  },
  {
    "name": "Smite of Protection",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "When you hit a creature with Divine Smite, you can also shield one creature of your choice within 30 ft: it gains a number of Temporary HP equal to your CHA modifier (min 1) for 1 minute."
  },
  {
    "name": "Holy Nimbus",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "devotion_holy_nimbus",
    "minLevel": 20,
    "damageFormula": "10",
    "damageButtonLabel": "10 radiant",
    "damageKind": "damage",
    "desc": "Action: emit an aura of sunlight for 1 minute (30-ft radius bright light + 30 ft dim). Enemies starting their turn in the aura take 10 Radiant damage. Advantage on saving throws against spells cast by Fiends and Undead. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Paladin_Devotion", [
  {
    "key": "devotion_holy_nimbus",
    "name": "Holy Nimbus",
    "icon": "sun",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
