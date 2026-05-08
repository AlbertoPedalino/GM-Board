import { registerFeatAdapter, registerFeatSheetActions } from '../registry.js';
registerFeatAdapter("Telekinetic", function (feat) {
      return {
        ...feat,
        choiceUi: {
          ...(feat.choiceUi && typeof feat.choiceUi === "object" ? feat.choiceUi : {}),
          spellAbility: {
            keySuffix: "spell_ability",
            label: "Spellcasting Ability",
            options: [
              { value: "int", label: "Intelligence" },
              { value: "wis", label: "Wisdom" },
              { value: "cha", label: "Charisma" }
            ]
          }
        }
      };
    });

registerFeatSheetActions("Telekinetic", [
      {
        name: "Telekinetic Shove",
        icon: "hand",
        cat: "action",
        uses: "Bonus Action",
        desc: "Target one creature within 30 ft that you can see. It must succeed on a Strength saving throw (DC = 8 + PB + spellcasting modifier) or be moved 5 ft in any direction. The creature can choose to fail."
      },
      {
        name: "Mage Hand (Telekinetic)",
        icon: "sparkles",
        cat: "action",
        uses: "Passive",
        desc: "You learn the Mage Hand cantrip. The hand is invisible, has range 60 ft, and you can use it as a Bonus Action. The spell's spellcasting ability is your chosen ability."
      }
    ]);
