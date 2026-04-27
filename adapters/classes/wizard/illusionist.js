registerSubclassAdapter("Wizard_Illusionist", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Wizard_Illusionist", [
  {
    "name": "Improved Illusions",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: you can create auditory or visual components of illusions independently (no need for both). You add your Proficiency Bonus to the spell save DC of Illusion spells you cast."
  },
  {
    "name": "Phantasmal Creatures",
    "icon": "",
    "cat": "action",
    "uses": "2 / LR",
    "resKey": "phantasmal_creatures",
    "minLevel": 6,
    "desc": "Summon Beast and Summon Fey are always prepared for you. Once per Long Rest each, you can cast one of them as an Illusion (spectral appearance) without a spell slot — the summoned creature has half its normal Hit Points when cast this way."
  },
  {
    "name": "Illusory Self",
    "icon": "",
    "cat": "reaction",
    "uses": "1 / SR",
    "resKey": "illusory_self",
    "minLevel": 10,
    "desc": "When a creature makes an attack roll against you, use your Reaction to interpose an illusory duplicate. The attack automatically misses you. Recharge: Short Rest."
  },
  {
    "name": "Illusory Reality",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 14,
    "desc": "When you cast an Illusion spell of level 1+, you can choose one non-magical, non-living object within the spell (up to 5-foot cube) and make it temporarily real for 1 minute. The object interacts with the world normally until it disappears at the end of the duration."
  }
]);
registerSubclassSheetResources("Wizard_Illusionist", [
  {
    "key": "phantasmal_creatures",
    "name": "Phantasmal Creatures",
    "icon": "ghost",
    "recharge": "LR",
    "max": () => 2
  },
  {
    "key": "illusory_self",
    "name": "Illusory Self",
    "icon": "user",
    "recharge": "SR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
