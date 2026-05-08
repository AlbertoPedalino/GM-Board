import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';

registerSubclassAdapter("Paladin_Glory", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Glory", [
  { name: "Channel: Inspiring Smite", icon: "", cat: "bonus", uses: "1 Channel", resKey: "paladin_channel_div",
    desc: "Immediately after you cast Divine Smite, expend one use of Channel Divinity (Bonus Action) to distribute Temporary HP equal to 2d8 + your Paladin level among yourself and creatures of your choice within 30 ft." },
  { name: "Channel: Peerless Athlete", icon: "", cat: "bonus", uses: "1 Channel", resKey: "paladin_channel_div",
    desc: "Bonus Action: expend one use of Channel Divinity. For 1 hour, gain Advantage on STR (Athletics) and DEX (Acrobatics) checks, and your Long and High Jump distances increase by 10 ft (costs movement as normal)." },
  { name: "Aura of Alacrity", icon: "", cat: "action", uses: "Passive", minLevel: 7,
    desc: "Your Speed increases by 10 ft. Whenever an ally enters your Aura of Protection for the first time on a turn or starts their turn there, their Speed increases by 10 ft until the end of their next turn. Range: 10 ft (30 ft at lv.18)." },
  { name: "Glorious Defense", icon: "", cat: "reaction", uses: "CHA mod / LR", resKey: "glory_glorious_defense", minLevel: 15,
    desc: "Reaction when you or a creature you can see within 10 ft is hit by an attack: grant a bonus to that creature's AC equal to your CHA modifier (min +1), potentially causing the attack to miss. If it misses, you can make one attack with a weapon against the attacker as part of this Reaction (if within range). Uses = CHA modifier per Long Rest." },
  { name: "Living Legend", icon: "", cat: "bonus", uses: "1 / LR or lv5 slot", resKey: "glory_living_legend", minLevel: 20,
    desc: "Bonus Action: gain benefits for 10 minutes. Three benefits — Charismatic: Advantage on all CHA checks; Saving Throw Reroll: when you fail a saving throw, use your Reaction to reroll it (must use the new roll); Unerring Strike: once per turn, when you miss with a weapon attack, you can cause that attack to hit instead. Recharge: LR, or expend a level 5 spell slot." },
]);
registerSubclassSheetResources("Paladin_Glory", [
  { key: "glory_glorious_defense", name: "Glorious Defense", icon: "shield", recharge: "LR",
    max: (lv) => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('cha')) : 1) },
  { key: "glory_living_legend", name: "Living Legend", icon: "crown", recharge: "LR", max: () => 1 },
]);
// [SheetRuntime] END
