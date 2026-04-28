registerSubclassAdapter("Barbarian_Berserker", function (cls, lv, specs) {});

// [SheetRuntime] START
registerSubclassSheetActions("Barbarian_Berserker", [
  { name: "Frenzy", icon: "", cat: "attack", uses: "With Reckless Attack", minLevel: 3,
    desc: "When you use Reckless Attack while your Rage is active, the first creature you hit on your turn with a Strength-based attack takes extra damage. Roll a number of d6s equal to your Rage Damage bonus and add them together; the extra damage has the same type as the weapon or Unarmed Strike used." },
  { name: "Mindless Rage", icon: "", cat: "action", uses: "Passive", minLevel: 6,
    desc: "You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you are Charmed or Frightened when you enter your Rage, that condition ends on you." },
  { name: "Retaliation", icon: "", cat: "reaction", uses: "Passive", minLevel: 10,
    desc: "When you take damage from a creature that is within 5 ft of you, use your Reaction to make one melee attack against that creature (weapon or Unarmed Strike)." },
  { name: "Intimidating Presence", icon: "", cat: "bonus", uses: "1 / LR or Rage use", resKey: "barb_intimidating", minLevel: 14,
    desc: "Bonus Action: each creature of your choice in a 30-ft Emanation from you must make a WIS save (DC = 8 + STR mod + PB). On a failed save, the creature has the Frightened condition for 1 minute; it repeats the save at the end of each of its turns, ending the effect on a success. 1/LR, or expend a use of your Rage (no action) to restore." },
]);
registerSubclassSheetResources("Barbarian_Berserker", [
  { key: "barb_intimidating", name: "Intimidating Presence", icon: "skull", recharge: "LR", max: () => 1 },
]);
// [SheetRuntime] END
