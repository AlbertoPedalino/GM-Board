registerSubclassAdapter("Paladin_Noble Genies", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_noble_genies_skill',
      label: "Genie's Splendor — Skill Proficiency",
      type: 'skill_choice',
      from: ['Acrobatics', 'Intimidation', 'Performance', 'Persuasion'],
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Noble Genies", [
  {
    "name": "Genie's Splendor",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: while you aren't wearing armor, your AC equals 10 + DEX modifier + CHA modifier (shield still applies). You gain proficiency in one skill of your choice from Acrobatics, Intimidation, Performance, or Persuasion."
  },
  {
    "name": "Channel: Elemental Smite",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "minLevel": 3,
    "desc": "Immediately after you deal Divine Smite damage, expend one use of Channel Divinity to choose one effect: Dao's Crush — the target is Grappled (escape DC = spell save DC) and Restrained while Grappled. Djinni's Escape — you teleport up to 30 ft to an unoccupied space you can see; until end of your next turn you are semi-incorporeal (Resistance to Bludgeoning/Piercing/Slashing; immune to Grappled/Prone/Restrained). Efreeti's Fury — deal an extra 2d4 Fire damage to the target, and deal 2d4 Fire damage to one creature of your choice within 30 ft of the target. Marid's Surge — each creature within a 10-ft Emanation of the target must succeed on a STR saving throw (spell save DC) or be pushed up to 15 ft from the target and knocked Prone."
  },
  {
    "name": "Aura of Elemental Shielding",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "Passive: at the start of each of your turns (no action required), choose one damage type: Acid, Cold, Fire, Lightning, or Thunder. You and friendly creatures within your Aura of Protection gain Resistance to that damage type until the start of your next turn."
  },
  {
    "name": "Elemental Rebuke",
    "icon": "",
    "cat": "reaction",
    "uses": "CHA mod / LR",
    "resKey": "noble_genies_rebuke",
    "minLevel": 15,
    "damageFormula": "2d10",
    "damageButtonLabel": ({ formula }) => `${formula} + CHA elemental`,
    "damageKind": "damage",
    "desc": "Reaction when you are hit by an attack: halve the damage you take (round down). The attacker must then make a DEX saving throw (spell save DC). On a failed save, the attacker takes 2d10 + CHA modifier elemental damage (Acid, Cold, Fire, Lightning, or Thunder — your choice); on a success, it takes half that damage. Uses: CHA modifier (min 1) per Long Rest."
  },
  {
    "name": "Noble Scion",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / LR",
    "resKey": "noble_genies_scion",
    "minLevel": 20,
    "desc": "Bonus Action: for 10 minutes (or until you use this feature again), assume the form of a Noble Genie. 1/LR, or expend a level 5+ spell slot. Benefits: Flight — you gain a Fly Speed of 60 ft with the Hover property. Minor Wish — when you or a creature within your Aura of Protection fails a D20 Test, you can use your Reaction to cause the roll to succeed instead."
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
