registerSubclassAdapter("Warlock_Archfey", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Archfey", [
  {
    "name": "Fey Step",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / SR",
    "resKey": "fey_step",
    "minLevel": 3,
    "desc": "Bonus Action: teleport to an unoccupied space you can see within 30 ft. Recharge: Short Rest."
  },
  {
    "name": "Misty Escape",
    "icon": "",
    "cat": "reaction",
    "uses": "1 / SR",
    "resKey": "archfey_misty_escape",
    "minLevel": 6,
    "desc": "Reaction when you take damage: teleport to an unoccupied space you can see within 60 ft and turn Invisible until the start of your next turn or until you attack, deal damage, or cast a spell. Recharge: Short Rest."
  },
  {
    "name": "Beguiling Defenses",
    "icon": "",
    "cat": "reaction",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "Immune to the Charmed condition. When a creature tries to charm you, use your Reaction to attempt to turn the charm back: it must succeed on a WIS save (spell save DC) or be Charmed by you for 1 minute."
  },
  {
    "name": "Bewitching Magic",
    "icon": "",
    "cat": "bonus",
    "uses": "After casting enchantment/illusion",
    "minLevel": 14,
    "desc": "Immediately after you cast an Enchantment or Illusion spell using an Action, you can cast Fey Step as a Bonus Action without expending a Fey Step charge."
  }
]);
registerSubclassSheetResources("Warlock_Archfey", [
  {
    "key": "fey_step",
    "name": "Fey Step",
    "icon": "sparkles",
    "recharge": "SR",
    "max": () => 1
  },
  {
    "key": "archfey_misty_escape",
    "name": "Misty Escape",
    "icon": "wind",
    "recharge": "SR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
