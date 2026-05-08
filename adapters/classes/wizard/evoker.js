import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';
import { addWizardSavantSpellChoices } from './wizard.js';

registerSubclassAdapter("Wizard_Evoker", function (cls, lv, specs) {
  if (typeof addWizardSavantSpellChoices === "function") {
    addWizardSavantSpellChoices(specs, lv, { key: "evoker", label: "Evocation", school: "V" });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Evoker", [
  { name: "Potent Cantrip", icon: "", cat: "action", uses: "Passive", minLevel: 3,
    desc: "When you cast a cantrip at a creature and miss with the attack roll, or the target succeeds on a saving throw against the cantrip, the target takes half the cantrip's damage (if any) but suffers no additional effect." },
  { name: "Sculpt Spells", icon: "", cat: "action", uses: "Passive", minLevel: 6,
    desc: "When you cast an Evocation spell that affects creatures you can see, choose up to (1 + spell level) of them. Chosen creatures automatically succeed on their saving throws against the spell and take no damage (including no half damage on a successful save)." },
  { name: "Empowered Evocation", icon: "", cat: "action", uses: "Passive", minLevel: 10,
    desc: "Whenever you cast a Wizard spell from the Evocation school, add your INT modifier to one damage roll of that spell." },
  { name: "Overchannel", icon: "", cat: "action", uses: "1st use free / LR", resKey: "overchannel", minLevel: 14,
    desc: "When you cast a Wizard spell with a spell slot of levels 1–5 that deals damage, you can deal maximum damage with that spell on the turn you cast it. First use per LR: no adverse effect. Each subsequent use before a LR: take Necrotic damage ignoring Resistance and Immunity — starts at 2d12 per spell level, then increases by 1d12 per spell level with each additional use (3rd use = 3d12/level, etc.)." },
]);
registerSubclassSheetResources("Wizard_Evoker", [
  { key: "overchannel", name: "Overchannel", icon: "zap", recharge: "LR", max: () => 1 },
]);
// [SheetRuntime] END
