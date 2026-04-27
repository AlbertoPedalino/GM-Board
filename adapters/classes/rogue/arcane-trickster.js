registerSubclassAdapter("Rogue_Arcane Trickster", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: "subclass_at_cantrip_1",
      label: "Arcane Trickster - Cantrip Wizard 1",
      type: "spell_choice",
      spellFilter: { spellLevel: 0, classes: ["Wizard"] },
      count: 1,
      level: 3
    });
    specs.push({
      key: "subclass_at_cantrip_2",
      label: "Arcane Trickster - Cantrip Wizard 2",
      type: "spell_choice",
      spellFilter: { spellLevel: 0, classes: ["Wizard"] },
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Rogue_Arcane Trickster", [
  {
    "name": "Mage Hand Legerdemain",
    "icon": "",
    "cat": "bonus",
    "uses": "Unlimited",
    "minLevel": 3,
    "desc": "Your Mage Hand cantrip is enhanced: you can make it invisible, and as a Bonus Action you can control it to stow/retrieve an item from a creature's container, use Thieves' Tools at range, or perform Sleight of Hand checks through it (using your DEX + PB)."
  },
  {
    "name": "Magical Ambush",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 9,
    "desc": "Passive: if you are hidden from a creature when you cast a spell on it, it has Disadvantage on any saving throw it makes against the spell this turn."
  },
  {
    "name": "Versatile Trickster",
    "icon": "",
    "cat": "bonus",
    "uses": "Unlimited",
    "minLevel": 13,
    "desc": "Bonus Action: when your Mage Hand is active, choose a creature within 5 ft of the hand. Until the start of your next turn, you have Advantage on attack rolls against that creature."
  },
  {
    "name": "Spell Thief",
    "icon": "",
    "cat": "reaction",
    "uses": "1 / LR",
    "resKey": "spell_thief",
    "minLevel": 17,
    "desc": "Reaction: when a creature casts a spell of level 1–6 that targets only you, force an INT save (DC = 8 + PB + INT). On failure: the spell fails and you gain the ability to cast it once (using INT as spellcasting ability) within 8 hours, without expending a spell slot, as long as it is on the Wizard spell list. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Rogue_Arcane Trickster", [
  {
    "key": "spell_thief",
    "name": "Spell Thief",
    "icon": "wand",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
