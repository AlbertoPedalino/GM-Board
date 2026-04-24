// Psi Warrior (XPHB): tutte le feature sono passive o gestite automaticamente.
// L3: Psionic Energy Dice, Psionic Strike, Telekinetic Movement
// L7: Telekinetic Adept (Psi-Powered Leap + Telekinetic Thrust)
// L10: Guarded Mind
// L15: Bulwark of Force
// L18: Telekinetic Master
// Nessuna scelta di build richiesta — le capacità sono fisse per livello.
registerSubclassAdapter("Fighter_Psi Warrior", function (cls, lv, specs) {
  // nessuna spec
});

// [SheetRuntime] START
registerSubclassSheetActions("Fighter_Psi Warrior", [
  {
    "name": "Psionic Strike",
    "icon": "",
    "cat": "attack",
    "uses": "Psi Dice",
    "resKey": "psi_dice",
    "minLevel": 3,
    "desc": "After hitting with a weapon: spend a Psi Die (d6 to d12) to add psychic damage and potentially incapacitate the target until the end of its turn."
  }
]);
registerSubclassSheetResources("Fighter_Psi Warrior", [
  {
    "key": "psi_dice",
    "name": "Psi Points",
    "icon": "orbit",
    "recharge": "SR",
    "max": (lv)=>lv>=11?12:lv>=5?8:6,
    "pool": true
  }
]);
// [SheetRuntime] END
