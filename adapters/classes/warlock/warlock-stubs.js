// The Fiend (XPHB): Dark One's Blessing, Hurl Through Hell, Fiendish Resilience — tutto passivo.
registerSubclassAdapter("Warlock_Fiend", function (cls, lv, specs) {});
// The Great Old One (XPHB): Awakened Mind, Entropic Ward, Thought Shield — tutto passivo.
registerSubclassAdapter("Warlock_Great Old One", function (cls, lv, specs) {});
// The Archfey (XPHB): Steps of the Fey (CD), Misty Escape, Beguiling Defenses — tutto passivo/CD.
registerSubclassAdapter("Warlock_Archfey", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Warlock_Fiend", [
  {
    "name": "Dark One's Blessing",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "desc": "When you kill a creature with CR >= 1: gain temporary HP equal to your Warlock level + CHA mod."
  }
]);
registerSubclassSheetActions("Warlock_Great Old One", [
  {
    "name": "Awakened Mind",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "desc": "Telepathically communicate with any creature within 30 ft that knows at least one language, even if it doesn't speak yours."
  }
]);
registerSubclassSheetActions("Warlock_Archfey", [
  {
    "name": "Fey Step",
    "icon": "",
    "cat": "bonus",
    "uses": "1 / SR",
    "resKey": "fey_step",
    "minLevel": 1,
    "desc": "Bonus action: teleport to an unoccupied space within 30 ft. The old space is cloaked in illusion until your next turn."
  }
]);
// [SheetRuntime] END
