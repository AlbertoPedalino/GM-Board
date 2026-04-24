registerSubclassAdapter("Rogue_Arcane Trickster", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_at_cantrip_1',
      label: 'Arcane Trickster — Cantrip Wizard 1',
      type: 'spell_choice',
      spellFilter: { spellLevel: 0, classes: ['Wizard'] },
      count: 1,
      level: 3
    });
    specs.push({
      key: 'subclass_at_cantrip_2',
      label: 'Arcane Trickster — Cantrip Wizard 2',
      type: 'spell_choice',
      spellFilter: { spellLevel: 0, classes: ['Wizard'] },
      count: 1,
      level: 3
    });
  }
});
// Assassin (XPHB): Assassinate, Assassin's Tools, Infiltration Expertise — tutto passivo.
registerSubclassAdapter("Rogue_Assassin", function (cls, lv, specs) {});
// Soulknife (XPHB): Psionic Power, Psychic Blades, Soul Blades — tutto passivo.
registerSubclassAdapter("Rogue_Soulknife", function (cls, lv, specs) {});
// Thief (XPHB): Fast Hands, Second-Story Work, Supreme Sneak, Use Magic Device — tutto passivo.
registerSubclassAdapter("Rogue_Thief", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Rogue_Assassin", [
  {
    "name": "Assassinate",
    "icon": "",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 3,
    "desc": "Advantage on all attacks against creatures that have not yet acted in combat. Attacks against unaware creatures that result in a hit are automatic critical hits."
  }
]);
registerSubclassSheetActions("Rogue_Soulknife", [
  {
    "name": "Psychic Blades",
    "icon": "",
    "cat": "attack",
    "uses": "Psychic",
    "minLevel": 3,
    "desc": "Materialize psychic blades (finesse, throwable): 1d6 psychic damage + DEX. Materialize a second blade as bonus action. Blades disappear after the attack."
  }
]);
// [SheetRuntime] END
