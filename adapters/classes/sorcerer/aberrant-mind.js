import { registerSubclassAdapter, registerSubclassSheetActions, registerSubclassSheetResources } from '../../registry.js';

registerSubclassAdapter("Sorcerer_Aberrant Mind", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Sorcerer_Aberrant Mind", [
  {
    "name": "Telepathic Speech",
    "icon": "",
    "cat": "bonus",
    "uses": "At will",
    "minLevel": 3,
    "desc": "Bonus Action: choose one creature you can see within 30 ft. For a number of minutes equal to your Sorcerer level, you and the chosen creature can communicate telepathically with each other while within a number of miles equal to your CHA modifier (min 1 mile). You each must mentally use a language the other knows. Ends early if you form a connection with a different creature."
  },
  {
    "name": "Psionic Sorcery",
    "icon": "",
    "cat": "bonus",
    "uses": "Sorcery Points",
    "resKey": "sorc_pts",
    "minLevel": 6,
    "desc": "When you cast any level 1+ spell from your Psionic Spells feature, you can cast it by spending Sorcery Points equal to the spell's level instead of expending a spell slot. If you cast the spell using Sorcery Points, it requires no Verbal, Somatic, or Material components unless the components are consumed by the spell or have a specified cost."
  },
  {
    "name": "Psychic Defenses",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "Passive: Resistance to Psychic damage. Advantage on saving throws to avoid or end the Charmed or Frightened condition."
  },
  {
    "name": "Revelation in Flesh",
    "icon": "",
    "cat": "bonus",
    "uses": "1+ Sorcery Points",
    "resKey": "sorc_pts",
    "minLevel": 14,
    "desc": "Bonus Action: spend 1 or more Sorcery Points. For each SP spent, gain one benefit (stackable) for 10 minutes: Swim Speed equal to 2× your Speed + breathe underwater; Fly Speed equal to your Speed with Hover; see Invisible creatures within 60 ft that aren't behind Total Cover; move through spaces as narrow as 1 inch and spend 5 ft of movement to escape nonmagical restraints or the Grappled condition."
  },
  {
    "name": "Warping Implosion",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "aberrant_implosion",
    "minLevel": 18,
    "damageFormula": "3d10",
    "damageButtonLabel": ({ formula }) => `${formula} force`,
    "damageKind": "damage",
    "desc": "Magic action: teleport to an unoccupied space you can see within 120 ft. Each creature within 30 ft of the space you left must make a STR saving throw (spell save DC). On a failed save: 3d10 Force damage and pulled straight toward that space (ending in nearest unoccupied space). On success: half damage only. 1/LR, or spend 5 Sorcery Points (no action) to restore this use."
  }
]);
registerSubclassSheetResources("Sorcerer_Aberrant Mind", [
  {
    "key": "aberrant_implosion",
    "name": "Warping Implosion",
    "icon": "zap",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
