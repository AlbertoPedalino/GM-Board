registerClassAdapter("Cleric", function (cls, lv, specs) {
  if (lv >= 1) {
    specs.push({
      key: 'cleric_divine_order',
      label: 'Divine Order',
      type: 'generic_choice',
      from: ['Protector', 'Thaumaturge'],
      count: 1,
      level: 1
    });
    var _divOrder = typeof char !== 'undefined' && char.choices && char.choices.cleric_divine_order;
    if (Array.isArray(_divOrder) ? _divOrder.includes('Thaumaturge') : _divOrder === 'Thaumaturge') {
      specs.push({
        key: 'cleric_thaumaturge_cantrip',
        label: 'Thaumaturge — Extra Cantrip',
        type: 'spell_choice',
        spellFilter: { spellLevel: 0, classes: ['Cleric'] },
        count: 1,
        level: 1
      });
    }
  }
  if (lv >= 7) {
    specs.push({
      key: 'cleric_blessed_strikes',
      label: 'Blessed Strikes',
      type: 'generic_choice',
      from: ['Divine Strike', 'Potent Spellcasting'],
      count: 1,
      level: 7
    });
  }
  if (lv >= 19) {
    specs.push({
      key: 'cleric_epic_boon',
      label: 'Epic Boon',
      type: 'feat_cat',
      categories: ['EB'],
      count: 1,
      level: 19
    });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Cleric", [
  {
    "name": "Divine Order",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "desc": "Choose at lv.1 — Protector: proficiency with Martial weapons and Heavy armor; or Thaumaturge: learn one extra Cleric cantrip and gain one additional use of Divine Spark per rest."
  },
  {
    "name": "Channel Divinity",
    "icon": "",
    "cat": "action",
    "uses": "1-3 / SR",
    "resKey": "channel_div",
    "minLevel": 2,
    "desc": "Channel your deity's power. Uses: 1 (lv.2–5), 2 (lv.6–17), 3 (lv.18+). Recharge: Short Rest. Options include Turn Undead and your Domain's feature (see subclass)."
  },
  {
    "name": "Turn Undead",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "channel_div",
    "minLevel": 2,
    "desc": "Channel Divinity option. Each Undead within 30 ft that can see or hear you must succeed on a WIS save (DC = 8+PB+WIS) or have the Frightened and Incapacitated condition for 1 minute (flees). Undead with CR ≤ your Proficiency Bonus are Destroyed instead."
  },
  {
    "name": "Divine Spark",
    "icon": "",
    "cat": "action",
    "uses": "1+ Channel",
    "resKey": "channel_div",
    "minLevel": 2,
    "healFormula": ({ character }) => {
      const wis = typeof getMod === "function" && typeof getFinal === "function"
        ? Number(getMod(getFinal("wis")) || 0)
        : 0;
      return `2d8${wis >= 0 ? "+" : ""}${wis}`;
    },
    "damageKind": "heal",
    "damageButtonLabel": ({ formula }) => String(formula || ""),
    "rollLabelPrefix": "Divine Spark",
    "desc": "Channel Divinity option. Choose a creature within 30 ft: it either regains HP or takes Radiant or Necrotic damage (your choice) equal to 2d8 + your WIS modifier. For each additional Channel Divinity use spent (beyond the first), add 1d8. The maximum additional uses scales with level: +1 at lv.2, +2 at lv.5, +3 at lv.8, +4 at lv.11, +5 at lv.14, +6 at lv.17."
  },
  {
    "name": "Sear Undead",
    "icon": "",
    "cat": "action",
    "uses": "On Turn Undead",
    "minLevel": 5,
    "damageFormula": ({ ownerLevel }) => `2d6+${Number(ownerLevel||1)}`,
    "damageButtonLabel": ({ formula }) => `${formula} radiant`,
    "damageKind": "damage",
    "desc": "When you use Turn Undead, each Undead that fails its WIS save takes Radiant damage equal to 2d6 + your Cleric level (in addition to being turned or destroyed)."
  },
  {
    "name": "Divine Intervention",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "divine_intervention",
    "minLevel": 10,
    "desc": "Implore your deity's aid. Roll 1d20: if the result ≤ your Cleric level, your deity intervenes (effect determined by the DM). At lv.20, this succeeds automatically. Recharge: Long Rest."
  },
  {
    "name": "Blessed Strikes",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 7,
    "damageFormula": "1d8",
    "damageButtonLabel": "+1d8 divine",
    "desc": "Gain one of two benefits: Divine Strike (add 1d8 of your domain's damage type once per turn) or Potent Spellcasting (add WIS mod to Cleric cantrip damage)."
  },
  {
    "name": "Greater Divine Intervention",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "divine_intervention",
    "minLevel": 20,
    "desc": "Your Divine Intervention automatically succeeds. Additionally, you can cast any Cleric spell of 5th level or lower without expending a spell slot (using this feature). Recharge: Long Rest."
  }
]);
registerClassSheetResources("Cleric", [
  {
    "key": "channel_div",
    "name": "Channel Divinity",
    "icon": "sun",
    "recharge": "SR",
    "max": (lv)=>lv>=18?4:lv>=6?3:2
  },
  {
    "key": "divine_intervention",
    "name": "Divine Intervention",
    "icon": "hands",
    "recharge": "LR",
    "max": (lv)=>lv>=10?1:0
  }
]);
// [SheetRuntime] END
