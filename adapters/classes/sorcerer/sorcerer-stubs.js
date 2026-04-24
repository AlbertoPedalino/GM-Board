// Wild Magic (XPHB): Wild Magic Surge, Tides of Chaos, Spell Bombardment — tutto passivo/automatico.
registerSubclassAdapter("Sorcerer_Wild Magic", function (cls, lv, specs) {});
// Clockwork Soul (XPHB): Restore Balance, Bastion of Law, Trance of Order — tutto passivo/CD.
registerSubclassAdapter("Sorcerer_Clockwork Soul", function (cls, lv, specs) {});
// Aberrant Mind (XPHB): Psionic Spells (automatiche), Telepathic Speech, Psionic Sorcery — tutto passivo.
registerSubclassAdapter("Sorcerer_Aberrant Mind", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Sorcerer_Wild Magic", [
  {
    "name": "Wild Magic Surge",
    "icon": "",
    "cat": "action",
    "uses": "DM discretion",
    "desc": "Each time you cast a 1st-level or higher spell, the DM may have you roll a Wild Magic Surge (1d100). At lv.1 you can use Tides of Chaos for advantage on one roll (then automatic surge)."
  }
]);
// [SheetRuntime] END
