registerSubclassAdapter("Druid_Sea", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Druid_Sea", [
  {
    "name": "Wrath of the Sea",
    "icon": "",
    "cat": "bonus",
    "uses": "WIS mod / LR",
    "resKey": "sea_wrath",
    "minLevel": 3,
    "damageFormula": ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      const die = lv >= 15 ? 12 : lv >= 9 ? 10 : lv >= 5 ? 8 : 6;
      return `1d${die}`;
    },
    "damageButtonLabel": ({ formula }) => `${formula} bludgeoning`,
    "damageKind": "damage",
    "desc": "Bonus Action: summon a spectral wave emanation (5-ft radius) for 1 minute. At the end of each of your turns, each creature within 5 ft must succeed on a STR save (spell save DC) or take 1d6 (scales by level) Bludgeoning damage, be pushed 15 ft, and knocked Prone. Uses: WIS modifier per Long Rest."
  },
  {
    "name": "Aquatic Affinity",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "Swim Speed equal to your walking speed. Can breathe underwater. Resistance to Cold damage."
  },
  {
    "name": "Stormborn",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "While outdoors in rain, thunderstorm, or near open water: gain a Fly Speed equal to your walking speed and can hover."
  },
  {
    "name": "Oceanic Gift",
    "icon": "",
    "cat": "bonus",
    "uses": "WIS mod / LR",
    "resKey": "sea_wrath",
    "minLevel": 14,
    "desc": "Grant a willing creature within 60 ft your Aquatic Affinity benefits (Swim Speed, breathe water, Cold resistance) for 24 hours. Uses shared with Wrath of the Sea."
  }
]);
registerSubclassSheetResources("Druid_Sea", [
  {
    "key": "sea_wrath",
    "name": "Wrath of the Sea",
    "icon": "waves",
    "recharge": "LR",
    "max": () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('wis')) : 1)
  }
]);
// [SheetRuntime] END
