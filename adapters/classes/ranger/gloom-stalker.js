registerSubclassAdapter("Ranger_Gloom Stalker", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Ranger_Gloom Stalker", [
  {
    "name": "Dread Ambusher",
    "icon": "",
    "cat": "attack",
    "uses": "1st turn",
    "minLevel": 3,
    "damageFormula": "1d8",
    "damageButtonLabel": ({ formula }) => `+${formula}`,
    "damageKind": "damage",
    "desc": "On your first turn of combat, your Speed increases by 10 ft. Make one additional weapon attack as part of the Attack action; on a hit, deal +1d8 damage. Add your WIS modifier to Initiative rolls."
  },
  {
    "name": "Umbral Sight",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Darkvision up to 60 ft (or +60 ft if you already have it). While in darkness, you are Invisible to any creature that relies on Darkvision to see you."
  },
  {
    "name": "Iron Mind",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "desc": "Proficiency in WIS saving throws. If you already have this proficiency, gain it in INT or CHA saving throws instead (your choice)."
  },
  {
    "name": "Stalker's Flurry",
    "icon": "",
    "cat": "attack",
    "uses": "1 / turn",
    "minLevel": 11,
    "desc": "Once per turn when you miss with a weapon attack during the Attack action, make one additional weapon attack as part of that same action."
  },
  {
    "name": "Shadowy Dodge",
    "icon": "",
    "cat": "reaction",
    "uses": "At will",
    "minLevel": 15,
    "desc": "Reaction when a creature makes an attack roll against you: impose Disadvantage on that roll."
  }
]);
// [SheetRuntime] END
