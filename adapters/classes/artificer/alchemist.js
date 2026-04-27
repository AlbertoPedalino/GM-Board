registerSubclassAdapter("Artificer_Alchemist", function (cls, lv, specs) {
  if (lv < 3) return;
  const bonusCount = typeof _artificerGetConditionalBonusCount === 'function'
    ? _artificerGetConditionalBonusCount(["Alchemist's Supplies", 'Herbalism Kit'])
    : 0;
  if (!bonusCount) return;
  specs.push({
    key: 'alchemist_bonus_tool',
    label: 'Alchemist - Bonus Artisan Tool',
    type: 'generic_choice',
    from: _ARTISAN_TOOLS,
    count: bonusCount,
    level: 3
  });
});

// [SheetRuntime] START
registerSubclassSheetActions("Artificer_Alchemist", [
  {
    "name": "Experimental Elixir",
    "icon": "",
    "cat": "action",
    "uses": "After Long Rest",
    "minLevel": 3,
    "desc": "After a Long Rest, create a number of experimental elixirs (1 at lv.3, +1 at lv.6/lv.15) using Alchemist's Supplies. Each elixir has a random or chosen effect: Healing (2d4+INT HP), Swiftness (+10 ft speed 1 hr), Resilience (resistance to one damage type 10 min), Boldness (Frightened immunity + Frightened ends), Flight (fly speed 10 ft 10 min), Transformation (Alter Self 10 min). You can also create extra elixirs by expending spell slots (1 per slot level)."
  },
  {
    "name": "Alchemical Savant",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 5,
    "desc": "Passive: when you cast an Artificer spell using Alchemist's Supplies as the spellcasting focus, add your INT modifier (min +1) to one damage or healing roll of the spell. The roll must deal acid, fire, necrotic, or poison damage — or restore hit points."
  },
  {
    "name": "Restorative Reagents",
    "icon": "",
    "cat": "action",
    "uses": "INT mod / LR",
    "resKey": "restorative_reagents",
    "minLevel": 9,
    "desc": "You gain Advantage on saving throws against being Poisoned and Resistance to Poison damage. Additionally, you can cast Lesser Restoration without expending a spell slot (using Alchemist's Supplies as material components). You can do so a number of times equal to your INT modifier (min 1). Recharge: Long Rest."
  },
  {
    "name": "Chemical Mastery",
    "icon": "",
    "cat": "action",
    "uses": "1 each / LR",
    "resKey": "chemical_mastery",
    "minLevel": 15,
    "desc": "Passive: you gain Immunity to Poison damage and the Poisoned condition, and Immunity to disease. Once per Long Rest each (no spell slot, no components): cast Greater Restoration or Heal using INT as the spellcasting ability. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Artificer_Alchemist", [
  {
    "key": "restorative_reagents",
    "name": "Restorative Reagents",
    "icon": "flask-conical",
    "recharge": "LR",
    "max": () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('int')) : 1)
  },
  {
    "key": "chemical_mastery",
    "name": "Chemical Mastery",
    "icon": "sparkles",
    "recharge": "LR",
    "max": () => 2
  }
]);
registerSubclassSheetProficiencies("Artificer_Alchemist", [
  { type: "tool", values: ["Alchemist's Supplies", "Herbalism Kit"], minLevel: 3 }
]);
// [SheetRuntime] END
