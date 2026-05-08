import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';
import { addWizardSavantSpellChoices } from './wizard.js';

registerSubclassAdapter("Wizard_Diviner", function (cls, lv, specs) {
  if (typeof addWizardSavantSpellChoices === "function") {
    addWizardSavantSpellChoices(specs, lv, { key: "diviner", label: "Divination", school: "D" });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Diviner", [
  { name: "Portent", icon: "", cat: "action", uses: "2–3 / LR", resKey: "portent", minLevel: 3,
    desc: "After each Long Rest: roll 2d20 (3d20 at lv.14) and record the results. Before any D20 Test made by you or a creature you can see, you can replace the roll with one of your foretelling results (expend it). You must choose to do so before the roll. Only once per turn. Unused rolls lost on next Long Rest." },
  { name: "Expert Divination", icon: "", cat: "action", uses: "Passive", minLevel: 6,
    desc: "When you cast a Divination spell using a level 2+ spell slot, you regain one expended spell slot of a lower level than the slot you expended (max level 5)." },
  { name: "The Third Eye", icon: "", cat: "bonus", uses: "1 / SR+LR", resKey: "third_eye", minLevel: 10,
    desc: "Bonus Action: choose one benefit until you start a Short or Long Rest — Darkvision: gain Darkvision 120 ft; Greater Comprehension: read any language; See Invisibility: cast See Invisibility without expending a spell slot. Recharge: Short or Long Rest." },
]);
registerSubclassSheetResources("Wizard_Diviner", [
  { key: "portent",    name: "Portent",     icon: "eye",  recharge: "LR", max: (lv) => lv >= 14 ? 3 : 2 },
  { key: "third_eye",  name: "The Third Eye", icon: "eye", recharge: "SR", max: () => 1 },
]);
// [SheetRuntime] END
