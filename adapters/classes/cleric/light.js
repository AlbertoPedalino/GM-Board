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
    "name": "Channel: Radiance of the Dawn",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "damageFormula": ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      return `2d10${lv >= 0 ? "+" : ""}${lv}`;
    },
    "damageButtonLabel": ({ formula }) => String(formula || ""),
    "desc": "Every Undead within 30 ft must succeed on a CON save or take 2d10+level radiant damage (half on success). Creatures that cannot see the light have disadvantage."
  }
]);
// [SheetRuntime] END
