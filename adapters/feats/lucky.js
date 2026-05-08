import { registerFeatAdapter, registerFeatSheetActions, registerFeatSheetResources } from '../registry.js';
registerFeatAdapter("Lucky", function (feat) {
  return { ...feat, luckPoints: 3 };
});

registerFeatSheetResources("Lucky", [
  {
    key:      'lucky_points',
    name:     'Lucky',
    icon:     'clover',
    recharge: 'LR',
    max:      function () { return 3; },
  },
]);

registerFeatSheetActions("Lucky", [
  {
    name:   'Lucky',
    icon:   'clover',
    cat:    'action',
    resKey: 'lucky_points',
    desc:   'Immediately after you roll the d20 for a D20 Test, expend 1 Luck Point to gain Advantage on that roll (roll a second d20 and use either result). You can also expend a Luck Point when a creature rolls a d20 to attack you: the attacker must use the new roll.',
  },
]);
