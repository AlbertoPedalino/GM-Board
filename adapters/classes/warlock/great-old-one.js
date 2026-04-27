registerSubclassAdapter("Warlock_Great Old One", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Great Old One", [
  {
    "name": "Awakened Mind",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Telepathically communicate with any creature within 30 ft that knows at least one language, even if it doesn't speak yours."
  },
  {
    "name": "Clairvoyant Combatant",
    "icon": "",
    "cat": "action",
    "uses": "1 / SR",
    "resKey": "goo_clairvoyant",
    "minLevel": 6,
    "desc": "When you establish telepathic contact with a creature using Awakened Mind, you can force it to make a WIS saving throw (spell save DC). On a failure, the creature has Disadvantage on attack rolls against you until the telepathic contact ends. Recharge: Short Rest."
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
    "key": "goo_clairvoyant",
    "name": "Clairvoyant Combatant",
    "icon": "eye",
    "recharge": "SR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
