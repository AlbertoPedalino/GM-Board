import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';

registerSubclassAdapter("Warlock_Archfey", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Archfey", [
  { name: "Steps of the Fey", icon: "", cat: "bonus", uses: "CHA mod / LR", resKey: "archfey_steps", minLevel: 3,
    desc: "Bonus Action: cast Misty Step without expending a spell slot (CHA modifier uses per LR). When you teleport, choose one effect — Refreshing Step: regain 1d10 Temporary HP; or Taunting Step: each creature of your choice you can see within 5 ft of your destination makes a WIS save (spell save DC) or has Disadvantage on attack rolls against creatures other than you until the start of your next turn." },
  { name: "Misty Escape", icon: "", cat: "reaction", uses: "Pact Magic slot", minLevel: 6,
    desc: "Reaction when you take damage: expend one Pact Magic slot to cast Misty Step. After teleporting, choose one effect — Fey Refuge: have the Invisible condition until start of your next turn or until you attack, deal damage, or cast a spell; or Fey Curse: creatures within 5 ft of your origin or destination must succeed on a WIS save (spell save DC) or take 2d10 Psychic damage." },
  { name: "Beguiling Defenses", icon: "", cat: "reaction", uses: "1 / LR or Pact Magic slot", resKey: "archfey_beguiling", minLevel: 10,
    desc: "Immune to the Charmed condition. Reaction when hit by an attack: halve the damage of that attack against you, and the attacker must succeed on a WIS save (spell save DC) or take Psychic damage equal to the damage you took (after halving). Recharge: LR, or expend a Pact Magic slot." },
  { name: "Bewitching Magic", icon: "", cat: "action", uses: "After casting enchantment/illusion", minLevel: 14,
    desc: "Immediately after you cast an Enchantment or Illusion spell using an Action and a spell slot, you can cast Misty Step as part of that same action without expending a spell slot." },
]);
registerSubclassSheetResources("Warlock_Archfey", [
  { key: "archfey_steps",    name: "Steps of the Fey",    icon: "sparkles", recharge: "LR",
    max: (lv) => typeof getMod === 'function' && typeof getFinal === 'function' ? Math.max(1, getMod(getFinal('cha'))) : 3 },
  { key: "archfey_beguiling", name: "Beguiling Defenses", icon: "shield",   recharge: "LR", max: () => 1 },
]);
// [SheetRuntime] END
