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
    "cat": "bonus",
    "uses": "Toggle",
    "minLevel": 17,
    "desc": "Bonus Action: emanate an aura of sunlight for 1 minute or until you use this feature again. You emit Bright Light in a 60-ft radius and Dim Light for an additional 30 ft. Hostile creatures in the Bright Light have Disadvantage on saving throws against your spells that deal Fire or Radiant damage."
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
