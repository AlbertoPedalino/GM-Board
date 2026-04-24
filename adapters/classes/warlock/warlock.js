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

// Progressione slot: [livello_acquisizione, ...]
const _INV_LEVELS = [1, 3, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 20];

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

  // Pact of the Tome: se scelta in una qualsiasi invocazione, aggiunge 3 cantrip da qualsiasi lista
  var _hasTome = typeof char !== 'undefined' && char.choices && Object.entries(char.choices).some(function (e) {
    return e[0].startsWith('warlock_invocation_') && e[1] === 'Pact of the Tome';
  });
  if (_hasTome) {
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

  if (lv >= 19) {
    specs.push({ key: 'warlock_epic_boon', label: 'Epic Boon', type: 'feat_cat', categories: ['EB'], count: 1, level: 19 });
  }
});
