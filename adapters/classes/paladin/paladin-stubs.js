// Oath of Devotion (XPHB): Sacred Weapon, Turn the Unholy, Aura of Devotion, Holy Nimbus — tutto passivo/CD.
registerSubclassAdapter("Paladin_Devotion", function (cls, lv, specs) {});
// Oath of the Ancients (XPHB): Nature's Wrath, Turn the Faithless, Aura of Warding, Undying Sentinel — tutto passivo/CD.
registerSubclassAdapter("Paladin_Ancients", function (cls, lv, specs) {});
// Oath of Glory (XPHB): Inspiring Smite, Peerless Athlete, Aura of Alacrity, Glorious Defense — tutto passivo/CD.
registerSubclassAdapter("Paladin_Glory", function (cls, lv, specs) {});
// Oath of Vengeance (XPHB): Vow of Enmity, Abjure the Extraplanar, Soul of Vengeance, Avenging Angel — tutto passivo/CD.
registerSubclassAdapter("Paladin_Vengeance", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Paladin_Devotion", [
  {
    "name": "Channel: Sacred Weapon",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Bonus action: infuse your held weapon for 1 minute. Add CHA mod to attack rolls (min +1). The weapon sheds bright light in a 20-ft radius."
  }
]);
registerSubclassSheetActions("Paladin_Vengeance", [
  {
    "name": "Channel: Vow of Enmity",
    "icon": "",
    "cat": "bonus",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Bonus action: advantage on all attacks against one visible creature within 10 ft for 1 minute (or until it dies or hides)."
  }
]);
registerSubclassSheetActions("Paladin_Ancients", [
  {
    "name": "Channel: Nature's Wrath",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Fey and Celestials within 30 ft regain 2d6+CHA HP. Undead and Fiends must succeed on a WIS save (DC=8+PB+CHA) or be Frightened for 1 minute."
  }
]);
registerSubclassSheetActions("Paladin_Glory", [
  {
    "name": "Channel: Gift of the Brave",
    "icon": "",
    "cat": "action",
    "uses": "1 Channel",
    "resKey": "paladin_channel_div",
    "desc": "Chosen creatures within 30 ft gain for 1 minute: +PB to Athletics/Acrobatics checks, +10 ft movement speed."
  }
]);
// [SheetRuntime] END
