import { registerSubclassAdapter, registerSubclassSheetActions } from '../../registry.js';

registerSubclassAdapter("Fighter_Eldritch Knight", function (cls, lv, specs) {
  if (lv >= 3) {
    specs.push({
      key: 'subclass_ek_cantrip_1',
      label: 'Eldritch Knight — Cantrip Wizard 1',
      type: 'spell_choice',
      spellFilter: { spellLevel: 0, classes: ['Wizard'] },
      count: 1,
      level: 3
    });
    specs.push({
      key: 'subclass_ek_cantrip_2',
      label: 'Eldritch Knight — Cantrip Wizard 2',
      type: 'spell_choice',
      spellFilter: { spellLevel: 0, classes: ['Wizard'] },
      count: 1,
      level: 3
    });
  }
});

// [SheetRuntime] START
registerSubclassSheetActions("Fighter_Eldritch Knight", [
  { name: "War Bond", icon: "", cat: "bonus", uses: "Passive", minLevel: 3,
    desc: "Ritual (1 hour, can be done during Short Rest): magically bond with a weapon within reach. While bonded: you can't be disarmed of it unless Incapacitated; Bonus Action to summon it to your hand from anywhere on the same plane. You can have up to 2 bonded weapons but summon only one at a time. Bonding a third breaks the oldest bond." },
  { name: "War Magic", icon: "", cat: "attack", uses: "Passive", minLevel: 7,
    desc: "When you take the Attack action on your turn, you can replace one of the attacks with a casting of one of your Wizard cantrips that has a casting time of an action." },
  { name: "Eldritch Strike", icon: "", cat: "attack", uses: "Passive", minLevel: 10,
    desc: "When you hit a creature with a weapon attack, that creature has Disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn." },
  { name: "Arcane Charge", icon: "", cat: "action", uses: "Passive", minLevel: 15,
    desc: "When you use Action Surge, you can teleport up to 30 ft to an unoccupied space you can see, either before or after the additional action." },
  { name: "Improved War Magic", icon: "", cat: "action", uses: "Passive", minLevel: 18,
    desc: "When you take the Attack action on your turn, you can replace two of the attacks with a casting of one of your level 1 or level 2 Wizard spells that has a casting time of an action." },
]);
// [SheetRuntime] END
