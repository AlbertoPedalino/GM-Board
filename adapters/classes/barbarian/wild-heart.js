const _WILD_HEART_ANIMALS = ['Bear', 'Eagle', 'Elk', 'Tiger', 'Wolf'];

registerSubclassAdapter("Barbarian_Wild Heart", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_wild_heart_aspect_1',
      label: 'Bestial Soul (Wild Heart)',
      type: 'generic_choice',
      from: _WILD_HEART_ANIMALS,
      count: 1,
      level: 3
    });
  }
  if (lv >= 6) {
    specs.push({
      key: 'subclass_wild_heart_aspect_2',
      label: 'Bestial Soul Lv6 (Wild Heart)',
      type: 'generic_choice',
      from: _WILD_HEART_ANIMALS,
      count: 1,
      level: 6
    });
  }
  if (lv >= 14) {
    specs.push({
      key: 'subclass_wild_heart_aspect_3',
      label: 'Power of the Wilds (Wild Heart)',
      type: 'generic_choice',
      from: _WILD_HEART_ANIMALS,
      count: 1,
      level: 14
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Barbarian_Wild Heart", [
  {
    name: "Bestial Soul",
    icon: "",
    cat: "action",
    uses: "Passive",
    minLevel: 3,
    desc: "While Raging, gain movement/combat traits based on your animal aspect — Bear: Resistance to all damage types; Eagle: Fly Speed = walking speed, Disengage as Bonus Action; Elk: Speed +15 ft, STR save on hit or target falls Prone; Tiger: jump distance doubles, +1d6 Slashing once per turn; Wolf: Advantage on attacks against creature with ally within 5 ft."
  },
  {
    name: "Bestial Soul (lv.6)",
    icon: "",
    cat: "action",
    uses: "Passive",
    minLevel: 6,
    desc: "Improved aspect — Bear: can grapple creatures of any size; Eagle: allies within 30 ft have Advantage on PER checks; Elk: movement through occupied spaces, creatures you move through make STR save or fall Prone; Tiger: Pounce — if you move 20+ ft toward creature and hit, it makes STR save or falls Prone; Wolf: when you knock a creature Prone, it also becomes Grappled."
  },
  {
    name: "Power of the Wilds",
    icon: "",
    cat: "bonus",
    uses: "While Raging",
    minLevel: 14,
    desc: "Apex manifestation — Bear: 10-ft aura grants allies Resistance to all damage types; Eagle: Reaction to impose Disadvantage on an attack made against you; Elk: creatures you move through are hurled 10 ft away (STR save negates); Tiger: critical hit range is 18–20; Wolf: when ally hits a creature, you can use Reaction to make one melee attack against that creature."
  }
]);
// [SheetRuntime] END
