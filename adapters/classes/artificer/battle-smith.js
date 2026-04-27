registerSubclassAdapter("Artificer_Battle Smith", function (cls, lv, specs) {
  if (lv < 3) return;
  const bonusCount = typeof _artificerGetConditionalBonusCount === 'function'
    ? _artificerGetConditionalBonusCount(["Smith's Tools"])
    : 0;
  if (!bonusCount) return;
  specs.push({
    key: 'battlesmith_bonus_tool',
    label: 'Battle Smith - Bonus Artisan Tool',
    type: 'generic_choice',
    from: _ARTISAN_TOOLS,
    count: bonusCount,
    level: 3
  });
});

// [SheetRuntime] START
registerSubclassSheetActions("Artificer_Battle Smith", [
  {
    "name": "Battle Ready",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: you gain proficiency with martial weapons. When you attack with a magic weapon, you can use your INT modifier instead of STR or DEX for the attack and damage rolls."
  },
  {
    "name": "Steel Defender",
    "icon": "",
    "cat": "bonus",
    "uses": "Bonus Action (command)",
    "minLevel": 3,
    "desc": "Your Steel Defender (AC = 15 + PB, HP = 2 + INT mod + 5 × Artificer level) acts on your initiative. Bonus Action: command it to Dash, Disengage, Help, or make an attack. It can use its Deflect Attack reaction (uses your reaction) to impose Disadvantage on an attack against a creature within 5 ft of it. Revive with smith's tools (10 min) after death; recreate after Long Rest."
  },
  {
    "name": "Arcane Jolt",
    "icon": "",
    "cat": "attack",
    "uses": "INT mod / LR",
    "resKey": "arcane_jolt",
    "minLevel": 9,
    "damageFormula": ({ ownerLevel }) => Number(ownerLevel || 1) >= 15 ? '4d6' : '2d6',
    "damageButtonLabel": ({ formula }) => `+${formula} force`,
    "damageKind": "damage",
    "rollLabelPrefix": "Arcane Jolt",
    "desc": "When you or your Steel Defender hits with an attack, channel arcane energy: either deal extra Force damage (2d6; 4d6 at lv.15) to the target, OR restore HP to a creature within 30 ft of the target (same amount). Uses: INT modifier (min 1) per Long Rest. Recharge: Long Rest."
  },
  {
    "name": "Improved Defender",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 15,
    "desc": "Passive: your Arcane Jolt damage/healing increases to 4d6. Your Steel Defender gains +2 AC. When it uses Deflect Attack, the attacker takes Force damage equal to 1d4 + your INT modifier."
  }
]);
registerSubclassSheetResources("Artificer_Battle Smith", [
  {
    "key": "arcane_jolt",
    "name": "Arcane Jolt",
    "icon": "zap",
    "recharge": "LR",
    "max": () => Math.max(1, typeof getMod === 'function' && typeof getFinal === 'function' ? getMod(getFinal('int')) : 1)
  }
]);
registerSubclassSheetProficiencies("Artificer_Battle Smith", [
  { type: "tool", values: ["Smith's Tools"], minLevel: 3 }
]);
// [SheetRuntime] END
