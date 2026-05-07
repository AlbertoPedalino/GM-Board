// War Domain (XPHB): tutte le feature sono passive o azioni fisse, nessuna scelta di build.
// L3: War Priest, Guided Strike (CD)
// L6: War God's Blessing (CD)
// L17: Avatar of Battle (resistenze B/P/S)
registerSubclassAdapter("Cleric_War", function (cls, lv, specs) {
  // nessuna spec
});

// [SheetRuntime] START
registerSubclassSheetActions("Cleric_War", [
  { name: "War Priest", icon: "", cat: "bonus", uses: "WIS mod / SR+LR", resKey: "war_priest", minLevel: 3,
    desc: "Bonus Action: make one attack with a weapon or Unarmed Strike. Uses = WIS modifier (min 1) per Short or Long Rest." },
  { name: "Channel: Guided Strike", icon: "", cat: "action", uses: "1 Channel", resKey: "channel_div", minLevel: 3,
    desc: "When you or a creature within 30 ft misses with an attack roll, expend one use of Channel Divinity to add +10 to that roll, potentially causing it to hit. Benefiting another creature's attack roll requires your Reaction." },
  { name: "Channel: War God's Blessing", icon: "", cat: "action", uses: "1 Channel", resKey: "channel_div", minLevel: 6,
    desc: "Expend one use of Channel Divinity to cast Shield of Faith or Spiritual Weapon without expending a spell slot. The spell doesn't require Concentration — it lasts for 1 minute, ending early if you cast it again, have the Incapacitated condition, or die." },
  { name: "Avatar of Battle", icon: "", cat: "action", uses: "Passive", minLevel: 17,
    desc: "Resistance to Bludgeoning, Piercing, and Slashing damage." },
]);
registerSubclassSheetResources("Cleric_War", [
  { key: "war_priest", name: "War Priest", icon: "swords", recharge: "SR",
    max: (lv) => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('wis')) : 1) },
]);
// [SheetRuntime] END
