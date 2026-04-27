registerSubclassAdapter("Monk_Mercy", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Monk_Mercy", [
  {
    "name": "Hand of Harm",
    "icon": "",
    "cat": "attack",
    "uses": "1 Discipline Point / turn",
    "resKey": "ki",
    "minLevel": 3,
    "damageFormula": ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      const die = lv >= 17 ? 12 : lv >= 11 ? 10 : lv >= 5 ? 8 : 6;
      return `1d${die}`;
    },
    "damageButtonLabel": ({ formula }) => `+${formula} necrotic`,
    "damageKind": "damage",
    "desc": "Once per turn when you hit with an Unarmed Strike, spend 1 Discipline Point to deal extra Necrotic damage equal to one Martial Arts die + WIS modifier."
  },
  {
    "name": "Hand of Healing",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Discipline Point",
    "resKey": "ki",
    "minLevel": 3,
    "desc": "Bonus Action (or substitute within Flurry of Blows at no extra cost): touch a creature to restore HP equal to one Martial Arts die + WIS modifier."
  },
  {
    "name": "Physician's Touch",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "Hand of Harm can also inflict Blinded, Deafened, or Poisoned (1 turn). Hand of Healing can also end one of: Blinded, Deafened, Paralyzed, Poisoned, or Stunned."
  },
  {
    "name": "Flurry of Healing and Harm",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Discipline Point",
    "resKey": "ki",
    "minLevel": 11,
    "desc": "When you use Flurry of Blows, replace any of its Unarmed Strikes with Hand of Healing or Hand of Harm uses at no additional Discipline Point cost."
  },
  {
    "name": "Hand of Ultimate Mercy",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "mercy_ultimate",
    "minLevel": 17,
    "desc": "Action: spend 5 Discipline Points and touch a creature that has died within the past 24 hours. It returns to life with HP equal to 4d10 + WIS modifier, and all conditions afflicting it when it died end. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Monk_Mercy", [
  {
    "key": "mercy_ultimate",
    "name": "Hand of Ultimate Mercy",
    "icon": "heart",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
