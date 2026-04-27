registerSubclassAdapter("Warlock_Great Old One", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Great Old One", [
  {
    "name": "Awakened Mind",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "desc": "Telepathically communicate with any creature within 30 ft that knows at least one language, even if it doesn't speak yours."
  },
  {
    "name": "Entropic Ward",
    "icon": "",
    "cat": "reaction",
    "uses": "1 / LR",
    "resKey": "goo_entropic_ward",
    "minLevel": 6,
    "desc": "Reaction when a creature makes an attack roll against you: impose Disadvantage on that roll. If the attack misses, gain Advantage on your next attack roll against that creature before the end of your next turn. Recharge: Long Rest."
  },
  {
    "name": "Thought Shield",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 10,
    "desc": "Your thoughts can't be read by telepathy or other means unless you allow it. Resistance to Psychic damage. Whenever a creature deals Psychic damage to you, that creature takes the same amount."
  },
  {
    "name": "Create Thrall",
    "icon": "",
    "cat": "action",
    "uses": "Spell slot",
    "minLevel": 14,
    "desc": "Cast Charm Person on an Incapacitated humanoid using a Warlock spell slot. On success: the charm is indefinite and a telepathic link forms (no range limit, same plane). The target is Charmed until the charm is broken by magic or it takes damage from you or your allies."
  }
]);
registerSubclassSheetResources("Warlock_Great Old One", [
  {
    "key": "goo_entropic_ward",
    "name": "Entropic Ward",
    "icon": "eye",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
