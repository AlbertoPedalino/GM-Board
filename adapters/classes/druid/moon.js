registerSubclassAdapter("Druid_Moon", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Druid_Moon", [
  {
    "name": "Circle Forms",
    "icon": "",
    "cat": "bonus",
    "uses": "Wild Shape charge",
    "resKey": "wild_shape",
    "minLevel": 3,
    "desc": "When you assume a Wild Shape form: the maximum CR for the form equals your Druid level divided by 3 (round down). While in the form, your AC equals 13 + your WIS modifier if that total is higher than the Beast's AC. You gain Temporary HP equal to three times your Druid level."
  },
  {
    "name": "Improved Circle Forms",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "While in a Wild Shape form: each of your attacks can deal its normal damage type or Radiant damage (your choice each time you hit). You can add your WIS modifier to your CON saving throws."
  },
  {
    "name": "Moonlight Step",
    "icon": "",
    "cat": "bonus",
    "uses": "WIS mod / LR",
    "resKey": "moon_moonlight_step",
    "minLevel": 10,
    "desc": "Bonus Action: teleport up to 30 ft to an unoccupied space you can see. You have Advantage on the next attack roll you make before the end of this turn. Uses: WIS modifier (min 1) per Long Rest. You can also restore uses by expending a level 2+ spell slot per use (no action required)."
  },
  {
    "name": "Lunar Form",
    "icon": "",
    "cat": "attack",
    "uses": "1 / turn",
    "minLevel": 14,
    "damageFormula": "2d10",
    "damageButtonLabel": ({ formula }) => `+${formula} radiant`,
    "damageKind": "damage",
    "desc": "Once per turn, you can deal an extra 2d10 Radiant damage to a target you hit with a Wild Shape form's attack. Additionally, whenever you use Moonlight Step, you can also teleport one willing creature within 10 ft of you to an unoccupied space you can see within 10 ft of your destination space."
  }
]);
registerSubclassSheetResources("Druid_Moon", [
  {
    "key": "moon_moonlight_step",
    "name": "Moonlight Step",
    "icon": "moon",
    "recharge": "LR",
    "max": () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('wis')) : 1)
  }
]);
// [SheetRuntime] END
