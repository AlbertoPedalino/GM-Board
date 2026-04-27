// Light Domain (XPHB): tutte le feature sono passive, nessuna scelta di build.
// L3: Warding Flare, Radiance of the Dawn (CD)
// L6: Improved Warding Flare
// L17: Corona of Light
registerSubclassAdapter("Cleric_Light", function (cls, lv, specs) {
  // nessuna spec
});

// [SheetRuntime] START
registerSubclassSheetActions("Cleric_Light", [
  {
    "name": "Warding Flare",
    "icon": "",
    "cat": "reaction",
    "uses": "WIS mod / LR",
    "resKey": "warding_flare",
    "minLevel": 3,
    "desc": "Reaction when you (or lv.6+ an ally within 30 ft) are attacked: impose Disadvantage on that attack roll. Uses = your WIS modifier per Long Rest."
  },
  {
    "name": "Channel: Radiance of the Dawn",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "damageFormula": ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      return `2d10+${lv}`;
    },
    "damageButtonLabel": ({ formula }) => `${formula} radiant`,
    "desc": "Every Undead within 30 ft must succeed on a CON save or take 2d10 + Cleric level Radiant damage (half on success). Nonmagical darkness in the area is dispelled."
  },
  {
    "name": "Corona of Light",
    "icon": "",
    "cat": "action",
    "uses": "Action",
    "minLevel": 17,
    "desc": "You shed Bright Light in a 60-foot radius and Dim Light for an additional 30 feet until the end of your next turn. During this time, any Undead or Ooze that starts its turn in the Bright Light must succeed on a CON save (DC = spell save DC) or be Blinded until the end of its turn."
  }
]);
registerSubclassSheetResources("Cleric_Light", [
  {
    "key": "warding_flare",
    "name": "Warding Flare",
    "icon": "sun",
    "actionName": "Warding Flare",
    "recharge": "LR",
    "max": () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('wis')) : 1)
  }
]);
// [SheetRuntime] END
