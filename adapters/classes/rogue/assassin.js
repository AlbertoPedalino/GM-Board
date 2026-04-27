registerSubclassAdapter("Rogue_Assassin", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Rogue_Assassin", [
  {
    "name": "Assassinate",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: you have Advantage on attack rolls against any creature that hasn't taken a turn yet. If you hit a creature that is surprised, the hit is a Critical Hit."
  },
  {
    "name": "Infiltration Expertise",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 9,
    "desc": "Passive: spend 7 days and 25 gp to establish a false identity (documents, history, contacts). If this identity is investigated, it appears legitimate unless the investigation succeeds against your DC (8 + PB + CHA)."
  },
  {
    "name": "Envenom Weapons",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / SR",
    "resKey": "envenom",
    "minLevel": 13,
    "damageFormula": "2d8",
    "damageButtonLabel": ({ formula }) => `${formula} poison`,
    "damageKind": "damage",
    "desc": "Bonus Action: apply a lethal poison from your Poisoner's Kit to a weapon or piece of ammunition. The next time you hit a creature with that weapon/ammo, the target takes an extra 2d8 Poison damage and must succeed on a CON save (DC = 8 + PB + DEX) or be Poisoned until the end of your next turn. Recharge: Short Rest."
  },
  {
    "name": "Death Strike",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 17,
    "desc": "Passive: when you hit a surprised creature with an attack during the first round of combat, that creature must make a CON save (DC = 8 + PB + DEX). On failure, the attack deals double damage."
  }
]);
registerSubclassSheetResources("Rogue_Assassin", [
  {
    "key": "envenom",
    "name": "Envenom Weapons",
    "icon": "droplets",
    "recharge": "SR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
