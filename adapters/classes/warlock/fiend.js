registerSubclassAdapter("Warlock_Fiend", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Fiend", [
  {
    "name": "Dark One's Blessing",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "inlinePills": ({ ownerLevel, character }) => {
      const lv = Number(ownerLevel || 1);
      const cha = typeof getMod === "function" && typeof getFinal === "function"
        ? Number(getMod(getFinal("cha")) || 0)
        : 0;
      return [{ icon: "skull", label: "Temp HP", value: Math.max(1, lv + cha) }];
    },
    "desc": "When you reduce a hostile creature to 0 HP, gain temporary HP equal to your Warlock level + CHA modifier."
  },
  {
    "name": "Dark One's Own Luck",
    "icon": "",
    "cat": "reaction",
    "uses": "1 / SR",
    "resKey": "fiend_luck",
    "minLevel": 6,
    "desc": "When you make an ability check or saving throw, expend one use to add 1d10 to the roll. Declare before or after rolling, before the DM states the outcome. Recharge: Short Rest."
  },
  {
    "name": "Fiendish Resilience",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "At the end of each Short or Long Rest, choose one damage type (not Force or Psychic): gain Resistance to that type until your next rest."
  },
  {
    "name": "Hurl Through Hell",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "fiend_hurl",
    "minLevel": 14,
    "damageFormula": "10d10",
    "damageButtonLabel": ({ formula }) => `${formula} psychic`,
    "damageKind": "damage",
    "desc": "When you hit a creature with an attack, banish it to the lower planes until the end of your next turn, then it returns. If it isn't a Fiend, it takes 10d10 Psychic damage from its harrowing journey. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Warlock_Fiend", [
  {
    "key": "fiend_luck",
    "name": "Dark One's Own Luck",
    "icon": "dice-6",
    "recharge": "SR",
    "max": () => 1
  },
  {
    "key": "fiend_hurl",
    "name": "Hurl Through Hell",
    "icon": "flame",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
