// Eldritch Invocations XPHB 2024
const _INVOCATIONS = [
  'Agonizing Blast', 'Armor of Shadows', 'Ascendant Step',
  'Devil\'s Sight', 'Devouring Blade', 'Eldritch Mind', 'Eldritch Smite',
  'Eldritch Spear', 'Fiendish Vigor', 'Gaze of Two Minds',
  'Gift of the Depths', 'Gift of the Protectors',
  'Investment of the Chain Master', 'Lessons of the First Ones',
  'Lifedrinker', 'Mask of Many Faces', 'Master of Myriad Forms',
  'Misty Visions', 'One with Shadows', 'Otherworldly Leap',
  'Pact of the Blade', 'Pact of the Chain', 'Pact of the Tome',
  'Repelling Blast', 'Thirsting Blade', 'Visions of Distant Realms',
  'Whispers of the Grave', 'Witch Sight',
];

// Check if a character has a specific Eldritch Invocation chosen (works for both sheet C and charbuilder char)
function _warlockHasInvocation(C, name) {
  if (!C || !C.choices) return false;
  return Object.entries(C.choices).some(function(e) {
    return e[0].replace(/^mc\d+_/, '').startsWith('warlock_invocation_') &&
           String(e[1]).split('|')[0].trim() === name;
  });
}

// Progressione: [livello_acquisizione, ...]
// XPHB 2024: 10 total invocations at lv1(+1), lv2(+2), lv5(+2), lv7(+1), lv9(+1), lv12(+1), lv15(+1), lv18(+1)
const _INV_LEVELS = [1, 2, 2, 5, 5, 7, 9, 12, 15, 18];

registerClassAdapter("Warlock", function (cls, lv, specs) {
  _INV_LEVELS.forEach(function (threshold, i) {
    if (lv >= threshold) {
      specs.push({
        key: 'warlock_invocation_' + (i + 1),
        label: 'Eldritch Invocation ' + (i + 1),
        type: 'generic_choice',
        from: _INVOCATIONS,
        count: 1,
        level: threshold
      });
    }
  });

  var _charRef = (typeof char !== 'undefined' && char) ? char : null;

  // Pact of the Tome: 3 cantrips from any list
  if (_charRef && _warlockHasInvocation(_charRef, 'Pact of the Tome')) {
    [1, 2, 3].forEach(function (n) {
      specs.push({
        key: 'warlock_tome_cantrip_' + n,
        label: 'Pact of the Tome — Cantrip ' + n + ' (any list)',
        type: 'spell_choice',
        spellFilter: { spellLevel: 0, classes: null },
        count: 1,
        level: 1
      });
    });
  }

  // Lessons of the First Ones: Origin feat choice
  if (_charRef && _warlockHasInvocation(_charRef, 'Lessons of the First Ones')) {
    specs.push({
      key: 'warlock_lessons_feat',
      label: 'Lessons of the First Ones — Origin Feat',
      type: 'feat_cat',
      categories: ['O'],
      count: 1,
      level: 1
    });
  }

  if (lv >= 19) {
    specs.push({ key: 'warlock_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});

// [SheetRuntime] START
registerClassSheetActions("Warlock", [
  {
    "name": "Eldritch Invocations",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "desc": "Learn 1 invocation at lv.1 (more at odd levels). Key passive options: Agonizing Blast (add CHA to EB damage), Devil's Sight (see 120 ft in magical darkness), Eldritch Mind (Adv. on Concentration), Eldritch Spear (EB range 300 ft), Repelling Blast (push 10 ft), Witch Sight (see true forms)."
  },
  {
    "name": "Pact Magic",
    "icon": "",
    "cat": "action",
    "uses": "Passive",
    "desc": "Your spell slots recharge on a Short Rest or Long Rest. All your slots are the same level (lv.1–5, scales with Warlock level). You learn a limited number of spells from the Warlock list."
  },
  {
    "name": "Magical Cunning",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "minLevel": 2,
    "desc": "Perform esoteric rite for 1 minute. At end, regain expended Pact Magic slots up to half your maximum (round up). Once used, unavailable until Long Rest."
  },
  {
    "name": "Contact Patron",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "resKey": "contact_patron",
    "minLevel": 9,
    "desc": "You always have Contact Other Plane prepared. When you cast it, you automatically succeed on the saving throw and contact your patron (not a random planar entity). Recharge: Long Rest."
  },
  {
    "name": "Mystic Arcanum",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR each",
    "minLevel": 11,
    "desc": "A 6th-level spell known without a slot, usable once per LR (lv.11). Gain a 7th-level spell at lv.13, 8th at lv.15, 9th at lv.17. Recharge: Long Rest for each."
  },
  {
    "name": "Eldritch Master",
    "icon": "",
    "cat": "action",
    "uses": "1 / LR",
    "minLevel": 20,
    "desc": "Magical Cunning is upgraded: when you use its 1-minute ritual, you regain ALL expended Pact Magic slots (instead of half). Once per Long Rest."
  },

  // ── INVOCATIONS: other action types ───────────────────────────────────────

  {
    "name": "One with Shadows",
    "icon": "moon",
    "cat": "action",
    "uses": "Magic Action",
    "minLevel": 5,
    "condition": function(C) { return _warlockHasInvocation(C, 'One with Shadows'); },
    "desc": "While in Dim Light or Darkness, use the Magic action to become Invisible until you move, take an action, reaction, or bonus action — or until the light level changes."
  },
  {
    "name": "Gift of the Depths",
    "icon": "waves",
    "cat": "action",
    "uses": "1 / LR",
    "minLevel": 5,
    "condition": function(C) { return _warlockHasInvocation(C, 'Gift of the Depths'); },
    "desc": "Passive: swim speed = walking speed, breathe underwater. Once per Long Rest, cast Water Breathing without a slot (up to 10 willing creatures, 24 hours)."
  },
  {
    "name": "Gaze of Two Minds",
    "icon": "eye",
    "cat": "bonus",
    "uses": "Bonus Action",
    "minLevel": 5,
    "condition": function(C) { return _warlockHasInvocation(C, 'Gaze of Two Minds'); },
    "desc": "Bonus Action: touch a willing creature to perceive through its senses for 1 hour. You can perceive through it simultaneously and use its position for spells. Each new use ends the previous one."
  },

  // ── INVOCATIONS: Pact of the Blade combat upgrades ─────────────────────────

  {
    "name": "Thirsting Blade",
    "icon": "swords",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 5,
    "condition": function(C) { return _warlockHasInvocation(C, 'Thirsting Blade') && _warlockHasInvocation(C, 'Pact of the Blade'); },
    "desc": "Extra Attack: when you take the Attack action, you attack twice instead of once with your Pact Weapon. Requires Pact of the Blade."
  },
  {
    "name": "Devouring Blade",
    "icon": "swords",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 12,
    "condition": function(C) { return _warlockHasInvocation(C, 'Devouring Blade') && _warlockHasInvocation(C, 'Thirsting Blade'); },
    "desc": "Your second Pact Weapon attack (from Thirsting Blade) can target a different creature within 5 ft of the first target. Requires Thirsting Blade."
  },
  {
    "name": "Eldritch Smite",
    "icon": "zap",
    "cat": "action",
    "uses": "On Hit",
    "minLevel": 5,
    "condition": function(C) { return _warlockHasInvocation(C, 'Eldritch Smite') && _warlockHasInvocation(C, 'Pact of the Blade'); },
    "desc": "On Hit: expend a Pact Magic slot when you hit with your Pact Weapon. Deal 1d8 Force per slot level extra damage (+1d8 on a Critical Hit). The target is also knocked Prone if Large or smaller. Requires Pact of the Blade."
  },
  {
    "name": "Lifedrinker",
    "icon": "droplets",
    "cat": "attack",
    "uses": "Passive",
    "minLevel": 9,
    "condition": function(C) { return _warlockHasInvocation(C, 'Lifedrinker') && _warlockHasInvocation(C, 'Pact of the Blade'); },
    "desc": "Passive: when you hit with your Pact Weapon, deal extra Necrotic, Psychic, or Radiant damage (chosen at invocation selection) equal to your CHA modifier (min 1). Requires Pact of the Blade."
  }
]);
// [SheetRuntime] END

if (typeof registerClassAtWillSpells === 'function') {
  registerClassAtWillSpells('Warlock', [
    { invocation: 'Armor of Shadows',          spell: 'Mage Armor',      minLevel: 1  },
    { invocation: 'Fiendish Vigor',            spell: 'False Life',      minLevel: 1  },
    { invocation: 'Mask of Many Faces',        spell: 'Disguise Self',   minLevel: 1  },
    { invocation: 'Misty Visions',             spell: 'Silent Image',    minLevel: 1  },
    { invocation: 'Otherworldly Leap',         spell: 'Jump',            minLevel: 5  },
    { invocation: 'Ascendant Step',            spell: 'Levitate',        minLevel: 9  },
    { invocation: 'Master of Myriad Forms',    spell: 'Alter Self',      minLevel: 5  },
    { invocation: 'Whispers of the Grave',     spell: 'Speak with Dead', minLevel: 7  },
    { invocation: 'Visions of Distant Realms', spell: 'Arcane Eye',      minLevel: 15 },
  ]);
}

// Eldritch Blast invocation effects — adapter sets flags, sheet computes numeric values
if (typeof registerCantripDataModifier === 'function') {
  registerCantripDataModifier('Eldritch Blast', function (data, C) {
    var out = Object.assign({}, data || {});
    if (_warlockHasInvocation(C, 'Agonizing Blast')) out.dmgBonusPerBeam = 'cha';
    if (_warlockHasInvocation(C, 'Eldritch Spear'))  out.range = '300 ft';
    if (_warlockHasInvocation(C, 'Repelling Blast'))
      out.notes = (out.notes ? out.notes + ' · ' : '') + 'Push 10 ft on hit';
    return out;
  });
}

if (typeof registerWeaponAbilityOverride === 'function') {
  registerWeaponAbilityOverride({
    key: 'pact_blade',
    label: 'Patto',
    ability: 'cha',
    weaponTypes: ['M'],
    condition: function (C) {
      if (!C) return false;
      const isWarlock = C.className === 'Warlock' ||
        (C.extraClasses || []).some(function (ec) { return ec.name === 'Warlock'; });
      if (!isWarlock) return false;
      return _warlockHasInvocation(C, 'Pact of the Blade');
    }
  });
}

registerClassSheetResources("Warlock", [
  {
    "key": "magical_cunning",
    "name": "Magical Cunning",
    "icon": "sparkles",
    "actionName": "Magical Cunning",
    "recharge": "LR",
    "minLevel": 2,
    "max": function() { return 1; }
  },
  {
    "key": "contact_patron",
    "name": "Contact Patron",
    "icon": "eye",
    "recharge": "LR",
    "minLevel": 9,
    "max": function() { return 1; }
  }
]);

// Magical Cunning: when used, recover ceil(maxPactSlots / 2) pact magic slots
if (typeof registerResourceSideEffect === 'function') {
  registerResourceSideEffect('magical_cunning', function () {
    let wlv = 0;
    if (String(C?.className || '').toLowerCase() === 'warlock') wlv += C?.classLevel || C?.level || 0;
    (C?.extraClasses || []).forEach(function (ec) {
      if (String(ec?.name || '').toLowerCase() === 'warlock') wlv += ec.level || 0;
    });
    if (!wlv) return;
    const ps = (typeof PACT_SLOTS !== 'undefined') ? (PACT_SLOTS[Math.min(wlv, 20)] || { n: 0, l: 1 }) : { n: 0, l: 1 };
    if (!ps.n) return;
    const recover = Math.ceil(ps.n / 2);
    if (typeof spellSlotUsed !== 'undefined') {
      spellSlotUsed[ps.l] = Math.max(0, (spellSlotUsed[ps.l] || 0) - recover);
      localStorage.setItem('5e_slots_used', JSON.stringify(spellSlotUsed));
    }
    if (typeof renderSpellsTab === 'function') renderSpellsTab();
  });
}
