registerSubclassAdapter("Monk_Open Hand", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Monk_Open Hand", [
  { name: "Open Hand Technique", icon: "", cat: "attack", uses: "With Flurry", minLevel: 3,
    desc: "When you hit a creature with an attack granted by Flurry of Blows, impose one effect — Addle: the target can't make Opportunity Attacks until the start of its next turn; Push: the target must succeed on a STR save or be pushed up to 15 ft away from you; Topple: the target must succeed on a DEX save or have the Prone condition. Save DC = 8 + PB + WIS." },
  { name: "Wholeness of Body", icon: "", cat: "bonus", uses: "WIS mod / LR", resKey: "open_hand_wholeness", minLevel: 6,
    desc: "Bonus Action: roll your Martial Arts die and regain HP equal to the number rolled plus your WIS modifier (minimum 1 HP). Uses = WIS modifier (min 1) per Long Rest." },
  { name: "Fleet Step", icon: "", cat: "bonus", uses: "After any Bonus Action", minLevel: 11,
    desc: "When you take a Bonus Action other than Step of the Wind, you can also use Step of the Wind immediately after that Bonus Action." },
  { name: "Quivering Palm", icon: "", cat: "attack", uses: "4 Focus Points", resKey: "ki", minLevel: 17,
    damageFormula: "10d12",
    damageButtonLabel: ({ formula }) => `${formula} force`,
    damageKind: "damage",
    desc: "When you hit a creature with an Unarmed Strike, expend 4 Focus Points to set up lethal vibrations lasting a number of days equal to your Monk level. You can end them (no action required, harmlessly) or as an Action, or by forgoing one attack of your Attack action — target must be on the same plane. Target makes a CON save (spell save DC): fail = 10d12 Force damage; success = half. Only one creature at a time." },
]);
registerSubclassSheetResources("Monk_Open Hand", [
  { key: "open_hand_wholeness", name: "Wholeness of Body", icon: "heart", recharge: "LR",
    max: (lv) => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('wis')) : 1) },
]);
// [SheetRuntime] END
