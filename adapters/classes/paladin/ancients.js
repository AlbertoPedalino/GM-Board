import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';

registerSubclassAdapter("Paladin_Ancients", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Ancients", [
  { name: "Channel: Nature's Wrath", icon: "", cat: "action", uses: "1 Channel", resKey: "paladin_channel_div",
    desc: "Magic action: expend one use of Channel Divinity to conjure spectral vines. Each creature of your choice you can see within 15 ft must succeed on a STR saving throw (spell save DC) or have the Restrained condition for 1 minute. A Restrained creature repeats the save at the end of each of its turns, ending the effect on a success." },
  { name: "Aura of Warding", icon: "", cat: "action", uses: "Passive", minLevel: 7,
    desc: "While conscious, you and friendly creatures within your Aura of Protection have Resistance to Necrotic, Psychic, and Radiant damage. Range: 10 ft (30 ft at lv.18)." },
  { name: "Undying Sentinel", icon: "", cat: "action", uses: "1 / LR", resKey: "ancients_undying_sentinel", minLevel: 15,
    desc: "When you are reduced to 0 HP and not killed outright, you can drop to 1 HP instead and regain HP equal to 3 times your Paladin level. You also can't be aged magically and cease visibly aging. Recharge: Long Rest." },
  { name: "Elder Champion", icon: "", cat: "bonus", uses: "1 / LR or lv5 slot", resKey: "ancients_elder_champion", minLevel: 20,
    desc: "Bonus Action: imbue your Aura of Protection with primal power for 1 minute (no action to end). Three benefits — Diminish Defiance: enemies in the aura have Disadvantage on saving throws against your spells and Channel Divinity; Regeneration: regain 10 HP at the start of each of your turns; Swift Spells: whenever you cast a spell with a casting time of an action, you can cast it using a Bonus Action instead. Recharge: LR, or expend a level 5 spell slot." },
]);
registerSubclassSheetResources("Paladin_Ancients", [
  { key: "ancients_undying_sentinel", name: "Undying Sentinel", icon: "shield", recharge: "LR", max: () => 1 },
  { key: "ancients_elder_champion",   name: "Elder Champion",   icon: "leaf",   recharge: "LR", max: () => 1 },
]);
// [SheetRuntime] END
