import { createAdapterBindings } from '../../../adapterBindings.js';

export default function install(registry, context = {}) {
  const {
    SKILLS,
    _ARTISAN_TOOLS,
    _MUSICAL_INSTRUMENTS,
    _GAMING_SETS,
    _VEHICLE_TOOLS,
    _STD_LANGS,
    _EXOTIC_LANGS,
    _ALL_LANGS,
    _ALL_TOOLS,
    allItemsDb,
    registerClassAdapter,
    getClassAdapter,
    registerSubclassAdapter,
    getSubclassAdapter,
    registerSpeciesAdapter,
    getSpeciesAdapter,
    registerFeatAdapter,
    getFeatAdapter,
    registerClassSheetActions,
    getClassSheetActions,
    registerSubclassSheetActions,
    getSubclassSheetActions,
    registerSpeciesSheetActions,
    getSpeciesSheetActions,
    registerFeatSheetActions,
    getFeatSheetActions,
    registerClassSheetResources,
    getClassSheetResources,
    registerSubclassSheetResources,
    getSubclassSheetResources,
    registerSpeciesSheetResources,
    getSpeciesSheetResources,
    registerFeatSheetResources,
    getFeatSheetResources,
    registerClassSheetEffects,
    getClassSheetEffects,
    registerSubclassSheetEffects,
    getSubclassSheetEffects,
    registerSpeciesSheetEffects,
    getSpeciesSheetEffects,
    registerFeatSheetEffects,
    getFeatSheetEffects,
    registerClassRuntimeConfig,
    getClassRuntimeConfig,
    registerSubclassRuntimeConfig,
    getSubclassRuntimeConfig,
    registerSpeciesRuntimeConfig,
    getSpeciesRuntimeConfig,
    registerClassSheetChoiceMeta,
    getClassSheetChoiceMeta,
    registerSubclassSheetChoiceMeta,
    getSubclassSheetChoiceMeta,
    registerSpeciesSheetChoiceMeta,
    getSpeciesSheetChoiceMeta,
    registerClassSheetCommonChoiceMeta,
    registerSubclassSheetCommonChoiceMeta,
    registerSpeciesSheetCommonChoiceMeta,
    registerItemFlagDef,
    getItemFlagDef,
    getAllItemFlagDefs,
    registerWeaponAbilityOverride,
    getWeaponAbilityOverrides,
    registerClassSheetFeatureFilter,
    getClassSheetFeatureFilters,
    registerSubclassSheetFeatureFilter,
    getSubclassSheetFeatureFilters,
    registerSpeciesSheetFeatureFilter,
    getSpeciesSheetFeatureFilters,
    registerClassSheetProficiencies,
    getClassSheetProficiencies,
    registerSubclassSheetProficiencies,
    getSubclassSheetProficiencies,
    registerSpeciesSheetProficiencies,
    getSpeciesSheetProficiencies,
    registerClassSheetSpellModifiers,
    getClassSheetSpellModifiers,
    registerSubclassSheetSpellModifiers,
    getSubclassSheetSpellModifiers,
    registerSpeciesSheetSpellModifiers,
    getSpeciesSheetSpellModifiers,
    registerClassChoiceKeyFilter,
    getClassChoiceKeyFilter,
    registerClassChoiceLabelProvider,
    getClassChoiceLabelProvider,
    registerSpeciesSheetHpBonus,
    getSpeciesSheetHpBonus,
    registerClassAtWillSpells,
    getClassAtWillSpells,
    registerSpeciesLongRestGrants,
    getSpeciesLongRestGrants,
    registerResourceSideEffect,
    getResourceSideEffect,
    registerSubclassChoiceDetailDataProvider,
    getSubclassChoiceDetailDataProvider,
    registerGlobalClassAdapter,
    getGlobalClassAdapters,
    registerGlobalSubclassAdapter,
    getGlobalSubclassAdapters,
    registerGlobalSpeciesAdapter,
    getGlobalSpeciesAdapters,
    registerGlobalFeatAdapter,
    getGlobalFeatAdapters,
    registerGlobalSpellAdapter,
    getGlobalSpellAdapters,
    registerGlobalItemAdapter,
    getGlobalItemAdapters,
    registerCantripData,
    getCantripData,
    registerCantripDataModifier,
    getCantripDataModifiers,
    registerSpellData,
    getSpellData,
    getGenericSpeciesChoiceSpecs,
    getGenericBackgroundChoiceSpecs,
    getGenericBackgroundChoiceMeta,
    getGenericBackgroundOriginFeat,
  } = createAdapterBindings(registry, context);
// Eldritch Invocations XPHB 2024 â€” name, minLevel, prereqInvocation, description
const _INV_DATA = [
  { name: 'Agonizing Blast', minLevel: 1, prereq: null,
    desc: 'Choose one of your known Warlock cantrips that deals damage. You can add your Charisma modifier to that spell\'s damage rolls.' },
  { name: 'Armor of Shadows', minLevel: 1, prereq: null,
    desc: 'You can cast Mage Armor on yourself at will, without expending a spell slot.' },
  { name: 'Ascendant Step', minLevel: 9, prereq: null,
    desc: 'Prerequisite: Warlock 9\n\nYou can cast Levitate on yourself at will, without expending a spell slot.' },
  { name: 'Devil\'s Sight', minLevel: 1, prereq: null,
    desc: 'You can see normally in Darknessâ€”both magical and nonmagicalâ€”to a distance of 120 feet.' },
  { name: 'Devouring Blade', minLevel: 12, prereq: 'Thirsting Blade',
    desc: 'Prerequisite: Warlock 12, Thirsting Blade\n\nThe Extra Attack of your Thirsting Blade invocation confers two Extra Attacks rather than one. Once per turn when you hit a creature with your pact weapon, you can move up to 10 feet toward a different creature without provoking Opportunity Attacks.' },
  { name: 'Eldritch Mind', minLevel: 1, prereq: null,
    desc: 'You have Advantage on Constitution saving throws that you make to maintain Concentration.' },
  { name: 'Eldritch Smite', minLevel: 5, prereq: 'Pact of the Blade',
    desc: 'Prerequisite: Warlock 5, Pact of the Blade\n\nOnce per turn when you hit a creature with your pact weapon, you can expend a Pact Magic spell slot to deal an extra 1d8 Force damage to the target, plus another 1d8 per level of the slot, and you can give the target the Prone condition if it is Huge or smaller.' },
  { name: 'Eldritch Spear', minLevel: 1, prereq: null,
    desc: 'Choose one of your known Warlock cantrips that deals damage and has a range of 10 feet or greater. When you cast that spell, its range increases by a number of feet equal to 30 times your Warlock level.' },
  { name: 'Fiendish Vigor', minLevel: 1, prereq: null,
    desc: 'You can cast False Life on yourself at will, without expending a spell slot. When you cast it this way, you automatically get the highest number of Temporary Hit Points possible from the spell.' },
  { name: 'Gaze of Two Minds', minLevel: 5, prereq: null,
    desc: 'Prerequisite: Warlock 5\n\nYou can use a Bonus Action to touch a willing creature and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection. While perceiving through the other creature\'s senses, you benefit from any special senses possessed by that creature, and you are Blinded and Deafened with regard to your own surroundings.' },
  { name: 'Gift of the Depths', minLevel: 5, prereq: null,
    desc: 'Prerequisite: Warlock 5\n\nYou can breathe underwater, and you have a Swim Speed equal to your Speed. You can also cast Water Breathing once without expending a spell slot. You regain the ability to cast it this way when you finish a Long Rest.' },
  { name: 'Gift of the Protectors', minLevel: 9, prereq: 'Pact of the Tome',
    desc: 'Prerequisite: Warlock 9, Pact of the Tome\n\nA new page appears in your Book of Shadows. With your permission, a creature can use its action to write its name on that page, which can contain a number of names equal to your Proficiency Bonus. When any creature whose name is on the page is reduced to 0 Hit Points but not killed outright, the creature magically drops to 1 Hit Point instead. Once this magic is triggered, no creature can benefit from it until you finish a Long Rest.' },
  { name: 'Investment of the Chain Master', minLevel: 5, prereq: 'Pact of the Chain',
    desc: 'Prerequisite: Warlock 5, Pact of the Chain\n\nWhen you cast Find Familiar, you infuse the summoned familiar with eldritch power, granting it: Fly or Swim Speed 40 ft; you can command it to Attack as a Bonus Action; its attacks are magical; it uses your spell save DC; when it takes damage you can use your Reaction to grant it Resistance.' },
  { name: 'Lessons of the First Ones', minLevel: 1, prereq: null,
    desc: 'You have received knowledge from an elder entity of the multiverse, granting you the ability to take one Origin feat of your choice. This invocation can be taken more than once.' },
  { name: 'Lifedrinker', minLevel: 9, prereq: 'Pact of the Blade',
    desc: 'Prerequisite: Warlock 9, Pact of the Blade\n\nOnce per turn when you hit a creature with your pact weapon, you can deal an extra 1d6 Necrotic, Psychic, or Radiant damage (your choice when you take this invocation) to the creature, and you can expend one of your Hit Point Dice to roll it and regain a number of Hit Points equal to the roll plus your Constitution modifier (minimum 1).' },
  { name: 'Mask of Many Faces', minLevel: 1, prereq: null,
    desc: 'You can cast Disguise Self at will, without expending a spell slot.' },
  { name: 'Master of Myriad Forms', minLevel: 5, prereq: null,
    desc: 'Prerequisite: Warlock 5\n\nYou can cast Alter Self at will, without expending a spell slot.' },
  { name: 'Misty Visions', minLevel: 1, prereq: null,
    desc: 'You can cast Silent Image at will, without expending a spell slot.' },
  { name: 'One with Shadows', minLevel: 5, prereq: null,
    desc: 'Prerequisite: Warlock 5\n\nWhile you are in an area of Dim Light or Darkness, you can use a Magic action to give yourself the Invisible condition until you move or take an action, a Bonus Action, or a Reaction.' },
  { name: 'Otherworldly Leap', minLevel: 5, prereq: null,
    desc: 'Prerequisite: Warlock 5\n\nYou can cast Jump on yourself at will, without expending a spell slot.' },
  { name: 'Pact of the Blade', minLevel: 1, prereq: null,
    desc: 'As a Bonus Action, you can conjure a pact weapon in your handâ€”a Simple or Martial weapon of your choiceâ€”or create a bond with a magic weapon you touch. Until the bond ends, you have proficiency with the weapon, and you can use it as a spellcasting focus. Whenever you attack with the bonded weapon, you can use your Charisma modifier for attack and damage rolls and cause it to deal Necrotic, Psychic, or Radiant damage.' },
  { name: 'Pact of the Chain', minLevel: 1, prereq: null,
    desc: 'You learn the Find Familiar spell and can cast it as a Magic action without expending a spell slot. You can communicate telepathically with your familiar and perceive through its senses. When you take the Attack action, you can forgo one of your attacks to allow your familiar to make one attack with its Reaction.' },
  { name: 'Pact of the Tome', minLevel: 1, prereq: null,
    desc: 'Your Book of Shadows functions as a spellcasting focus for your Warlock spells. The book holds 3 cantrips from any class\'s spell list that you can cast at will; they don\'t count against your cantrips known.' },
  { name: 'Repelling Blast', minLevel: 1, prereq: null,
    desc: 'Choose one of your known Warlock cantrips that deals damage. When you hit a creature with that spell, you can push the creature up to 10 feet straight away from you.' },
  { name: 'Thirsting Blade', minLevel: 5, prereq: 'Pact of the Blade',
    desc: 'Prerequisite: Warlock 5, Pact of the Blade\n\nYou gain the Extra Attack feature for your pact weapon only. With that feature, you can attack twice with the pact weapon instead of once when you take the Attack action on your turn.' },
  { name: 'Visions of Distant Realms', minLevel: 15, prereq: null,
    desc: 'Prerequisite: Warlock 15\n\nYou can cast Arcane Eye at will, without expending a spell slot.' },
  { name: 'Whispers of the Grave', minLevel: 7, prereq: null,
    desc: 'Prerequisite: Warlock 7\n\nYou can cast Speak with Dead at will, without expending a spell slot.' },
  { name: 'Witch Sight', minLevel: 15, prereq: null,
    desc: 'Prerequisite: Warlock 15\n\nYou have Truesight with a range of 30 feet.' },
];

// Quick lookup: name â†’ description
const _INV_DESCS = {};
_INV_DATA.forEach(function(inv) { _INV_DESCS[inv.name] = inv.desc; });

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
      // Each slot shows only invocations available at its unlock level
      var slotInvocations = _INV_DATA
        .filter(function(inv) { return threshold >= inv.minLevel; })
        .map(function(inv) { return inv.name; });
      specs.push({
        key: 'warlock_invocation_' + (i + 1),
        label: 'Eldritch Invocation ' + (i + 1) + ' (Lv. ' + threshold + ')',
        type: 'generic_choice',
        from: slotInvocations,
        count: 1,
        level: threshold,
        descMap: _INV_DESCS
      });
    }
  });

  var _charRef = (typeof char !== 'undefined' && char) ? char : null;

  // Pact of the Tome: 3 cantrips from any list
  if (_charRef && _warlockHasInvocation(_charRef, 'Pact of the Tome')) {
    [1, 2, 3].forEach(function (n) {
      specs.push({
        key: 'warlock_tome_cantrip_' + n,
        label: 'Pact of the Tome â€” Cantrip ' + n + ' (any list)',
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
      label: 'Lessons of the First Ones â€” Origin Feat',
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
    "desc": "Your spell slots recharge on a Short Rest or Long Rest. All your slots are the same level (lv.1â€“5, scales with Warlock level). You learn a limited number of spells from the Warlock list."
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

  // â”€â”€ INVOCATIONS: other action types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    "name": "One with Shadows",
    "icon": "moon",
    "cat": "action",
    "uses": "Magic Action",
    "minLevel": 5,
    "condition": function(C) { return _warlockHasInvocation(C, 'One with Shadows'); },
    "desc": "While in Dim Light or Darkness, use the Magic action to become Invisible until you move, take an action, reaction, or bonus action â€” or until the light level changes."
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

  // â”€â”€ INVOCATIONS: Pact of the Blade combat upgrades â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// Pact Weapon: unified via `pactWeapon` item flag. Weapon override `pact_blade` binds to it.
if (typeof registerItemFlagDef === 'function') {
  registerItemFlagDef("pactWeapon", {
    label: "Pact Weapon",
    icon: "swords",
    types: ['M', 'R'],
    maxCount: 1,
    requireClass: "Warlock",
    requireInvocation: "Pact of the Blade",
  });
}

// Sheet effects driven by Eldritch Invocations (free-form choice keys â†’ use condition fn)
registerClassSheetEffects("Warlock", [
  { type: "sense", senseType: "truesight", value: 30, minLevel: 15,
    note: "Witch Sight",
    condition: function(C){ return _warlockHasInvocation(C, "Witch Sight"); } },
  { type: "sense", senseType: "darkvision", value: 120, minLevel: 1,
    note: "Devil's Sight (sees through magical darkness)",
    condition: function(C){ return _warlockHasInvocation(C, "Devil's Sight"); } },
  { type: "advantage", target: "save", ability: "con", minLevel: 1,
    note: "Eldritch Mind (Concentration saves)",
    condition: function(C){ return _warlockHasInvocation(C, "Eldritch Mind"); } },
]);

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

// Eldritch Blast invocation effects â€” adapter sets flags, sheet computes numeric values
if (typeof registerCantripDataModifier === 'function') {
  registerCantripDataModifier('Eldritch Blast', function (data, C) {
    var out = Object.assign({}, data || {});
    if (_warlockHasInvocation(C, 'Agonizing Blast')) out.dmgBonusPerBeam = 'cha';
    if (_warlockHasInvocation(C, 'Eldritch Spear'))  out.range = '300 ft';
    if (_warlockHasInvocation(C, 'Repelling Blast'))
      out.notes = (out.notes ? out.notes + ' Â· ' : '') + 'Push 10 ft on hit';
    return out;
  });
}

if (typeof registerWeaponAbilityOverride === 'function') {
  registerWeaponAbilityOverride({
    key: 'pact_blade',
    label: 'Pact Weapon',
    ability: 'cha',
    grantsProficiency: true,
    weaponTypes: ['M', 'R'],
    itemFlag: 'pactWeapon',
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

}

