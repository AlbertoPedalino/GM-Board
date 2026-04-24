const _ARTIFICER_PLAN_POOL_LV2 = [
  'Alchemy Jug',
  'Bag of Holding',
  'Cap of Water Breathing',
  'Common magic item (non-Potion, non-Scroll, non-cursed)',
  'Goggles of Night',
  'Manifold Tool',
  'Repeating Shot',
  'Returning Weapon',
  'Rope of Climbing',
  'Sending Stones',
  'Shield +1',
  'Wand of Magic Detection',
  'Wand of Secrets',
  'Wand of the War Mage +1',
  'Weapon +1',
  'Wraps of Unarmed Power +1',
];

const _ARTIFICER_PLAN_POOL_LV6 = [
  'Armor +1',
  'Boots of Elvenkind',
  'Boots of the Winding Path',
  'Cloak of Elvenkind',
  'Cloak of the Manta Ray',
  'Dazzling Weapon',
  'Eyes of Charming',
  'Eyes of Minute Seeing',
  'Gloves of Thievery',
  'Helm of Awareness',
  'Lantern of Revealing',
  'Mind Sharpener',
  'Necklace of Adaptation',
  'Pipes of Haunting',
  'Repulsion Shield',
  'Ring of Swimming',
  'Ring of Water Walking',
  'Sentinel Shield',
  'Spell-Refueling Ring',
  'Wand of Magic Missiles',
  'Wand of Web',
  'Weapon of Warning',
];

const _ARTIFICER_PLAN_POOL_LV10 = [
  'Armor of Resistance',
  'Dagger of Venom',
  'Elven Chain',
  'Ring of Feather Falling',
  'Ring of Jumping',
  'Ring of Mind Shielding',
  'Shield +2',
  'Uncommon Wondrous Item (non-cursed)',
  'Wand of the War Mage +2',
  'Weapon +2',
  'Wraps of Unarmed Power +2',
];

const _ARTIFICER_PLAN_POOL_LV14 = [
  'Armor +2',
  'Arrow-Catching Shield',
  'Flame Tongue',
  'Rare Wondrous Item (non-cursed)',
  'Ring of Free Action',
  'Ring of Protection',
  'Ring of the Ram',
];

const _ARTIFICER_SUBCLASS_FIXED_TOOLS = {
  'Alchemist': ["Alchemist's Supplies", 'Herbalism Kit'],
  'Armorer': ["Smith's Tools"],
  'Artillerist': ["Woodcarver's Tools"],
  'Battle Smith': ["Smith's Tools"],
  'Cartographer': ["Calligrapher's Supplies", "Cartographer's Tools"],
};

function _artificerNormTool(v) {
  if (!v) return '';
  const raw = String(v)
    .replace(/\{@[a-z]+ ([^|}]+)(?:\|[^}]*)?\}/gi, '$1')
    .replace(/\{@[a-z]+\s*/gi, '')
    .replace(/[{}]/g, '')
    .split('|')[0]
    .trim();
  const lc = raw.toLowerCase();
  const alias = {
    "thieves' tools": "Thieves' Tools",
    "thieves' tool": "Thieves' Tools",
    "tinker's tools": "Tinker's Tools",
    "tinker's tool": "Tinker's Tools",
    "smith's tools": "Smith's Tools",
    "woodcarver's tools": "Woodcarver's Tools",
    "calligrapher's supplies": "Calligrapher's Supplies",
    "cartographer's tools": "Cartographer's Tools",
    "alchemist's supplies": "Alchemist's Supplies",
    "herbalism kit": "Herbalism Kit",
  };
  return alias[lc] || raw;
}

function _artificerFixedKeysFromBlock(block) {
  if (!block || typeof block !== 'object' || Array.isArray(block)) return [];
  return Object.keys(block)
    .filter(function (k) {
      return !['choose', 'any', 'anyArtisansTool', 'anyMusicalInstrument'].includes(k) && block[k] !== false;
    })
    .map(_artificerNormTool)
    .filter(Boolean);
}

function _artificerCollectKnownTools() {
  const out = new Set();
  if (typeof char === 'undefined' || !char) return out;

  const add = function (v) {
    const nv = _artificerNormTool(v);
    if (nv) out.add(nv);
  };

  const addFromToolBlocks = function (src) {
    if (!src) return;
    const arr = Array.isArray(src) ? src : [src];
    arr.forEach(function (t) {
      if (typeof t === 'string') { add(t); return; }
      _artificerFixedKeysFromBlock(t).forEach(add);
    });
  };

  const sp = char.cls?.startingProficiencies || {};
  addFromToolBlocks(sp.tools);
  addFromToolBlocks(sp.toolProficiencies);
  addFromToolBlocks(char.bgObj?.toolProficiencies);
  addFromToolBlocks(char.speciesObj?.toolProficiencies);

  Object.entries(char.choices || {}).forEach(function ([key, val]) {
    if (!val) return;
    if (!(key.toLowerCase().includes('tool') || key.toLowerCase().includes('instrument') || key.startsWith('start_tools'))) return;
    const vals = Array.isArray(val) ? val : [val];
    vals.forEach(add);
  });

  return out;
}

function _artificerGetConditionalBonusCount(requiredTools) {
  const profs = _artificerCollectKnownTools();
  let n = 0;
  (requiredTools || []).forEach(function (tool) {
    if (profs.has(_artificerNormTool(tool))) n++;
  });
  return n;
}

function _artificerPlansKnownAtLevel(level) {
  if (level < 2) return 0;
  if (level >= 18) return 8;
  if (level >= 14) return 7;
  if (level >= 10) return 6;
  if (level >= 6) return 5;
  return 4;
}

function _artificerPlanPoolForLevel(level) {
  let pool = _ARTIFICER_PLAN_POOL_LV2.slice();
  if (level >= 6) pool = pool.concat(_ARTIFICER_PLAN_POOL_LV6);
  if (level >= 10) pool = pool.concat(_ARTIFICER_PLAN_POOL_LV10);
  if (level >= 14) pool = pool.concat(_ARTIFICER_PLAN_POOL_LV14);
  return [...new Set(pool)];
}

registerClassAdapter("Artificer", function (cls, lv, specs) {
  if (lv >= 2) {
    specs.push({
      key: 'artificer_replicate_magic_item_plans',
      label: 'Replicate Magic Item (Plans Known)',
      type: 'generic_choice',
      from: _artificerPlanPoolForLevel(lv),
      count: _artificerPlansKnownAtLevel(lv),
      level: 2
    });
  }

  [4, 8, 12, 16].forEach(function (featLv) {
    if (lv >= featLv) {
      specs.push({
        key: 'artificer_feat_lv' + featLv,
        label: 'Feat (Artificer Lv.' + featLv + ')',
        type: 'feat_cat',
        categories: ['G'],
        count: 1,
        level: featLv
      });
    }
  });

  if (lv >= 19) {
    specs.push({
      key: 'artificer_epic_boon',
      label: 'Epic Boon / General Feat',
      type: 'feat_cat',
      categories: ['EB', 'G'],
      count: 1,
      level: 19
    });
  }
});
