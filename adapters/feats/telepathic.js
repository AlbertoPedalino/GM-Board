import { registerFeatAdapter, registerFeatSheetActions, registerFeatSheetResources } from '../registry.js';
registerFeatAdapter("Telepathic", function (feat) {
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

registerFeatSheetResources("Telepathic", [
      {
        key: "telepathic_detect_thoughts",
        name: "Detect Thoughts",
        icon: "brain",
        recharge: "LR",
        max: function () { return 1; }
      }
    ]);

registerFeatSheetActions("Telepathic", [
      {
        name: "Telepathic Speech",
        icon: "message-circle",
        cat: "action",
        uses: "Passive",
        desc: "You can speak telepathically to any creature within 60 ft that you can see. The creature understands you only if you share a language. You can't receive thoughts this way."
      },
      {
        name: "Detect Thoughts",
        icon: "brain",
        cat: "action",
        resKey: "telepathic_detect_thoughts",
        desc: "Cast Detect Thoughts once per Long Rest without a spell slot. You can also cast it using spell slots. Spellcasting ability is your chosen ability."
      }
    ]);
