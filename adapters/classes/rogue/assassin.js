import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetProficiencies } from '../../registry.js';

registerSubclassAdapter("Rogue_Assassin", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Rogue_Assassin", [
  {
    "name": "Assassin's Tools",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: you gain a Disguise Kit and a Poisoner's Kit, and you have proficiency with both."
  },
  {
    "name": "Assassinate",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Passive: you have Advantage on Initiative rolls. During the first round of each combat, you have Advantage on attack rolls against any creature that hasn't taken a turn. If your Sneak Attack hits any target during that first round, the target takes extra damage of the weapon's type equal to your Rogue level."
  },
  {
    "name": "Infiltration Expertise",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 9,
    "desc": "Passive: you can unerringly mimic another person's speech, handwriting, or both if you have spent at least 1 hour studying them. Additionally, your Speed is not reduced to 0 by using Steady Aim."
  },
  {
    "name": "Envenom Weapons",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 13,
    "desc": "Passive upgrade to Cunning Strike — Poison option: when you use the Poison option of your Cunning Strike, the target also takes 2d6 Poison damage whenever it fails the saving throw. This damage ignores Resistance to Poison damage."
  },
  {
    "name": "Death Strike",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 17,
    "desc": "Passive: when you hit with your Sneak Attack on the first round of a combat, the target must succeed on a CON saving throw (DC = 8 + PB + DEX modifier). On a failure, the attack's damage is doubled against the target."
  }
]);
registerSubclassSheetProficiencies("Rogue_Assassin", [
  { type: "tool", values: ["Disguise Kit", "Poisoner's Kit"], minLevel: 3 }
]);
// [SheetRuntime] END
