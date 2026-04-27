registerSubclassAdapter("Monk_Elements", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Monk_Elements", [
  {
    "name": "Manipulate Elements",
    "icon": "",
    "cat": "action",
    "uses": "At will",
    "minLevel": 3,
    "desc": "You know the Elementalism cantrip. WIS is your spellcasting ability for it."
  },
  {
    "name": "Elemental Attunement",
    "icon": "",
    "cat": "action",
    "uses": "1 Focus Point",
    "resKey": "ki",
    "minLevel": 3,
    "desc": "Start of your turn: spend 1 Focus Point. For 10 minutes (or until Incapacitated) you gain — Reach: Unarmed Strike reach +10 ft; Elemental Strikes: when you hit with an Unarmed Strike, deal Acid/Cold/Fire/Lightning/Thunder instead of normal type, and force a STR save or move the target 10 ft toward or away from you."
  },
  {
    "name": "Elemental Burst",
    "icon": "",
    "cat": "attack",
    "uses": "1 Focus Point",
    "resKey": "ki",
    "minLevel": 6,
    "damageFormula": ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      const die = lv >= 17 ? 12 : lv >= 11 ? 10 : lv >= 5 ? 8 : 6;
      return `2d${die}`;
    },
    "damageButtonLabel": ({ formula }) => `${formula} elemental`,
    "damageKind": "damage",
    "desc": "Replace one attack in your Attack action: spend 1 Focus Point. Choose Acid/Cold/Fire/Lightning/Thunder. 20-ft cone or 30-ft line (5 ft wide) originating from you: DEX save (spell save DC), fail = 2 × Martial Arts die damage, success = half."
  },
  {
    "name": "Stride of the Elements",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 11,
    "desc": "While Elemental Attunement is active: gain Fly Speed and Swim Speed equal to your Speed."
  },
  {
    "name": "Elemental Epitome",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 17,
    "desc": "While Elemental Attunement is active: Damage Resistance — choose Acid/Cold/Fire/Lightning/Thunder resistance (can change each turn); Destructive Stride — Step of the Wind gives +20 Speed, creatures you pass within 5 ft take 1 Martial Arts die elemental damage (once per creature/turn); Empowered Strikes — once per turn, deal extra Martial Arts die elemental damage on an Unarmed Strike hit."
  }
]);
// [SheetRuntime] END
