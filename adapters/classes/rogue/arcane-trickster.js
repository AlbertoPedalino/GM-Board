registerSubclassAdapter("Rogue_Arcane Trickster", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: "subclass_at_cantrip_1",
      label: "Arcane Trickster - Cantrip Wizard 1",
      type: "spell_choice",
      spellFilter: { spellLevel: 0, classes: ["Wizard"] },
      count: 1,
      level: 3
    });
    specs.push({
      key: "subclass_at_cantrip_2",
      label: "Arcane Trickster - Cantrip Wizard 2",
      type: "spell_choice",
      spellFilter: { spellLevel: 0, classes: ["Wizard"] },
      count: 1,
      level: 3
    });
  }
});

registerSubclassSheetActions("Rogue_Arcane Trickster", [
  {
    name: "Mage Hand Legerdemain",
    icon: "",
    cat: "bonus",
    uses: "At will",
    minLevel: 3,
    desc: "Your Mage Hand is improved for thievery and manipulation at range."
  }
]);
