import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';

registerSubclassAdapter("Paladin_Vengeance", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Vengeance", [
  { name: "Channel: Vow of Enmity", icon: "", cat: "action", uses: "1 Channel", resKey: "paladin_channel_div",
    desc: "When you take the Attack action, you can expend one use of Channel Divinity to utter a vow of enmity against a creature you can see within 30 ft. You have Advantage on attack rolls against that creature for 1 minute or until you use this feature again. If it drops to 0 HP before the vow ends, you can transfer the vow to a different creature within 30 ft (no action required)." },
  { name: "Relentless Avenger", icon: "", cat: "reaction", uses: "Passive", minLevel: 7,
    desc: "When you hit a creature with an Opportunity Attack, you can reduce that creature's Speed to 0 until the end of the current turn, then move up to half your Speed as part of the same Reaction without provoking Opportunity Attacks." },
  { name: "Soul of Vengeance", icon: "", cat: "reaction", uses: "At will", minLevel: 15,
    desc: "Reaction immediately after a creature under the effect of your Vow of Enmity hits or misses with an attack roll: make one melee attack against that creature if it is within range." },
  { name: "Avenging Angel", icon: "", cat: "bonus", uses: "1 / LR or lv5 slot", resKey: "vengeance_avenging_angel", minLevel: 20,
    desc: "Bonus Action: gain benefits for 10 minutes (no action to end). Flight: sprout spectral wings, Fly Speed 60 ft and can hover. Frightful Aura: whenever an enemy starts its turn in your Aura of Protection, it must succeed on a WIS save (spell save DC) or have the Frightened condition for 1 minute or until it takes any damage. Attack rolls against Frightened creatures have Advantage. Recharge: LR, or expend a level 5 spell slot." },
]);
registerSubclassSheetResources("Paladin_Vengeance", [
  { key: "vengeance_avenging_angel", name: "Avenging Angel", icon: "feather", recharge: "LR", max: () => 1 },
]);
// [SheetRuntime] END
