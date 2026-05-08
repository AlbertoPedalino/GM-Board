import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetProficiencies } from '../../registry.js';

registerSubclassAdapter("Bard_Valor", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Bard_Valor", [
  { name: "Combat Inspiration", icon: "", cat: "reaction", uses: "With Bardic Insp.", minLevel: 3,
    desc: "A creature that has one of your Bardic Inspiration dice can use it for one of these effects: Shield — when hit by an attack roll, use its Reaction to roll the die and add the result to its AC against that attack (potentially causing a miss); Strike — immediately after hitting a target with an attack roll, roll the die and add the result to the attack's damage." },
  { name: "Martial Training",   icon: "", cat: "action",   uses: "Passive",           minLevel: 3,
    desc: "Passive: proficiency with Martial weapons, Medium Armor, and Shields. You can use a Simple or Martial weapon as a Spellcasting Focus to cast spells from your Bard spell list." },
  { name: "Extra Attack",       icon: "", cat: "attack",   uses: "Passive",           minLevel: 6,
    desc: "Passive: attack twice, instead of once, whenever you take the Attack action on your turn. You can also cast one of your cantrips that has a casting time of an action in place of one of those attacks." },
  { name: "Battle Magic",       icon: "", cat: "bonus",    uses: "After casting spell", minLevel: 14,
    desc: "After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action." },
]);

registerSubclassSheetProficiencies("Bard_Valor", [
  { type: "armor", values: ["Medium", "Shield"], minLevel: 3 },
  { type: "weapon", values: ["Martial"], minLevel: 3 },
]);
// [SheetRuntime] END
