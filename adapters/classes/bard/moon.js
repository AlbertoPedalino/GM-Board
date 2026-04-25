registerSubclassAdapter("Bard_Moon", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: "subclass_moon_primal_lore_skill",
      label: "Primal Lore Skill (Moon)",
      type: "skill_choice",
      from: ["Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Survival"],
      count: 1,
      level: 3,
    });
    specs.push({
      key: "subclass_moon_primal_lore_cantrip",
      label: "Primal Lore Cantrip (Moon)",
      type: "spell_choice",
      spellFilter: { spellLevel: 0, classes: ["Druid"] },
      count: 1,
      level: 3,
    });
  }
});

registerSubclassSheetActions("Bard_Moon", [
  { name: "Moon's Inspiration", icon: "", cat: "bonus",    uses: "With Bardic Insp.", minLevel: 3,
    desc: "Includes Inspired Eclipse (teleport and brief invisibility when granting Bardic Inspiration) and Lunar Vitality (boost healing by expending a Bardic Inspiration die once per turn)." },
  { name: "Primal Lore",        icon: "", cat: "action",   uses: "Passive",           minLevel: 3,
    desc: "You learn Druidic, gain one Druid cantrip (counts as Bard spell), and gain proficiency in one skill from the Primal Lore list." },
  { name: "Blessing of Moonlight", icon: "", cat: "action", uses: "1 / LR", resKey: "moon_blessing", minLevel: 6,
    desc: "You always have Moonbeam prepared. Once per Long Rest when you cast Moonbeam, you can modify it to grant extra healing to an additional creature on failed saves." },
  { name: "Eventide's Splendor", icon: "", cat: "reaction", uses: "Passive", minLevel: 14,
    desc: "Improves Moon's Inspiration: Inspired Eclipse can also affect the inspired ally, and Lunar Vitality can use 1d6 instead of expending a Bardic Inspiration die." },
]);

registerSubclassSheetResources("Bard_Moon", [
  { key: "moon_blessing", name: "Blessing of Moonlight", icon: "moon", recharge: "LR", actionName: "Blessing of Moonlight", max: () => 1 },
]);

registerSubclassSheetProficiencies("Bard_Moon", [
  { type: "language", values: ["Druidic"], minLevel: 3 },
]);
