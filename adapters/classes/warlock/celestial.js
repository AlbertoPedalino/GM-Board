import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';

registerSubclassAdapter("Warlock_Celestial", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Celestial", [
  { name: "Healing Light", icon: "", cat: "bonus", uses: "Pool / LR", resKey: "celestial_heal_light", minLevel: 3,
    desc: "Bonus Action: expend 1 or more dice from your pool to restore HP to one creature within 60 ft (1d6 per die spent). Max dice per use = your CHA modifier (min 1). Pool = 1 + your Warlock level (d6s). Recharge: Long Rest." },
  { name: "Radiant Soul", icon: "", cat: "action", uses: "Passive", minLevel: 6,
    desc: "Resistance to Radiant damage. When you cast a spell that deals Radiant or Fire damage, add your CHA modifier to one damage roll of that spell." },
  { name: "Celestial Resilience", icon: "", cat: "action", uses: "Passive", minLevel: 10,
    desc: "When you finish a Short or Long Rest, or when you use Magical Cunning, gain temporary HP equal to your Warlock level + CHA modifier. Up to 5 chosen creatures within 10 ft also gain temporary HP equal to half your Warlock level + CHA modifier." },
  { name: "Searing Vengeance", icon: "", cat: "action", uses: "1 / LR", resKey: "celestial_searing_ven", minLevel: 14,
    damageFormula: "2d8",
    damageButtonLabel: ({ formula }) => `${formula} radiant`,
    damageKind: "damage",
    desc: "When you or an ally within 60 ft of you is about to make a Death Saving Throw: the creature regains HP equal to half its Hit Point maximum and can stand up if Prone. Each creature within 30 ft takes 2d8 Radiant damage + your CHA modifier and has the Blinded condition until the end of the current turn (no saving throw). Recharge: Long Rest." },
]);
registerSubclassSheetResources("Warlock_Celestial", [
  { key: "celestial_heal_light", name: "Healing Light", icon: "sun",   recharge: "LR",
    max: (lv) => 1 + lv,
    pool: true },
  { key: "celestial_searing_ven", name: "Searing Vengeance", icon: "flame", recharge: "LR", max: () => 1 },
]);
// [SheetRuntime] END
