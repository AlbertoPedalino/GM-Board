registerSubclassAdapter("Warlock_Fiend", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Fiend", [
  { name: "Dark One's Blessing", icon: "", cat: "action", uses: "Passive", minLevel: 3,
    inlinePills: ({ ownerLevel, character }) => {
      const lv = Number(ownerLevel || 1);
      const cha = typeof getMod === "function" && typeof getFinal === "function"
        ? Number(getMod(getFinal("cha")) || 0) : 0;
      return [{ icon: "skull", label: "Temp HP", value: Math.max(1, lv + cha) }];
    },
    desc: "When you or a creature within 10 ft of you reduces a hostile creature to 0 HP, gain temporary HP equal to your Warlock level + CHA modifier." },
  { name: "Dark One's Own Luck", icon: "", cat: "reaction", uses: "CHA mod / LR", resKey: "fiend_luck", minLevel: 6,
    desc: "When you make an ability check or saving throw, expend one use to add 1d10 to the roll (declare before rolling, before DM states outcome). Recharge: Long Rest." },
  { name: "Fiendish Resilience", icon: "", cat: "action", uses: "Passive", minLevel: 10,
    desc: "At the end of each Short or Long Rest, choose one damage type (not Force): gain Resistance to that type until you choose another with this feature." },
  { name: "Hurl Through Hell", icon: "", cat: "action", uses: "1 / LR or Pact Magic slot", resKey: "fiend_hurl", minLevel: 14,
    damageFormula: "8d10",
    damageButtonLabel: ({ formula }) => `${formula} psychic`,
    damageKind: "damage",
    desc: "When you hit a creature with an attack, banish it to the lower planes until the end of your next turn. When it returns: if it isn't a Fiend, it must make a CHA saving throw (spell save DC) or take 8d10 Psychic damage and have the Incapacitated condition until the end of its next turn (on a success, half damage, not Incapacitated). Recharge: LR, or expend a Pact Magic slot." },
]);
registerSubclassSheetResources("Warlock_Fiend", [
  { key: "fiend_luck", name: "Dark One's Own Luck", icon: "dice-6", recharge: "LR",
    max: (lv) => typeof getMod === 'function' && typeof getFinal === 'function' ? Math.max(1, getMod(getFinal('cha'))) : 3 },
  { key: "fiend_hurl", name: "Hurl Through Hell", icon: "flame", recharge: "LR", max: () => 1 },
]);
// [SheetRuntime] END
