// Life Domain (XPHB): tutte le feature sono passive, nessuna scelta di build.
// L3: Disciple of Life, Preserve Life (CD)
// L6: Blessed Healer
// L17: Supreme Healing
registerSubclassAdapter("Cleric_Life", function (cls, lv, specs) {
  // nessuna spec
});

registerSubclassSheetFeatureFilter("Cleric_Life", function (ctx, features) {
  const out = Array.isArray(features) ? features.map(f => ({ ...f })) : [];
  const classLevel = Number(ctx?.classLevel || ctx?.character?.classLevel || ctx?.character?.level || 1);
  if (classLevel < 3) return out;

  const desc =
    "When a spell you cast with a spell slot restores Hit Points to a creature, that creature regains additional Hit Points on the turn you cast the spell. The additional Hit Points equal 2 plus the spell slot's level.";

  const norm = (v) => String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const idx = out.findIndex(f => norm(f?.name) === "discipleoflife");
  if (idx >= 0) {
    const cur = out[idx] || {};
    out[idx] = {
      ...cur,
      level: Number(cur.level || 3),
      entries: Array.isArray(cur.entries) && cur.entries.length ? cur.entries : [desc],
    };
    return out;
  }

  out.push({
    name: "Disciple of Life",
    level: 3,
    entries: [desc],
  });
  return out;
});

// [SheetRuntime] START
registerSubclassSheetActions("Cleric_Life", [
  {
    "name": "Channel: Preserve Life",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "desc": "Within 30 ft: distribute HP equal to 5 x Cleric level among any creatures of your choice (excluding Undead and Constructs), without exceeding each creature's maximum."
  }
]);
// [SheetRuntime] END
