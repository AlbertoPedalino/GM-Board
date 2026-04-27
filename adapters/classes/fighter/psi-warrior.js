registerSubclassAdapter("Fighter_Psi Warrior", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Fighter_Psi Warrior", [
  {
    "name": "Psionic Strike",
    "icon": "",
    "cat": "attack",
    "uses": "1 Psi Die / turn",
    "resKey": "psi_dice",
    "minLevel": 3,
    "damageFormula": ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      const die = lv >= 17 ? 'd12' : lv >= 11 ? 'd10' : lv >= 5 ? 'd8' : 'd6';
      return `1${die}`;
    },
    "damageButtonLabel": ({ formula }) => `+${formula} psychic`,
    "damageKind": "damage",
    "rollLabelPrefix": "Psionic Strike",
    "desc": "Once per turn, after hitting with a weapon attack, expend one Psionic Energy Die and add its roll to the damage as Psychic damage. Die size: d6 (lv.3), d8 (lv.5), d10 (lv.11), d12 (lv.17). Recharge: Long Rest (or 1 die on Short Rest if you roll 20 on the die)."
  },
  {
    "name": "Telekinetic Movement",
    "icon": "",
    "cat": "action",
    "uses": "1 Psi Die",
    "resKey": "psi_dice",
    "minLevel": 3,
    "desc": "Action: expend one Psionic Energy Die to move one Large or smaller loose object or one willing creature within 30 ft up to 30 ft in any direction (including upward). The movement doesn't provoke opportunity attacks. You can sustain the movement on subsequent turns as a Bonus Action."
  },
  {
    "name": "Psi-Powered Leap",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Psi Die",
    "resKey": "psi_dice",
    "minLevel": 7,
    "desc": "Bonus Action: expend one Psionic Energy Die to gain a Fly Speed equal to twice your Speed until the end of the current turn."
  },
  {
    "name": "Telekinetic Thrust",
    "icon": "",
    "cat": "attack",
    "uses": "On Psionic Strike",
    "minLevel": 7,
    "desc": "When you deal Psionic Strike damage, the target must succeed on a STR save (DC = 8 + PB + INT) or be moved up to 10 ft in any direction of your choice and knocked Prone."
  },
  {
    "name": "Guarded Mind",
    "icon": "",
    "cat": "reaction",
    "uses": "1 Psi Die",
    "resKey": "psi_dice",
    "minLevel": 10,
    "desc": "Passive: you have Resistance to Psychic damage. Reaction: when you are forced to make an INT, WIS, or CHA saving throw, expend one Psionic Energy Die and add the result to the save."
  },
  {
    "name": "Bulwark of Force",
    "icon": "",
    "cat": "bonus",
    "uses": "1+ Psi Dice",
    "resKey": "psi_dice",
    "minLevel": 15,
    "desc": "Bonus Action: expend one Psionic Energy Die to choose up to your PB willing creatures within 30 ft (can include yourself). Each chosen creature gains Half Cover until the start of your next turn."
  },
  {
    "name": "Telekinetic Master",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "telekinetic_master",
    "minLevel": 18,
    "desc": "Action: cast Telekinesis (no spell slot required). While concentrating on it, you can make one weapon attack as a Bonus Action on each of your turns. Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Fighter_Psi Warrior", [
  {
    "key": "psi_dice",
    "name": "Psionic Energy Dice",
    "icon": "orbit",
    "recharge": "LR",
    "max": (lv) => lv >= 17 ? 6 : lv >= 13 ? 5 : lv >= 9 ? 4 : lv >= 5 ? 3 : 2
  },
  {
    "key": "telekinetic_master",
    "name": "Telekinetic Master",
    "icon": "wind",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
