registerSubclassAdapter("Sorcerer_Aberrant", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Sorcerer_Aberrant", [
  {
    "name": "Telepathic Speech",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Form a telepathic connection with a creature you can see within 30 ft. For CHA mod minutes (min 1), communicate telepathically if you share a language. Ends if either of you moves beyond 30 ft from the other."
  },
  {
    "name": "Psionic Sorcery",
    "icon": "",
    "cat": "bonus",
    "uses": "Sorcery Points",
    "resKey": "sorc_pts",
    "minLevel": 6,
    "desc": "When you cast a psionic spell from your subclass spell list, spend Sorcery Points equal to the spell's level instead of a spell slot. No verbal or somatic components required when you do so."
  },
  {
    "name": "Psychic Defenses",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "minLevel": 6,
    "desc": "Resistance to Psychic damage. Advantage on saving throws against the Charmed and Frightened conditions."
  },
  {
    "name": "Revelation in Flesh",
    "icon": "",
    "cat": "bonus",
    "uses": "1+ Sorcery Points",
    "resKey": "sorc_pts",
    "minLevel": 14,
    "desc": "Bonus Action: spend 1 or more Sorcery Points to transform for 10 minutes (1 SP each, stackable): wings (fly = walk speed), tentacles (reach +10 ft), gills (swim speed + breathe water), alien eyes (see Invisible and through darkness 60 ft)."
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
    "desc": "Action: teleport to an unoccupied space you can see within 120 ft. Each creature within 30 ft of the space you left must succeed on a STR save (spell save DC) or take 3d10 Force damage and be pulled 30 ft toward that space (half damage, not pulled on success). Recharge: Long Rest."
  }
]);
registerSubclassSheetResources("Sorcerer_Aberrant", [
  {
    "key": "aberrant_implosion",
    "name": "Warping Implosion",
    "icon": "zap",
    "recharge": "LR",
    "max": () => 1
  }
]);
// [SheetRuntime] END
