registerSubclassAdapter("Paladin_Noble Genies", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_noble_genies_kind',
      label: 'Genie Kind',
      type: 'generic_choice',
      from: ['Dao (Earth/Bludgeoning)', 'Djinni (Air/Thunder)', 'Efreeti (Fire/Fire)', 'Marid (Water/Cold)'],
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Noble Genies", [
  {
    "name": "Channel: Genie's Flight",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "minLevel": 3,
    "desc": "Action: you and allies within 30 ft gain a Fly Speed equal to your walking Speed for 1 minute."
  },
  {
    "name": "Aura of Elemental Shielding",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "While conscious: you and friendly creatures within your aura gain Resistance to one damage type associated with your Genie Kind (Dao: Bludgeoning, Djinni: Thunder, Efreeti: Fire, Marid: Cold). Range: 10 ft (30 ft at lv.18)."
  },
  {
    "name": "Elemental Rebuke",
    "icon": "",
    "cat": "reaction",
    "uses": "CHA mod / LR",
    "resKey": "noble_genies_rebuke",
    "minLevel": 15,
    "damageFormula": "4d8",
    "damageButtonLabel": "4d8 elemental",
    "damageKind": "damage",
    "desc": "Reaction when a creature within 30 ft hits you with an attack: deal 4d8 elemental damage of your Genie Kind's type to the attacker. Uses = CHA modifier per Long Rest."
  },
  {
    "name": "Noble Scion",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / LR",
    "resKey": "noble_genies_scion",
    "minLevel": 20,
    "desc": "Bonus Action: for 1 minute, assume the form of a Noble Genie. Gain Fly Speed 60 ft. When you hit with a weapon attack, deal extra elemental damage (your Genie Kind's type) equal to your CHA modifier. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Paladin_Noble Genies", [
  {
    "key": "noble_genies_rebuke",
    "name": "Elemental Rebuke",
    "icon": "zap",
    "recharge": "LR",
    "minLevel": 15,
    "max": () => typeof getMod === 'function' && typeof getFinal === 'function' ? Math.max(1, getMod(getFinal('cha'))) : 1
  },
  {
    "key": "noble_genies_scion",
    "name": "Noble Scion",
    "icon": "crown",
    "recharge": "LR",
    "minLevel": 20,
    "max": () => 1
  }
]);
// [SheetRuntime] END
