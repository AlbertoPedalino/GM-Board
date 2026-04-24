// College of Dance (XPHB): no player choices needed.
registerSubclassAdapter("Bard_Dance", function (cls, lv, specs) {});

registerSubclassSheetActions("Bard_Dance", [
  { name: "Dazzling Footwork",  icon: "", cat: "action",   uses: "Passive",          minLevel: 3,
    desc: "While not wearing armor or wielding a Shield: AC = 10 + DEX mod + CHA mod. You gain Performance proficiency. When you make a DEX saving throw, you can use your Reaction to add your CHA modifier to the roll." },
  { name: "Inspiring Movement", icon: "", cat: "reaction", uses: "With Bardic Insp.", minLevel: 6,
    desc: "When an enemy you can see ends its turn within 5 ft of an ally within 60 ft of you, use your Reaction and expend one Bardic Inspiration: move that ally up to half their Speed. This movement doesn't provoke Opportunity Attacks." },
  { name: "Tandem Footwork",    icon: "", cat: "bonus",    uses: "With Bardic Insp.", minLevel: 10,
    desc: "When you roll Initiative, expend one Bardic Inspiration (no action required): roll the die and give that bonus to a number of creatures within 60 ft (other than yourself) equal to your CHA modifier (min 1). A creature benefits from only one such bonus per Initiative." },
  { name: "Irresistible Dance", icon: "", cat: "action",   uses: "Bardic Insp.",     minLevel: 14,
    desc: "Action: expend one Bardic Inspiration, target one creature within 30 ft. It must succeed on a WIS save (DC = spell save DC) or be forced to dance until the end of your next turn: Speed 0, no Reactions, spends all movement dancing randomly." },
]);

// College of Glamour (XPHB): Mantle of Majesty and Unbreakable Majesty are 1/LR tracked resources.
registerSubclassAdapter("Bard_Glamour", function (cls, lv, specs) {});

registerSubclassSheetActions("Bard_Glamour", [
  { name: "Mantle of Inspiration",   icon: "", cat: "bonus",   uses: "With Bardic Insp.", minLevel: 3,
    desc: "Bonus Action: expend one Bardic Inspiration. Choose up to CHA mod creatures within 60 ft. Each gains temp HP equal to the Bardic Inspiration die roll and can use its Reaction to move up to its Speed without provoking OA." },
  { name: "Enthralling Performance", icon: "", cat: "action",  uses: "1 min perf / SR",   minLevel: 6,
    desc: "After performing for at least 1 minute, choose up to CHA mod humanoids within 60 ft who watched. Each must succeed on a WIS save (DC = spell save DC) or be charmed by you for 1 hour, idolizing you." },
  { name: "Mantle of Majesty",       icon: "", cat: "bonus",   uses: "1 / LR", resKey: "glamour_majesty",     minLevel: 10,
    desc: "Bonus Action (Concentration, 1 min): assume unearthly beauty. Each turn you can cast Command as a Bonus Action for free. Creatures charmed by you auto-fail the save." },
  { name: "Unbreakable Majesty",     icon: "", cat: "bonus",   uses: "1 / LR", resKey: "glamour_unbreakable", minLevel: 14,
    desc: "Bonus Action (Concentration, 1 min): become magically majestic. The first time each turn a creature attacks you, it must succeed on a CHA save (DC = spell save DC) or redirect the attack to another target (wasted if none)." },
]);

registerSubclassSheetResources("Bard_Glamour", [
  { key: 'glamour_majesty',     name: 'Mantle of Majesty',   icon: 'crown',  recharge: 'LR', actionName: 'Mantle of Majesty',   max: () => 1 },
  { key: 'glamour_unbreakable', name: 'Unbreakable Majesty', icon: 'shield', recharge: 'LR', actionName: 'Unbreakable Majesty', max: () => 1 },
]);

// College of Valor (XPHB): Combat Inspiration, Extra Attack, Battle Magic.
registerSubclassAdapter("Bard_Valor", function (cls, lv, specs) {});

registerSubclassSheetActions("Bard_Valor", [
  { name: "Combat Inspiration", icon: "", cat: "reaction", uses: "With Bardic Insp.", minLevel: 3,
    desc: "Bardic Inspiration dice given to allies can also be used to: add the die to a weapon damage roll after hitting, or add the die to AC as a Reaction against a specific attack (declared before the roll)." },
  { name: "Extra Attack",       icon: "", cat: "attack",   uses: "Passive",           minLevel: 6,
    desc: "You can attack twice, instead of once, whenever you take the Attack action on your turn." },
  { name: "Battle Magic",       icon: "", cat: "bonus",    uses: "After casting spell", minLevel: 14,
    desc: "When you use your action to cast a Bard spell, you can make one weapon attack as a Bonus Action." },
]);
