import { createAdapterBindings } from '../../adapterBindings.js';

export default function install(registry, context = {}) {
  const {
    registerSubclassAdapter,
    registerSubclassSheetActions,
    registerSubclassSheetResources,
    registerSubclassSheetProficiencies,
    registerSubclassRuntimeConfig,
  } = createAdapterBindings(registry, context);

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
    { name: "Moon's Inspiration", icon: "", cat: "bonus", uses: "With Bardic Insp.", minLevel: 3,
      desc: "Inspired Eclipse and Lunar Vitality. See subclass description." },
    { name: "Primal Lore", icon: "", cat: "action", uses: "Passive", minLevel: 3,
      desc: "You learn Druidic, gain one Druid cantrip, and gain proficiency in one listed skill. Select choices in the builder." },
    { name: "Blessing of Moonlight", icon: "", cat: "action", uses: "1 / LR", resKey: "moon_blessing", minLevel: 6,
      desc: "Moonbeam is always prepared. Once per Long Rest when you cast Moonbeam, you can modify it." },
    { name: "Eventide's Splendor", icon: "", cat: "action", uses: "Passive", minLevel: 14,
      desc: "Improves Inspired Eclipse and Lunar Vitality." },
  ]);

  registerSubclassSheetResources("Bard_Moon", [
    { key: "moon_blessing", name: "Blessing of Moonlight", icon: "moon", recharge: "LR", actionName: "Blessing of Moonlight", max: (lv) => lv >= 6 ? 1 : 0 },
  ]);

  registerSubclassSheetProficiencies("Bard_Moon", [
    { type: "language", values: ["Druidic"], minLevel: 3 },
  ]);

  registerSubclassRuntimeConfig("Bard_Moon", {
    spellcasting: {
      alwaysPreparedSpells: [
        { name: "Moonbeam", minLevel: 6, level: 2 },
      ],
    },
  });
}
