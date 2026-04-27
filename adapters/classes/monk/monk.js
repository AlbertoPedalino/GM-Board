
registerClassAdapter("Monk", function (cls, lv, specs) {
  if (lv >= 1) {
    specs.push({
      key: 'monk_tool_proficiency',
      label: 'Tool Proficiency (Tools or Instrument)',
      type: 'generic_choice',
      from: (window._ARTISAN_TOOLS || []).concat(window._MUSICAL_INSTRUMENTS || []),
      count: 1,
      level: 1
    });
  }
  if (lv >= 19) {
    specs.push({ key: 'monk_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Monk", [
  {
    name: 'Unarmored Defense',
    icon: '',
    cat: 'action',
    uses: 'Passive',
    desc: 'While not wearing armor and not using a Shield: your AC equals 10 + DEX modifier + WIS modifier.'
  },
  {
    name: 'Unarmored Movement',
    icon: '',
    cat: 'action',
    uses: 'Passive',
    minLevel: 2,
    desc: 'Speed increases by 10 ft while not wearing armor or using a Shield (+15 at lv.6, +20 at lv.10, +25 at lv.14, +30 at lv.18). At lv.9: can move along vertical surfaces and across liquids on your turn without falling.'
  },
  {
    name: 'Martial Arts',
    icon: '',
    cat: 'attack',
    uses: 'Passive',
    damageFormula: ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      const die = lv >= 17 ? 12 : lv >= 11 ? 10 : lv >= 5 ? 8 : 6;
      return `1d${die}`;
    },
    desc: 'With Simple weapons, Monk weapons, or Unarmed Strikes: use DEX instead of STR for attack and damage. Unarmed Strike die: d6 (lv.1-4), d8 (lv.5-10), d10 (lv.11-16), d12 (lv.17-20). After the Attack action: make one Unarmed Strike as a Bonus Action (free, no Discipline Point cost).'
  },
  {
    name: 'Flurry of Blows',
    icon: '',
    cat: 'bonus',
    uses: '1 Discipline Point',
    resKey: 'ki',
    minLevel: 2,
    damageFormula: ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      const die = lv >= 17 ? 12 : lv >= 11 ? 10 : lv >= 5 ? 8 : 6;
      return `2d${die}`;
    },
    desc: 'After the Attack action, spend 1 Discipline Point to make 2 Unarmed Strikes as a Bonus Action.'
  },
  {
    name: 'Patient Defense',
    icon: '',
    cat: 'bonus',
    uses: '1 Discipline Point',
    resKey: 'ki',
    minLevel: 2,
    desc: 'Spend 1 Discipline Point (Bonus Action) to take the Dodge action.'
  },
  {
    name: 'Step of the Wind',
    icon: '',
    cat: 'bonus',
    uses: '1 Discipline Point',
    resKey: 'ki',
    minLevel: 2,
    desc: 'Spend 1 Discipline Point (Bonus Action) to take the Dash or Disengage action. Your jump distance doubles for the turn.'
  },
  {
    name: 'Deflect Attacks',
    icon: '',
    cat: 'reaction',
    uses: 'Free / 1 DP redirect',
    resKey: 'ki',
    minLevel: 3,
    damageFormula: ({ ownerLevel }) => {
      const lv = Number(ownerLevel || 1);
      const dex = typeof getMod === 'function' && typeof getFinal === 'function'
        ? Number(getMod(getFinal('dex')) || 0)
        : 0;
      const total = dex + lv;
      return `1d10${total >= 0 ? '+' : ''}${total}`;
    },
    damageKind: 'utility',
    damageButtonLabel: ({ formula }) => `${String(formula || '')} reduce`,
    rollLabelPrefix: 'Deflect Attacks',
    desc: 'Reaction when you take damage from an attack. Reduce the damage by 1d10 + DEX modifier + Monk level. If reduced to 0: you can spend 1 Discipline Point to redirect the attack as a ranged attack (20/60 ft range, damage = Martial Arts die + DEX).'
  },
  {
    name: 'Slow Fall',
    icon: '',
    cat: 'reaction',
    uses: 'Passive',
    minLevel: 4,
    desc: 'Reaction when falling: reduce falling damage by an amount equal to your Monk level x 5.'
  },
  {
    name: 'Stunning Strike',
    icon: '',
    cat: 'attack',
    uses: '1 Discipline Point',
    resKey: 'ki',
    minLevel: 5,
    desc: 'When you hit a creature with a weapon or Unarmed Strike, spend 1 Discipline Point to force a CON save (DC = 8+PB+WIS). Failure: the target has the Stunned condition until the start of your next turn.'
  },
  {
    name: 'Ki-Empowered Strikes',
    icon: '',
    cat: 'attack',
    uses: 'Passive',
    minLevel: 6,
    desc: 'Your Unarmed Strikes count as magical for the purpose of overcoming Resistance and Immunity to nonmagical attacks.'
  },
  {
    name: 'Evasion',
    icon: '',
    cat: 'reaction',
    uses: 'Passive',
    minLevel: 7,
    desc: "When you are subjected to an effect that allows a DEX save for half damage: take no damage on success, half on failure. Doesn't work if you have the Incapacitated condition."
  },
  {
    name: 'Stillness of Mind',
    icon: '',
    cat: 'action',
    uses: 'Action',
    minLevel: 8,
    desc: 'Action: end one effect on yourself causing the Charmed or Frightened condition.'
  },
  {
    name: 'Acrobatic Movement',
    icon: '',
    cat: 'action',
    uses: 'Passive',
    minLevel: 9,
    desc: 'You gain Climb Speed and Swim Speed equal to your Speed. Difficult terrain costs no extra movement.'
  },
  {
    name: 'Heightened Discipline',
    icon: '',
    cat: 'action',
    uses: 'Passive',
    minLevel: 10,
    desc: 'Your Flurry of Blows, Patient Defense, and Step of the Wind each gain a bonus effect when you spend the Discipline Point: Flurry can Stun, Patient Defense can knock Prone, Step of the Wind can Push.'
  },
  {
    name: 'Perfect Self',
    icon: '',
    cat: 'action',
    uses: 'Passive',
    minLevel: 20,
    desc: 'When you roll Initiative and have 0 Discipline Points, you regain 4 Discipline Points.'
  }
]);
registerClassSheetResources("Monk", [
  {
    key: 'ki',
    name: 'Discipline Points',
    icon: 'orbit',
    recharge: 'SR',
    max: (lv)=>lv,
    pool: true
  }
]);
// [SheetRuntime] END