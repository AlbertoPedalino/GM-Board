registerSubclassAdapter("Monk_Elements", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Monk_Elements", [
  {
    "name": "Elemental Attunement",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "You learn the Elementalism cantrip. Additionally, the reach of your Unarmed Strikes increases by 5 ft."
  },
  {
    "name": "Elemental Disciplines",
    "icon": "",
    "cat": "action",
    "uses": "1+ Discipline Points",
    "resKey": "ki",
    "minLevel": 3,
    "desc": "Spend Discipline Points to unleash elemental forces. Examples: Fangs of the Fire Snake (1 DP, reach +10 ft + 1d10 fire on hit), Fist of Four Thunders (2 DP, Thunderwave), Fist of Unbroken Air (2 DP, ranged 30 ft push + 3d10 bludgeoning), Gong of the Summit (3 DP, Shatter), Clench of the North Wind (3 DP, Hold Person), Ride the Wind (4 DP, Fly on self), River of Hungry Flame (5 DP, Wall of Fire). More disciplines unlock at higher levels."
  },
  {
    "name": "Stride of the Elements",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "You gain Fly Speed and Swim Speed equal to your Speed."
  },
  {
    "name": "Elemental Fury",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 11,
    "desc": "Once per turn when you hit with an Unarmed Strike, choose: deal extra 1d10 Cold, Fire, Lightning, or Acid damage, OR force a STR save (spell save DC) or push the target 15 ft."
  },
  {
    "name": "Breath of Winter",
    "icon": "",
    "cat": "action",
    "uses": "6 Discipline Points",
    "resKey": "ki",
    "minLevel": 17,
    "desc": "Spend 6 Discipline Points to cast Cone of Cold."
  }
]);
// [SheetRuntime] END
