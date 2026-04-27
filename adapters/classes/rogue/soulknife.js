registerSubclassAdapter("Rogue_Soulknife", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Rogue_Soulknife", [
  {
    "name": "Psychic Blades",
    "icon": "",
    "cat": "attack",
    "uses": "Unlimited",
    "minLevel": 3,
    "damageFormula": "1d6",
    "damageButtonLabel": ({ formula }) => `${formula} psychic`,
    "damageKind": "damage",
    "rollLabelPrefix": "Psychic Blades",
    "desc": "Manifest spectral blades as part of an Attack action: one melee/thrown weapon (1d6 psychic, Finesse, range 60 ft, disappears after throw). As a Bonus Action on the same turn, manifest a second blade for an off-hand attack (no ability modifier to damage unless negative). No material components."
  },
  {
    "name": "Psi-Bolstered Knack",
    "icon": "",
    "cat": "reaction",
    "uses": "1 Psionic Die",
    "resKey": "psionic_dice",
    "minLevel": 3,
    "desc": "When you fail an ability check using a skill or tool you are proficient in, roll one Psionic Energy Die and add it to the check. If this causes it to succeed, you do not expend the die."
  },
  {
    "name": "Psychic Whispers",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Psionic Die",
    "resKey": "psionic_dice",
    "minLevel": 3,
    "desc": "Bonus Action: roll one Psionic Energy Die and choose a number of willing creatures up to your PB that you can see. For a number of hours equal to the die result, you and those creatures can communicate telepathically within 1 mile (no line of sight required)."
  },
  {
    "name": "Homing Strikes",
    "icon": "",
    "cat": "attack",
    "uses": "1 Psionic Die",
    "resKey": "psionic_dice",
    "minLevel": 9,
    "desc": "Before you make an attack roll with your Psychic Blades, roll one Psionic Energy Die and add the result to the attack roll. If the attack misses, the die is not expended."
  },
  {
    "name": "Psychic Teleportation",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Psionic Die",
    "resKey": "psionic_dice",
    "minLevel": 9,
    "desc": "Bonus Action: manifest your Psychic Blades and expend one Psionic Energy Die. Roll the die and teleport up to (result × 5) feet to an unoccupied space you can see. The blade then disappears."
  },
  {
    "name": "Psychic Veil",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "psychic_veil",
    "minLevel": 13,
    "desc": "Action: cast Invisibility on yourself without expending a spell slot. The effect ends early if you attack, deal damage, or force a saving throw. You can also expend one Psionic Energy Die to cast it again before finishing a Long Rest. Recharge: Long Rest."
  },
  {
    "name": "Rend Mind",
    "icon": "",
    "cat": "attack",
    "uses": "3 Psionic Dice",
    "resKey": "psionic_dice",
    "minLevel": 17,
    "desc": "When you deal Sneak Attack damage with your Psychic Blades, you can expend 3 Psionic Energy Dice to stun the target. It must make a WIS save (DC = 8 + PB + DEX). On failure: the target is Stunned until the end of your next turn."
  }
]);
registerSubclassSheetResources("Rogue_Soulknife", [
  {
    "key": "psionic_dice",
    "name": "Psionic Energy Dice",
    "icon": "brain",
    "recharge": "LR",
    "max": (lv) => lv >= 17 ? 6 : lv >= 13 ? 5 : lv >= 9 ? 4 : lv >= 5 ? 3 : 2
  },
  {
    "key": "psychic_veil",
    "name": "Psychic Veil",
    "icon": "eye-off",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
