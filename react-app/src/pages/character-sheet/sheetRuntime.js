export const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
export const SLBL = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
export const FULL_LBL = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const CONDITION_OPTIONS = [
  { key: 'blinded', label: 'Blinded', icon: 'eye-off' },
  { key: 'charmed', label: 'Charmed', icon: 'heart' },
  { key: 'deafened', label: 'Deafened', icon: 'ear' },
  { key: 'frightened', label: 'Frightened', icon: 'ghost' },
  { key: 'grappled', label: 'Grappled', icon: 'hand' },
  { key: 'incapacitated', label: 'Incapacitated', icon: 'pause' },
  { key: 'invisible', label: 'Invisible', icon: 'circle-dashed' },
  { key: 'paralyzed', label: 'Paralyzed', icon: 'brain' },
  { key: 'petrified', label: 'Petrified', icon: 'mountain' },
  { key: 'poisoned', label: 'Poisoned', icon: 'flask-conical' },
  { key: 'prone', label: 'Prone', icon: 'arrow-down' },
  { key: 'restrained', label: 'Restrained', icon: 'link' },
  { key: 'stunned', label: 'Stunned', icon: 'zap' },
  { key: 'unconscious', label: 'Unconscious', icon: 'moon' },
  { key: 'exhaustion', label: 'Exhaustion', icon: 'battery-low' },
];

const DMGTYPE_LABELS = {
  fire: 'Fire',
  cold: 'Cold',
  lightning: 'Lightning',
  thunder: 'Thunder',
  acid: 'Acid',
  poison: 'Poison',
  psychic: 'Psychic',
  radiant: 'Radiant',
  necrotic: 'Necrotic',
  force: 'Force',
  bludgeoning: 'Bludgeoning',
  piercing: 'Piercing',
  slashing: 'Slashing',
};

const ITEM_TYPE_LABELS = {
  M: 'Melee Weapon',
  R: 'Ranged Weapon',
  LA: 'Light Armor',
  MA: 'Medium Armor',
  HA: 'Heavy Armor',
  S: 'Shield',
  G: 'Gear',
  AT: 'Tools',
  GS: 'Gaming Set',
  INS: 'Instrument',
  MNT: 'Mount',
  VEH: 'Vehicle',
  SCF: 'Spellcasting Focus',
  WD: 'Wand',
  RG: 'Ring',
  RD: 'Rod',
  ST: 'Staff',
  WI: 'Wondrous Item',
  P: 'Potion',
  SC: 'Scroll',
  $: 'Currency',
  OTH: 'Other',
  GV: 'Magic Variant',
};

const ITEM_RARITY_COLOR = {
  none: 'var(--text3)',
  common: 'var(--text2)',
  uncommon: 'var(--green)',
  rare: 'var(--blue)',
  'very rare': 'var(--purple)',
  legendary: 'var(--gold)',
  artifact: 'var(--red2)',
};

const SOURCE_LABELS = {
  XPHB: 'XPHB',
  XDMG: 'XDMG',
  FRAiF: 'FRAiF',
  FRHoF: 'FRHoF',
  EFA: 'EFA',
  DMG: 'DMG',
  PHB: 'PHB',
  XGE: 'XGE',
  TCE: 'TCE',
};

const WEAPON_PROP_LABELS = {
  F: 'Finesse',
  L: 'Light',
  H: 'Heavy',
  T: 'Thrown',
  '2H': 'Two-Handed',
  V: 'Versatile',
  A: 'Ammo.',
  REACH: 'Reach',
};

export const INVENTORY_FILTERS = [
  { key: 'all', label: 'All', icon: '' },
  { key: 'weapon', label: 'Weapons', icon: 'swords' },
  { key: 'armor', label: 'Armor', icon: 'shield' },
  { key: 'gear', label: 'Gear', icon: 'backpack' },
  { key: 'magic', label: 'Magic', icon: 'sparkles' },
];

const UNARMED_ACTION = {
  name: 'Unarmed Strike',
  icon: 'hand',
  cat: 'attack',
  desc: 'Attack with a punch, kick, or headbutt. Replaces one attack in the Attack action.',
};

export const SKILLS_LIST = [
  { n: 'Acrobatics', a: 'dex' },
  { n: 'Animal Handling', a: 'wis' },
  { n: 'Arcana', a: 'int' },
  { n: 'Athletics', a: 'str' },
  { n: 'Insight', a: 'wis' },
  { n: 'Sleight of Hand', a: 'dex' },
  { n: 'Stealth', a: 'dex' },
  { n: 'Investigation', a: 'int' },
  { n: 'Deception', a: 'cha' },
  { n: 'Perception', a: 'wis' },
  { n: 'Intimidation', a: 'cha' },
  { n: 'Medicine', a: 'wis' },
  { n: 'Nature', a: 'int' },
  { n: 'History', a: 'int' },
  { n: 'Performance', a: 'cha' },
  { n: 'Persuasion', a: 'cha' },
  { n: 'Religion', a: 'int' },
  { n: 'Survival', a: 'wis' },
];

function fbonus(n) {
  return (n >= 0 ? '+' : '') + n;
}

export function computeSaves() {
  const { getSaveBonus, hasSaveProficiency, _sheetHasNonProficientArmor, _sheetAdvFor } = window;
  if (typeof getSaveBonus !== 'function' || typeof hasSaveProficiency !== 'function') return [];

  const armorDis = typeof _sheetHasNonProficientArmor === 'function' && _sheetHasNonProficientArmor();

  return STATS.map((stat) => {
    const bonus = getSaveBonus(stat);
    const eAdv = typeof _sheetAdvFor === 'function'
      ? _sheetAdvFor({ target: 'save', ability: stat })
      : null;

    return {
      stat,
      shortLabel: SLBL[stat],
      fullLabel: FULL_LBL[stat],
      bonus,
      bonusText: fbonus(bonus),
      prof: hasSaveProficiency(stat),
      hasForcedDis: armorDis && (stat === 'str' || stat === 'dex'),
      eAdv,
    };
  });
}

export function rollSave(stat) {
  if (typeof window.rollSave === 'function') window.rollSave(stat);
}

export function computeSkills() {
  const {
    getSkillBonus,
    getSkillProficiency,
    _resolvedInventory,
    _sheetItemHasProperty,
    _sheetHasNonProficientArmor,
    _sheetClassEntities,
    _sheetGetClassRuntimeConfig,
    _sheetGetSubclassRuntimeConfig,
    _sheetAdvFor,
    skillAdv,
  } = window;

  if (typeof getSkillBonus !== 'function' || typeof getSkillProficiency !== 'function') return [];

  const inv = typeof _resolvedInventory === 'function' ? _resolvedInventory() : [];
  const equippedArmor = inv.find((i) => i.equipped && ['LA', 'MA', 'HA'].includes(i.type));
  const hasStealthDis = !!equippedArmor && (
    equippedArmor.type === 'HA' ||
    (typeof _sheetItemHasProperty === 'function' && _sheetItemHasProperty(equippedArmor, ['S', 'stealth', 'disadvantage']))
  );
  const armorTrainingDis = typeof _sheetHasNonProficientArmor === 'function' && _sheetHasNonProficientArmor();

  const isJoat = typeof _sheetClassEntities === 'function'
    && _sheetClassEntities().some((ent) => {
      const classMin = Number(_sheetGetClassRuntimeConfig?.(ent.className)?.skillRules?.jackOfAllTradesMinLevel || 0);
      const subMin = Number(_sheetGetSubclassRuntimeConfig?.(ent.className, ent.subclassShortName)?.skillRules?.jackOfAllTradesMinLevel || 0);
      return (classMin > 0 && ent.level >= classMin) || (subMin > 0 && ent.level >= subMin);
    });

  return SKILLS_LIST.map((sk) => {
    const bonus = getSkillBonus(sk);
    const ptype = getSkillProficiency(sk.n);
    const dotCls = ptype === 'exp'
      ? 'exp'
      : ptype === 'prof'
      ? 'prof'
      : isJoat && !ptype
      ? 'joat'
      : '';

    const userAdv = (skillAdv && skillAdv[sk.n]) || null;
    const armorDis = hasStealthDis && sk.n === 'Stealth';
    const trainingDis = armorTrainingDis && (sk.a === 'str' || sk.a === 'dex');
    const forcedDis = armorDis || trainingDis;

    const eAdvSkill = typeof _sheetAdvFor === 'function' ? _sheetAdvFor({ target: 'skill', skill: sk.n }) : null;
    const eAdvCheck = typeof _sheetAdvFor === 'function' ? _sheetAdvFor({ target: 'check', ability: sk.a }) : null;
    const eAdv = eAdvSkill || eAdvCheck;

    let baseAdv = userAdv;
    if (!baseAdv && eAdv === 'adv') baseAdv = 'adv';
    else if (!baseAdv && eAdv === 'disadv') baseAdv = 'disadv';
    const effectiveAdv = forcedDis ? (baseAdv === 'adv' ? '' : 'disadv') : (baseAdv || '');

    return {
      name: sk.n,
      ability: sk.a,
      abilityLabel: SLBL[sk.a],
      bonus,
      bonusText: fbonus(bonus),
      dotCls,
      userAdv,
      featureAdv: eAdv,
      armorDis,
      trainingDis,
      effectiveAdv,
    };
  });
}

export function rollSkill(name, bonus, effectiveAdv) {
  if (typeof window.rollSkill === 'function') {
    window.rollSkill(name, bonus, effectiveAdv);
  }
}

export function cycleSkillAdv(name) {
  if (typeof window.cycleSkillAdv === 'function') {
    window.cycleSkillAdv(name);
  }
}

function readJsonLs(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function readIntLs(key, fallback = 0) {
  const v = parseInt(localStorage.getItem(key) || '', 10);
  return Number.isFinite(v) ? v : fallback;
}

function readActiveCharacter() {
  return readJsonLs('5e_current_char', null);
}

function itemTypeGroup(item) {
  if (['M', 'R'].includes(item?.type)) return 'weapon';
  if (['LA', 'MA', 'HA', 'S'].includes(item?.type)) return 'armor';
  if (item?.rarity && item.rarity !== 'none') return 'magic';
  return 'gear';
}

function readInventoryStorage() {
  return readJsonLs('5e_inventory', []);
}

function readCurrencyStorage() {
  return readJsonLs('5e_currency', { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 }) || {};
}

function resolveInventoryRows() {
  const stored = readInventoryStorage();
  if (typeof window._resolvedInventory === 'function') {
    try {
      const resolved = window._resolvedInventory();
      if (Array.isArray(resolved)) {
        return resolved.map((item, index) => ({
          stored: stored[index] || item,
          item,
          index,
        }));
      }
    } catch {
      // fall through to stored records
    }
  }

  return (Array.isArray(stored) ? stored : []).map((item, index) => ({
    stored: item,
    item,
    index,
  }));
}

function cleanTaggedText(value) {
  return String(value || '')
    .replace(/\{@[a-z]+ ([^|}]+)(?:\|[^}]*)?\}/gi, '$1')
    .replace(/\{@[a-z]+\s*/gi, '')
    .replace(/[{}]/g, '')
    .split('|')[0]
    .trim();
}

function normalizeProfLabel(value) {
  if (typeof window._sheetNormalizeProfLabel === 'function') {
    return window._sheetNormalizeProfLabel(value);
  }

  let base = cleanTaggedText(value);
  if (!base) return '';
  base = base.replace(/\.$/, '').replace(/\s+/g, ' ').trim();
  if (/^martial weapons that have the finesse or light$/i.test(base)) {
    base = 'Martial weapons that have the Finesse or Light property';
  }
  if (/^(?:finesse|light) property$/i.test(base)) return '';
  if (/^one type of /i.test(base)) return '';
  if (/ of your choice$/i.test(base)) return '';
  if (/^any/i.test(base)) return '';
  if (base.includes(',')) return '';

  const alias = {
    "thieves' tools": "Thieves' Tools",
    "thieves' tool": "Thieves' Tools",
    "tinker's tools": "Tinker's Tools",
    "tinker's tool": "Tinker's Tools",
    "artisan's tools": "Artisan's Tools",
    'herbalism kit': 'Herbalism Kit',
    "navigator's tools": "Navigator's Tools",
    "poisoner's kit": "Poisoner's Kit",
    'forgery kit': 'Forgery Kit',
    'disguise kit': 'Disguise Kit',
  };
  const lc = base.toLowerCase();
  if (alias[lc]) return alias[lc];
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function splitAndNormalizeProfs(raw) {
  if (!raw || typeof raw !== 'string') return [];
  return raw.split(/[;,]/).map((s) => normalizeProfLabel(s)).filter(Boolean);
}

function fixedKeysFromProfBlock(block, excluded = []) {
  if (!block || typeof block !== 'object' || Array.isArray(block)) return [];
  return Object.keys(block)
    .filter((key) => !excluded.includes(key) && block[key] !== false)
    .map((key) => normalizeProfLabel(key))
    .filter(Boolean);
}

function normalizeProfDisplayList(values) {
  if (typeof window._sheetNormalizeProfDisplayList === 'function') {
    return window._sheetNormalizeProfDisplayList(values);
  }

  const out = [];
  (Array.isArray(values) ? values : Array.from(values || [])).forEach((value) => {
    const normalized = normalizeProfLabel(value);
    if (normalized && !out.some((x) => String(x).toLowerCase() === String(normalized).toLowerCase())) {
      out.push(normalized);
    }
  });
  return out;
}

function collectFixedFeatureProfs(character, field, excluded) {
  const out = new Set();
  if (!character) return out;

  const buckets = [{
    maxLv: character.classLevel || character.level || 1,
    features: [
      ...(character.allClassFeatures || []),
      ...(character.subclassShortName
        ? (character.allSubFeatures || []).filter((f) => f.subclassShortName === character.subclassShortName)
        : []),
    ],
  }];

  for (const extraClass of (character.extraClasses || [])) {
    if (!extraClass?.name) continue;
    buckets.push({
      maxLv: extraClass.level || 1,
      features: [
        ...(extraClass.allClassFeatures || []),
        ...(extraClass.subclassShortName
          ? (extraClass.allSubFeatures || []).filter((f) => f.subclassShortName === extraClass.subclassShortName)
          : []),
      ],
    });
  }

  buckets.forEach(({ maxLv, features }) => {
    (features || [])
      .filter((feature) => !feature?.isReprinted && (feature?.level || 0) <= maxLv)
      .forEach((feature) => {
        (feature?.[field] || []).forEach((block) => {
          if (typeof block === 'string') {
            const normalized = normalizeProfLabel(block);
            if (normalized) out.add(normalized);
            return;
          }
          fixedKeysFromProfBlock(block, excluded).forEach((value) => out.add(value));
        });
      });
  });

  return out;
}

function collectFixedFeatProfs(character, field, excluded) {
  const out = new Set();
  const snapshots = Array.isArray(character?.allFeatSnapshots) ? character.allFeatSnapshots : [];

  snapshots.forEach((feat) => {
    (feat?.[field] || []).forEach((block) => {
      if (typeof block === 'string') {
        const normalized = normalizeProfLabel(block);
        if (normalized) out.add(normalized);
        return;
      }
      fixedKeysFromProfBlock(block, excluded).forEach((value) => out.add(value));
    });
  });

  return out;
}

function collectAdapterProfGrants(character) {
  const {
    getClassSheetProficiencies,
    getSubclassSheetProficiencies,
    getSpeciesSheetProficiencies,
  } = window;
  const grantsOut = [];

  function append(grants, level, prefix = '') {
    (Array.isArray(grants) ? grants : []).forEach((grant) => {
      if (!grant || typeof grant !== 'object') return;
      const minLevel = Number(grant.minLevel || 1);
      if ((level || 1) < minLevel) return;
      if (grant.requiredChoice) {
        const required = grant.requiredChoice;
        const stored = character?.choices?.[prefix + required.key];
        const values = Array.isArray(stored) ? stored : (stored ? [stored] : []);
        if (!values.includes(required.value)) return;
      }
      grantsOut.push(grant);
    });
  }

  function collectEntity(className, subclassShortName, level, prefix = '') {
    if (typeof getClassSheetProficiencies === 'function') {
      append(getClassSheetProficiencies(className), level, prefix);
    }
    if (typeof getSubclassSheetProficiencies === 'function') {
      append(getSubclassSheetProficiencies(className, subclassShortName), level, prefix);
    }
  }

  collectEntity(
    character?.className || '',
    character?.subclassShortName || '',
    character?.classLevel || character?.level || 1,
  );

  for (const [index, extraClass] of (character?.extraClasses || []).entries()) {
    collectEntity(
      extraClass?.name || '',
      extraClass?.subclassShortName || '',
      extraClass?.level || 1,
      `mc${index}_`,
    );
  }

  if (typeof getSpeciesSheetProficiencies === 'function') {
    append(
      getSpeciesSheetProficiencies(character?.speciesName || '', character?.speciesSource || ''),
      character?.level || 1,
    );
  }

  return grantsOut;
}

function getHitDieFaces(character) {
  const hd = character?.clsSnapshot?.hd;
  if (!hd) return 8;
  if (hd.faces) return hd.faces;
  if (Array.isArray(hd) && hd[0]?.faces) return hd[0].faces;
  return 8;
}

export function computeProficiencies() {
  const character = readActiveCharacter();
  if (!character) return [];

  const sp = character.clsSnapshot?.startingProficiencies || {};
  const bsp = character.bgSnapshot || {};
  const adapterGrants = collectAdapterProfGrants(character);
  const equipmentExcluded = ['choose', 'any'];
  const choiceExcluded = ['choose', 'anyTool', 'anyArtisansTool', 'anyMusicalInstrument', 'anyGamingSet', 'any'];

  const armorSet = new Set();
  const weaponSet = new Set();
  const weaponMasterySet = new Set();

  function addFixedProfsFromBlocks(source, set) {
    const entries = Array.isArray(source) ? source : [source];
    entries.forEach((entry) => {
      if (!entry) return;
      if (typeof entry === 'string') {
        splitAndNormalizeProfs(entry).forEach((value) => set.add(value));
        return;
      }
      fixedKeysFromProfBlock(entry, equipmentExcluded).forEach((value) => set.add(value));
    });
  }

  addFixedProfsFromBlocks(sp.armor, armorSet);
  addFixedProfsFromBlocks(sp.weapons, weaponSet);
  collectFixedFeatureProfs(character, 'armorProficiencies', equipmentExcluded).forEach((value) => armorSet.add(value));
  collectFixedFeatureProfs(character, 'weaponProficiencies', equipmentExcluded).forEach((value) => weaponSet.add(value));
  collectFixedFeatProfs(character, 'armorProficiencies', equipmentExcluded).forEach((value) => armorSet.add(value));
  collectFixedFeatProfs(character, 'weaponProficiencies', equipmentExcluded).forEach((value) => weaponSet.add(value));

  if (character.choices) {
    for (const [key, rawValue] of Object.entries(character.choices)) {
      if (!rawValue) continue;
      const lowerKey = key.toLowerCase();
      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      if (lowerKey.includes('mastery') && lowerKey.includes('weapon')) {
        values.forEach((value) => {
          const normalized = normalizeProfLabel(value);
          if (normalized) weaponMasterySet.add(normalized);
        });
        continue;
      }
      if (lowerKey.includes('armor')) {
        values.forEach((value) => {
          const normalized = normalizeProfLabel(value);
          if (normalized) armorSet.add(normalized);
        });
      }
      if (lowerKey.includes('weapon')) {
        values.forEach((value) => {
          const normalized = normalizeProfLabel(value);
          if (normalized) weaponSet.add(normalized);
        });
      }
    }
  }

  adapterGrants
    .filter((grant) => grant.type === 'armor' || grant.type === 'weapon')
    .forEach((grant) => {
      if (grant.display === false) return;
      const values = Array.isArray(grant.values) ? grant.values : [grant.values];
      values.map((value) => normalizeProfLabel(value)).filter(Boolean).forEach((value) => {
        if (grant.type === 'armor') armorSet.add(value);
        else weaponSet.add(value);
      });
    });

  const toolSet = new Set();
  const addTool = (raw) => {
    splitAndNormalizeProfs(String(raw || '')).forEach((value) => toolSet.add(value));
  };
  const classToolBlocks = [];
  if (sp.tools) classToolBlocks.push(...(Array.isArray(sp.tools) ? sp.tools : [sp.tools]));
  if (sp.toolProficiencies) {
    classToolBlocks.push(...(Array.isArray(sp.toolProficiencies) ? sp.toolProficiencies : [sp.toolProficiencies]));
  }
  classToolBlocks.forEach((toolBlock) => {
    if (typeof toolBlock === 'string') {
      addTool(toolBlock);
      return;
    }
    fixedKeysFromProfBlock(toolBlock, choiceExcluded).forEach(addTool);
  });
  (bsp.toolProficiencies || []).forEach((toolBlock) => {
    fixedKeysFromProfBlock(toolBlock, choiceExcluded).forEach(addTool);
  });
  collectFixedFeatureProfs(character, 'toolProficiencies', choiceExcluded).forEach(addTool);
  collectFixedFeatProfs(character, 'toolProficiencies', choiceExcluded).forEach(addTool);
  (character.selectedTools || []).forEach(addTool);
  if (character.choices) {
    for (const [key, rawValue] of Object.entries(character.choices)) {
      if (!rawValue) continue;
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('tool') || lowerKey.includes('instrument')) {
        const values = Array.isArray(rawValue) ? rawValue : [rawValue];
        values.forEach(addTool);
      }
    }
  }
  adapterGrants
    .filter((grant) => grant.type === 'tool')
    .forEach((grant) => {
      const values = Array.isArray(grant.values) ? grant.values : [grant.values];
      values.forEach(addTool);
    });

  const languageSet = new Set((character.selectedLanguages || []).map((value) => normalizeProfLabel(value)).filter(Boolean));
  collectFixedFeatureProfs(character, 'languageProficiencies', ['choose', 'anyStandard', 'anyExotic', 'any'])
    .forEach((value) => languageSet.add(value));
  collectFixedFeatProfs(character, 'languageProficiencies', ['choose', 'anyStandard', 'anyExotic', 'any'])
    .forEach((value) => languageSet.add(value));
  adapterGrants
    .filter((grant) => grant.type === 'language')
    .forEach((grant) => {
      const values = Array.isArray(grant.values) ? grant.values : [grant.values];
      values.map((value) => normalizeProfLabel(value)).filter(Boolean).forEach((value) => languageSet.add(value));
    });
  if (!languageSet.size) languageSet.add('Common');

  const weaponDisplay = normalizeProfDisplayList(weaponSet);
  const empty = '-';

  return [
    { key: 'armor', icon: 'shield', title: 'Armor', text: armorSet.size ? Array.from(armorSet).join(', ') : empty },
    { key: 'weapons', icon: 'swords', title: 'Weapons', text: weaponDisplay.length ? weaponDisplay.join(', ') : empty },
    {
      key: 'weapon-mastery',
      icon: 'target',
      title: 'Weapon Mastery',
      text: weaponMasterySet.size ? Array.from(weaponMasterySet).join(', ') : empty,
    },
    { key: 'tools', icon: 'wrench', title: 'Tools', text: toolSet.size ? Array.from(toolSet).join(', ') : empty },
    { key: 'languages', icon: 'languages', title: 'Languages', text: Array.from(languageSet).join(', ') || 'Common' },
  ];
}

export function computeVitals() {
  const { calcMaxHP } = window;
  const character = readActiveCharacter();

  const currentHP = readIntLs('5e_hp_current', 0);
  const tempHP = readIntLs('5e_hp_temp', 0);
  const maxHPBonus = readIntLs('5e_hp_max_bonus', 0);
  const baseMax = typeof calcMaxHP === 'function' ? Number(calcMaxHP()) || 0 : 0;
  const maxHP = Math.max(1, baseMax + maxHPBonus);

  const ds = readJsonLs('5e_death_saves', { success: 0, fail: 0 }) || { success: 0, fail: 0 };
  const deathSuccess = Math.max(0, Math.min(3, Number(ds.success) || 0));
  const deathFail = Math.max(0, Math.min(3, Number(ds.fail) || 0));

  const total = Number(character?.level) || 0;
  const usedHD = readIntLs('5e_hd_used', 0);
  const remainingHD = Math.max(0, total - usedHD);
  const faces = getHitDieFaces(character);

  const pips = [];
  for (let i = 0; i < total; i += 1) {
    const used = i >= total - usedHD;
    pips.push({ used, title: `d${faces}` });
  }

  const maxBonusLabel = maxHPBonus
    ? `${maxHPBonus > 0 ? '+' : ''}${maxHPBonus}`
    : '0';

  return {
    hp: {
      current: String(currentHP),
      max: String(maxHP),
      temp: String(tempHP),
      maxBonus: maxBonusLabel,
      amount: '1',
      showDeathSaves: currentHP === 0,
      deathSuccess,
      deathFail,
    },
    hitDice: {
      label: total ? `${remainingHD}/${total} d${faces}` : '',
      pips,
      total,
      used: usedHD,
      faces,
      hint: pips.length ? 'Click to use/recover a hit die' : '',
    },
  };
}

export function computeScores() {
  const {
    getFinal,
    getMod,
    getPB,
    _sheetSpeedSet,
    _sheetSpeedBonus,
    _sheetHasNonProficientArmor,
    _sheetAdvFor,
  } = window;
  const character = readActiveCharacter();
  const cachedEncLevel = Number(window.cachedEncLevel) || 0;

  if (typeof getFinal !== 'function' || typeof getMod !== 'function' || typeof getPB !== 'function') {
    return { ready: false, scores: [], pb: '', speed: null };
  }

  const armorTrainingDis = typeof _sheetHasNonProficientArmor === 'function' && _sheetHasNonProficientArmor();

  const scores = STATS.map((stat) => {
    const value = getFinal(stat);
    const mod = getMod(value);
    const hasForcedDis = armorTrainingDis && (stat === 'str' || stat === 'dex');
    const eAdv = typeof _sheetAdvFor === 'function' ? _sheetAdvFor({ target: 'check', ability: stat }) : null;

    let advFlag;
    if (hasForcedDis) advFlag = false;
    else if (eAdv === 'adv') advFlag = true;
    else if (eAdv === 'disadv') advFlag = false;

    const titleParts = [`Roll ${FULL_LBL[stat]} Check`];
    if (hasForcedDis) titleParts.push('Disadvantage: untrained armor');
    if (!hasForcedDis && eAdv === 'adv') titleParts.push('Advantage (feature)');
    if (!hasForcedDis && eAdv === 'disadv') titleParts.push('Disadvantage (feature)');

    return {
      stat,
      shortLabel: SLBL[stat],
      fullLabel: FULL_LBL[stat],
      value,
      mod,
      modText: fbonus(mod),
      hasForcedDis,
      featureAdv: !hasForcedDis ? eAdv : null,
      advFlag,
      title: titleParts.join(' | '),
    };
  });

  const speciesSpeed = character?.speciesSnapshot?.speed ?? 30;
  const spdMap = typeof speciesSpeed === 'object' ? speciesSpeed : { walk: speciesSpeed };
  const baseWalk = Number(spdMap.walk ?? (typeof speciesSpeed === 'number' ? speciesSpeed : 30));
  const setWalk = typeof _sheetSpeedSet === 'function' ? _sheetSpeedSet('walk') : 0;
  const speedBonus = typeof _sheetSpeedBonus === 'function' ? _sheetSpeedBonus('walk') : 0;
  const spdBase = Math.max(baseWalk, setWalk) + speedBonus;
  const isOverCap = cachedEncLevel === 1;
  const spdVal = isOverCap ? 5 : spdBase;

  const altModes = ['fly', 'swim', 'climb', 'burrow']
    .map((t) => {
      const base = Number(spdMap[t] || 0);
      const set = typeof _sheetSpeedSet === 'function' ? _sheetSpeedSet(t) : 0;
      const bonus = typeof _sheetSpeedBonus === 'function' ? _sheetSpeedBonus(t) : 0;
      const total = Math.max(base, set) + bonus;
      return total > 0 ? { mode: t, value: total, label: t.charAt(0).toUpperCase() + t.slice(1) } : null;
    })
    .filter(Boolean);

  return {
    ready: true,
    scores,
    pb: fbonus(getPB()),
    speed: {
      value: spdVal,
      base: spdBase,
      isOverCap,
      altModes,
      title: isOverCap ? `Base ${spdBase} ft — Over Capacity` : '',
    },
  };
}

function computeDefenses() {
  const {
    _sheetExtraResists,
    _sheetExtraImmunes,
    _sheetExtraCondImmunes,
    _resolvedInventory,
    _sheetClassEntities,
    _sheetGetClassRuntimeConfig,
    _sheetGetSubclassRuntimeConfig,
    _sheetGetSpeciesRuntimeConfig,
    _sheetArmorTrainingIssues,
  } = window;
  const C = readActiveCharacter();

  const items = [];

  function dmgLabel(r) {
    const raw = typeof r === 'string' ? r : r?.special || '';
    if (!raw || raw === '—') return raw || '—';
    const stripped = raw.replace(/^(resistance|immunity)[-:]\s*/i, '').trim();
    return DMGTYPE_LABELS[stripped.toLowerCase()] || DMGTYPE_LABELS[raw.toLowerCase()] || stripped || raw;
  }

  const resist = C?.speciesSnapshot?.resist || [];
  const immune = C?.speciesSnapshot?.immune || [];

  for (const r of resist) {
    const lbl = dmgLabel(r);
    if (lbl && lbl !== '—') items.push({ label: `Resistance: ${lbl}`, color: 'b' });
  }
  for (const r of immune) {
    const lbl = dmgLabel(r);
    if (lbl && lbl !== '—') items.push({ label: `Immunity: ${lbl}`, color: 'r' });
  }

  if (typeof _sheetExtraResists === 'function') {
    _sheetExtraResists().forEach((d) => {
      const lbl = DMGTYPE_LABELS[String(d).toLowerCase()] || d;
      items.push({ label: `Resistance: ${lbl}`, color: 'b' });
    });
  }
  if (typeof _sheetExtraImmunes === 'function') {
    _sheetExtraImmunes().forEach((d) => {
      const lbl = DMGTYPE_LABELS[String(d).toLowerCase()] || d;
      items.push({ label: `Immunity: ${lbl}`, color: 'r' });
    });
  }
  if (typeof _sheetExtraCondImmunes === 'function') {
    _sheetExtraCondImmunes().forEach((c) => {
      items.push({ label: `Cond. Immunity: ${c}`, color: 'r' });
    });
  }

  if (C?.speciesSnapshot?.darkvision) {
    items.push({ label: `Darkvision ${C.speciesSnapshot.darkvision} ft`, color: 't' });
  }

  const inv = typeof _resolvedInventory === 'function' ? _resolvedInventory() : [];
  const hasArmor = !!inv.find((i) => i.equipped && ['LA', 'MA', 'HA'].includes(i.type));
  const hasShield = !!inv.find((i) => i.equipped && i.type === 'S');

  if (!hasArmor) {
    const labels = new Set();
    function pushRules(rules, level) {
      (Array.isArray(rules) ? rules : []).forEach((rule) => {
        if (!rule || typeof rule !== 'object') return;
        if (Number(level || 0) < Number(rule.minLevel || 1)) return;
        if (!rule.allowShield && hasShield) return;
        const abilities = Array.isArray(rule.abilities) ? rule.abilities : [];
        if (!abilities.length) return;
        const txt = `${rule.name || 'Unarmored Defense'} (${abilities.map((a) => String(a || '').toUpperCase()).join('+')})`;
        labels.add(txt);
      });
    }

    if (typeof _sheetClassEntities === 'function') {
      _sheetClassEntities().forEach((ent) => {
        pushRules(_sheetGetClassRuntimeConfig?.(ent.className)?.unarmoredDefense, ent.level);
        pushRules(_sheetGetSubclassRuntimeConfig?.(ent.className, ent.subclassShortName)?.unarmoredDefense, ent.level);
      });
    }
    pushRules(
      _sheetGetSpeciesRuntimeConfig?.(C?.speciesName || '', C?.speciesSource || '')?.unarmoredDefense,
      C?.level || 1,
    );
    labels.forEach((txt) => items.push({ label: txt, color: 'g' }));
  }

  if (typeof _sheetArmorTrainingIssues === 'function') {
    _sheetArmorTrainingIssues().forEach(({ item, info }) => {
      if (item.type === 'S') {
        items.push({ label: `Untrained Shield: no AC bonus (${item.name || info.kind})`, color: 'r' });
      } else {
        items.push({
          label: `Untrained ${info.kind}: DIS STR/DEX tests, no spells (${item.name || info.kind})`,
          color: 'r',
        });
      }
    });
  }

  return items;
}

function readActiveConditions() {
  try {
    const raw = localStorage.getItem('5e_conditions_active');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = new Set(CONDITION_OPTIONS.map((c) => c.key));
    return parsed.filter((k) => valid.has(k));
  } catch {
    return [];
  }
}

export function computeConditions() {
  const activeKeys = readActiveConditions();
  const activeSet = new Set(activeKeys);
  const active = CONDITION_OPTIONS.filter((c) => activeSet.has(c.key));
  return {
    active,
    allOptions: CONDITION_OPTIONS,
    activeKeys,
    hasAny: active.length > 0,
  };
}

export function computeSummary() {
  const { getMod, getFinal, calcAC, _getInitiativeBonus } = window;

  const initMod = (typeof getMod === 'function' && typeof getFinal === 'function')
    ? getMod(getFinal('dex')) + (typeof _getInitiativeBonus === 'function' ? _getInitiativeBonus() : 0)
    : 0;

  const ac = typeof calcAC === 'function' ? calcAC() : 10;

  const inspirationActive = readJsonRaw('5e_inspiration') === 'true';

  return {
    initiative: fbonus(initMod),
    ac,
    inspirationActive,
    inspirationLabel: inspirationActive ? 'Inspired!' : 'No Insp.',
    defenses: computeDefenses(),
    conditions: computeConditions(),
  };
}

export function toggleCondition(key) {
  if (typeof window.toggleCondition === 'function') window.toggleCondition(key);
}

export function clearConditions() {
  if (typeof window.clearConditions === 'function') window.clearConditions();
}

function readJsonRaw(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function doRest(type) {
  if (typeof window.doRest === 'function') window.doRest(type);
}

export function downloadSheet() {
  if (typeof window.downloadSheet === 'function') window.downloadSheet();
}

export function goBackToBuilder(event) {
  if (typeof window.goBackToBuilder === 'function') window.goBackToBuilder(event);
}

export function saveNotes() {
  if (typeof window.saveNotes === 'function') window.saveNotes();
}

export function readSheetNotes() {
  try {
    return localStorage.getItem('5e_notes') || '';
  } catch {
    return '';
  }
}

export function writeSheetNotes(value) {
  try {
    localStorage.setItem('5e_notes', String(value || ''));
  } catch {
    // ignore quota errors
  }
}

export function rollInitiative() {
  if (typeof window.rollInitiative === 'function') window.rollInitiative();
}

export function toggleInspiration() {
  if (typeof window.toggleInspirationSheet === 'function') window.toggleInspirationSheet();
}

export function rollAbilityCheck(stat, mod, advFlag) {
  if (typeof window.rollD20 === 'function') {
    const label = `${FULL_LBL[stat] || SLBL[stat] || stat} Check`;
    if (advFlag === undefined) window.rollD20(mod, label);
    else window.rollD20(mod, label, advFlag);
  }
}

export function computeSenses() {
  const { getSkillBonus, _sheetExtraSenses } = window;
  if (typeof getSkillBonus !== 'function') return [];

  const character = readActiveCharacter();
  const extra = typeof _sheetExtraSenses === 'function' ? _sheetExtraSenses() : {};
  const speciesDarkvision = character?.speciesSnapshot?.darkvision || 0;
  const dv = Math.max(speciesDarkvision, extra?.darkvision || 0);

  const rows = [
    { key: 'pass-perc', value: 10 + getSkillBonus({ n: 'Perception', a: 'wis' }), label: 'Passive Perception' },
    { key: 'pass-inv', value: 10 + getSkillBonus({ n: 'Investigation', a: 'int' }), label: 'Passive Investigation' },
    { key: 'pass-ins', value: 10 + getSkillBonus({ n: 'Insight', a: 'wis' }), label: 'Passive Insight' },
  ];

  if (dv > 0) {
    rows.push({ key: 'darkvision', value: `${dv} ft`, label: 'Darkvision', tealValue: true });
  }

  ['blindsight', 'tremorsense', 'truesight'].forEach((k) => {
    const range = extra?.[k] || 0;
    if (range > 0) {
      rows.push({
        key: k,
        value: `${range} ft`,
        label: k.charAt(0).toUpperCase() + k.slice(1),
        tealValue: true,
      });
    }
  });

  return rows;
}

export function computeBackground() {
  const character = readActiveCharacter();
  if (!character?.bgName) {
    return {
      hasBackground: false,
      emptyMessage: 'No background selected.',
      name: '',
      summaryRows: [],
      choiceRows: [],
      entries: [],
    };
  }

  const snap = character.bgSnapshot || {};
  const skillNames = (snap.skillProficiencies || [])
    .flatMap((skillBlock) => Object.keys(skillBlock || {}).filter((key) => key !== 'choose'));
  const toolNames = (snap.toolProficiencies || [])
    .flatMap((toolBlock) => Object.keys(toolBlock || {}).filter((key) => (
      !['choose', 'any', 'anyTool', 'anyArtisansTool', 'anyMusicalInstrument', 'anyGamingSet'].includes(key)
    )));
  const languageNames = (snap.languageProficiencies || [])
    .map((languageBlock) => {
      if (!languageBlock || typeof languageBlock !== 'object') return '';
      if (languageBlock.anyStandard) return `${languageBlock.anyStandard} language of your choice`;
      return Object.keys(languageBlock).filter((key) => languageBlock[key] === true).join(', ');
    })
    .filter(Boolean);

  const bgMeta = typeof window.getGenericBackgroundChoiceMeta === 'function'
    ? window.getGenericBackgroundChoiceMeta()
    : null;
  const choiceRows = [];

  if (bgMeta && character.choices) {
    for (const [choiceKey, choiceValue] of Object.entries(character.choices)) {
      if (!choiceValue || choiceKey.endsWith('_entry')) continue;
      if (typeof bgMeta.isChoiceKey !== 'function' || !bgMeta.isChoiceKey(choiceKey, { character })) continue;
      const values = (Array.isArray(choiceValue) ? choiceValue : [choiceValue])
        .map((value) => (
          typeof bgMeta.normalizeChoiceValue === 'function'
            ? bgMeta.normalizeChoiceValue(value, choiceKey, { character })
            : value
        ))
        .map((value) => String(value || '').trim())
        .filter(Boolean);
      if (!values.length) continue;

      const fallbackLabel = choiceKey.replace(/^bg_/i, '').replace(/_+/g, ' ');
      const label = typeof bgMeta.getLabel === 'function'
        ? bgMeta.getLabel(choiceKey, { character })
        : fallbackLabel;
      choiceRows.push({ key: choiceKey, label, values });
    }
  }

  return {
    hasBackground: true,
    name: character.bgName,
    summaryRows: [
      { key: 'skills', label: 'Skills', values: skillNames },
      { key: 'tools', label: 'Tools', values: toolNames },
      { key: 'languages', label: 'Languages', values: languageNames },
    ].filter((row) => row.values.length > 0),
    choiceRows,
    entries: (snap.entries || [])
      .filter((entry) => entry && typeof entry === 'object' && entry.name)
      .map((entry, index) => ({
        key: `${entry.name}-${index}`,
        name: entry.name,
        entries: entry.entries || '',
    })),
  };
}

function applyClassFeatureFilters(className, subclassShortName, features, ctx) {
  if (typeof window._applySheetFeatureFilters === 'function') {
    return window._applySheetFeatureFilters(className, subclassShortName, features, ctx);
  }
  return Array.isArray(features) ? features : [];
}

function applySpeciesFeatureFilters(speciesName, speciesSource, features, ctx) {
  if (typeof window._applySpeciesSheetFeatureFilters === 'function') {
    return window._applySpeciesSheetFeatureFilters(speciesName, speciesSource, features, ctx);
  }
  return Array.isArray(features) ? features : [];
}

function getFeatSlot(character, featName) {
  if (!character?.choices) return 'Feat';
  const slotMeta = character?.featSlotMeta && typeof character.featSlotMeta === 'object'
    ? character.featSlotMeta
    : {};

  for (const [key, rawValue] of Object.entries(character.choices)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    if (!values.includes(featName)) continue;

    const metaLabel = String(slotMeta?.[key]?.label || '').trim();
    if (metaLabel) return metaLabel;
    if (/^species_.*feat/i.test(key)) return 'Origin (Species)';
    if (/^feat_origin/i.test(key) || /^bg_feat/i.test(key)) return 'Origin (Background)';
    const levelMatch = key.match(/lv(\d+)/i);
    if (levelMatch) return `Feat Lv.${levelMatch[1]}`;
    return 'Feat';
  }

  return 'Feat';
}

function featureItem(feature, source, overrides = {}) {
  return {
    key: `${source.label}-${feature?.name || 'feature'}-${feature?.level || 0}-${overrides.index || 0}`,
    name: cleanTaggedText(feature?.name || ''),
    entries: feature?.entries || '',
    source,
    nameColor: overrides.nameColor || '',
    badge: overrides.badge || '',
    emptyText: overrides.emptyText || 'No description.',
  };
}

function buildClassFeatureSection(character, classEntity, options = {}) {
  const className = classEntity?.name || classEntity?.className || '';
  if (!className) return null;

  const level = options.primary
    ? (character.classLevel || character.level || 1)
    : (classEntity.level || 1);
  const subclassShortName = classEntity.subclassShortName || '';
  const prefix = options.choicePrefix || '';
  const allClassFeatures = (classEntity.allClassFeatures || [])
    .filter((feature) => (feature?.level || 0) <= level && !feature?.isReprinted);
  const rawSubFeatures = subclassShortName
    ? (classEntity.allSubFeatures || [])
      .filter((feature) => (
        feature?.subclassShortName === subclassShortName &&
        (feature?.level || 0) <= level &&
        !feature?.isReprinted
      ))
    : [];
  const allSubFeatures = applyClassFeatureFilters(className, subclassShortName, rawSubFeatures, {
    character,
    choices: character?.choices || {},
    choicePrefix: prefix,
    classLevel: level,
  });

  const byLevel = new Map();
  allClassFeatures.forEach((feature) => {
    const lv = Number(feature?.level || 0);
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv).push({ ...feature, _type: 'class' });
  });
  allSubFeatures.forEach((feature) => {
    const lv = Number(feature?.level || 0);
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv).push({ ...feature, _type: 'subclass' });
  });

  const items = [];
  [...byLevel.keys()].sort((a, b) => a - b).forEach((lv) => {
    byLevel.get(lv).forEach((feature, index) => {
      const isSubclass = feature._type === 'subclass';
      items.push(featureItem(feature, {
        label: isSubclass
          ? `${subclassShortName || 'Subclass'} · Lv.${lv}`
          : `${className} · Lv.${lv}`,
        color: isSubclass ? 'var(--purple)' : 'var(--text3)',
        icon: isSubclass ? 'diamond' : '',
      }, {
        index,
        nameColor: isSubclass ? 'var(--purple)' : '',
      }));
    });
  });

  if (!items.length) return null;

  const subclassLabel = !options.primary && subclassShortName ? ` (${subclassShortName})` : '';
  return {
    key: options.primary ? 'primary-class' : `extra-class-${options.index}`,
    title: `${className}${subclassLabel}`,
    icon: 'swords',
    color: 'var(--gold)',
    items,
  };
}

function getChoiceMeta(kind, args) {
  if (kind === 'class' && typeof window._sheetGetClassChoiceMeta === 'function') {
    return window._sheetGetClassChoiceMeta(args.className) || {};
  }
  if (kind === 'subclass' && typeof window._sheetGetSubclassChoiceMeta === 'function') {
    return window._sheetGetSubclassChoiceMeta(args.className, args.subclassShortName) || {};
  }
  if (kind === 'species' && typeof window._sheetGetSpeciesChoiceMeta === 'function') {
    return window._sheetGetSpeciesChoiceMeta(args.speciesName, args.speciesSource) || {};
  }
  return {};
}

function getSpeciesAdapterKey(speciesName, speciesSource) {
  if (typeof window._sheetGetSpeciesAdapterKey === 'function') {
    return window._sheetGetSpeciesAdapterKey(speciesName, speciesSource);
  }
  const name = String(speciesName || '').trim();
  const source = String(speciesSource || '').trim();
  return name && source ? `${name}_${source}` : '';
}

function normalizeChoiceValues(rawValue, choiceKey, ctx, normalizers) {
  return (Array.isArray(rawValue) ? rawValue : [rawValue])
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .map((value) => {
      let out = value;
      normalizers.forEach((normalizer) => {
        out = normalizer(out, choiceKey, ctx);
      });
      return String(out || '').trim();
    })
    .filter(Boolean);
}

function computeClassChoiceSection(character) {
  const rows = [];
  const choices = character?.choices || {};

  for (const [choiceKey, choiceValue] of Object.entries(choices)) {
    if (!choiceValue || choiceKey.endsWith('_entry') || /^feat_origin$/i.test(choiceKey)) continue;

    let key = choiceKey;
    let scope = '';
    let ownerClass = character.className || '';
    let ownerSubclass = character.subclassShortName || '';
    let ownerLevel = character.classLevel || character.level || 1;
    let ownerPrefix = '';

    const multiclassMatch = /^mc(\d+)_/.exec(choiceKey);
    if (multiclassMatch) {
      key = choiceKey.replace(/^mc\d+_/, '');
      const index = parseInt(multiclassMatch[1], 10);
      const extraClass = character.extraClasses?.[index];
      if (extraClass?.name) scope = `[${extraClass.name}] `;
      ownerClass = extraClass?.name || '';
      ownerSubclass = extraClass?.subclassShortName || '';
      ownerLevel = extraClass?.level || 1;
      ownerPrefix = `mc${index}_`;
    }

    const classMeta = getChoiceMeta('class', { className: ownerClass });
    const subclassMeta = getChoiceMeta('subclass', {
      className: ownerClass,
      subclassShortName: ownerSubclass,
    });
    const ctx = {
      choiceKey: key,
      ownerClass,
      ownerSubclass,
      ownerLevel,
      choicePrefix: ownerPrefix,
    };
    const isChoice = [classMeta.isChoiceKey, subclassMeta.isChoiceKey]
      .some((fn) => typeof fn === 'function' && fn(key, ctx));
    if (!isChoice) continue;

    const normalizers = [classMeta.normalizeChoiceValue, subclassMeta.normalizeChoiceValue]
      .filter((fn) => typeof fn === 'function');
    const values = normalizeChoiceValues(choiceValue, key, ctx, normalizers);
    if (!values.length) continue;

    const labels = { ...(classMeta.labels || {}), ...(subclassMeta.labels || {}) };
    let label = labels[key] || '';
    if (!label) {
      for (const fn of [classMeta.getLabel, subclassMeta.getLabel]) {
        if (typeof fn !== 'function') continue;
        label = fn(key, ctx) || '';
        if (label) break;
      }
    }
    if (!label) label = key.replace(/^.*?_/, '').replace(/_/g, ' ');

    rows.push({
      key: choiceKey,
      label: `${scope}${label}`,
      values,
      sectionTitle: subclassMeta.sectionTitle || classMeta.sectionTitle || 'Class Choices',
    });
  }

  if (!rows.length) return null;
  return {
    key: 'class-choices',
    title: rows[0].sectionTitle || 'Class Choices',
    icon: 'wrench',
    color: 'var(--teal)',
    choices: rows,
  };
}

function computeSpeciesChoiceSection(character) {
  if (!character?.speciesName) return null;

  const speciesMeta = getChoiceMeta('species', {
    speciesName: character.speciesName,
    speciesSource: character.speciesSource || '',
  });
  const rows = [];

  for (const [choiceKey, choiceValue] of Object.entries(character.choices || {})) {
    if (!choiceValue || choiceKey.endsWith('_entry') || choiceKey.startsWith('mc')) continue;
    const ctx = {
      choiceKey,
      speciesName: character.speciesName,
      speciesSource: character.speciesSource || '',
    };
    if (typeof speciesMeta.isChoiceKey !== 'function' || !speciesMeta.isChoiceKey(choiceKey, ctx)) continue;

    const normalizers = typeof speciesMeta.normalizeChoiceValue === 'function'
      ? [speciesMeta.normalizeChoiceValue]
      : [];
    const values = normalizeChoiceValues(choiceValue, choiceKey, ctx, normalizers);
    if (!values.length) continue;

    let label = speciesMeta.labels?.[choiceKey] || '';
    if (!label && typeof speciesMeta.getLabel === 'function') label = speciesMeta.getLabel(choiceKey, ctx) || '';
    if (!label) label = String(choiceKey || '').replace(/^species_/i, '').replace(/_+/g, ' ').trim();
    if (!label) continue;

    rows.push({ key: choiceKey, label, values });
  }

  if (!rows.length) return null;
  return {
    key: 'species-choices',
    title: speciesMeta.sectionTitle || 'Species Choices',
    icon: 'sparkles',
    color: 'var(--teal)',
    choices: rows,
  };
}

export function computeFeatures() {
  const character = readActiveCharacter();
  if (!character) {
    return { sections: [], emptyMessage: 'No features available.' };
  }

  const sections = [];
  const primarySection = buildClassFeatureSection(character, {
    name: character.className,
    subclassShortName: character.subclassShortName,
    allClassFeatures: character.allClassFeatures || [],
    allSubFeatures: character.allSubFeatures || [],
  }, { primary: true, choicePrefix: '' });
  if (primarySection) sections.push(primarySection);

  (character.extraClasses || []).forEach((extraClass, index) => {
    const section = buildClassFeatureSection(character, extraClass, {
      primary: false,
      index,
      choicePrefix: `mc${index}_`,
    });
    if (section) sections.push(section);
  });

  if (character.speciesName) {
    const rawEntries = character.speciesSnapshot?.entries || [];
    const speciesEntries = applySpeciesFeatureFilters(
      character.speciesName,
      character.speciesSource || '',
      rawEntries,
      {
        character,
        choices: character.choices || {},
        speciesKey: getSpeciesAdapterKey(character.speciesName, character.speciesSource || ''),
      },
    );
    const items = (speciesEntries || [])
      .filter((entry) => entry && typeof entry === 'object' && entry.name)
      .map((entry, index) => featureItem(entry, {
        label: character.speciesName,
        color: 'var(--teal)',
        icon: 'sparkles',
      }, { index }));

    if (items.length) {
      sections.push({
        key: 'species',
        title: character.speciesName,
        icon: 'sparkles',
        color: 'var(--teal)',
        items,
      });
    }
  }

  const feats = Array.isArray(character.allFeatSnapshots) ? character.allFeatSnapshots : [];
  if (feats.length) {
    sections.push({
      key: 'feats',
      title: 'Feats',
      icon: 'star',
      color: 'var(--orange)',
      items: feats.map((feat, index) => {
        const slot = getFeatSlot(character, feat.name);
        const categoryLabel = feat.category ? ` · Cat. ${feat.category}` : '';
        return featureItem(feat, {
          label: `${slot || 'Feat'}${categoryLabel}`,
          color: 'var(--orange)',
          icon: 'star',
        }, {
          index,
          nameColor: 'var(--orange)',
          emptyText: '-',
        });
      }),
    });
  }

  const classChoices = computeClassChoiceSection(character);
  if (classChoices) sections.push(classChoices);

  const speciesChoices = computeSpeciesChoiceSection(character);
  if (speciesChoices) sections.push(speciesChoices);

  return { sections, emptyMessage: 'No features available.' };
}

export function computeInventory() {
  const character = readActiveCharacter();
  const rows = resolveInventoryRows();
  const totalItems = rows.reduce((sum, { item }) => sum + (Number(item?.qty) || 1), 0);
  const totalWeightNumber = rows.reduce((sum, { item }) => (
    sum + (Number(item?.weight) || 0) * (Number(item?.qty) || 1)
  ), 0);
  const totalValueNumber = rows.reduce((sum, { item }) => (
    sum + ((Number(item?.value) || 0) / 100) * (Number(item?.qty) || 1)
  ), 0);

  const strScore = typeof window.getFinal === 'function'
    ? Number(window.getFinal('str')) || 0
    : Number(character?.abilities?.str || character?.stats?.str || 10) || 10;
  const maxCarry = strScore * 15;
  const pct = maxCarry > 0 ? Math.min(100, (totalWeightNumber / maxCarry) * 100) : 0;
  const isOver = totalWeightNumber > maxCarry;

  const groups = INVENTORY_FILTERS
    .filter((filter) => filter.key !== 'all')
    .map((filter) => ({
      ...filter,
      items: rows
        .filter(({ item }) => itemTypeGroup(item) === filter.key)
        .map(({ item, stored, index }) => {
          const rarity = item?.rarity && item.rarity !== 'none' ? item.rarity : null;
          const typeLabel = ITEM_TYPE_LABELS[item?.type] || item?.type || '';
          const sourceLabel = SOURCE_LABELS[item?.source] || item?.source || '';
          const canEquip = ['M', 'R', 'LA', 'MA', 'HA', 'S', 'SCF', 'WD', 'RD', 'ST', 'WI'].includes(item?.type);
          const magicBonus = parseInt(String(item?.bonusWeapon || item?.bonusAc || '0').replace('+', ''), 10) || 0;
          const damageParts = [];
          if (item?.dmg1) damageParts.push(`${item.dmg1}${item.dmgType ? ` ${item.dmgType}` : ''}`);
          if (item?.bonusWeapon) damageParts.push(`${item.bonusWeapon} magic`);
          const acParts = [];
          if (item?.ac) acParts.push(`AC ${item.ac}`);
          if (item?.bonusAc) acParts.push(`${item.bonusAc} magic`);
          const propStr = (item?.property || []).map((prop) => WEAPON_PROP_LABELS[prop] || prop).filter(Boolean).join(', ');
          const meta = [
            item?.weight ? `${item.weight}lb` : null,
            damageParts.join(' ') || null,
            acParts.join(' ') || null,
            propStr || null,
          ].filter(Boolean);

          const eligibleFlags = typeof window._sheetGetEligibleFlagsFor === 'function'
            ? window._sheetGetEligibleFlagsFor(item)
            : [];
          const activeWeaponOverrides = item?.equipped && typeof window._getActiveWeaponOverrides === 'function'
            ? window._getActiveWeaponOverrides().filter((override) => (
              (!override.weaponTypes || override.weaponTypes.includes(item?.type)) && !override.itemFlag
            ))
            : [];

          return {
            key: `${item?.name || 'item'}-${index}`,
            index,
            name: item?.name || 'Unknown',
            source: item?.source || '',
            sourceLabel,
            itemUrl: item?.source && !item?.custom
              ? `https://5e.tools/items.html#${String(item.name || '').toLowerCase()}_${String(item.source || '').toLowerCase()}`
              : '',
            custom: !!item?.custom,
            equipped: !!item?.equipped,
            type: item?.type || '',
            typeLabel,
            rarity,
            rarityLabel: rarity || typeLabel,
            rarityColor: ITEM_RARITY_COLOR[rarity] || 'var(--text3)',
            magicBonus,
            qty: Number(item?.qty) || 1,
            meta,
            entries: item?.entries || '',
            canEquip,
            eligibleFlags: eligibleFlags.map((flag) => ({
              key: flag.key,
              label: flag.label || flag.key,
              icon: flag.icon || '',
              active: Array.isArray(stored?.flags) && stored.flags.includes(flag.key),
            })),
            weaponOverrides: activeWeaponOverrides.map((override) => ({
              key: override.key,
              label: override.label || override.key,
              title: override.ability ? `Use ${String(override.ability).toUpperCase()} for attack and damage` : '',
              active: item?.weaponMod === override.key,
            })),
          };
        }),
    }))
    .filter((group) => group.items.length > 0);

  return {
    currency: {
      cp: Number(readCurrencyStorage().cp) || 0,
      sp: Number(readCurrencyStorage().sp) || 0,
      ep: Number(readCurrencyStorage().ep) || 0,
      gp: Number(readCurrencyStorage().gp) || 0,
      pp: Number(readCurrencyStorage().pp) || 0,
    },
    stats: {
      totalItems,
      totalWeight: totalWeightNumber.toFixed(1),
      totalValue: totalValueNumber.toFixed(1),
      maxCarry,
      pct,
      isOver,
      statusText: isOver ? 'Over Capacity' : 'OK',
      statusColor: isOver ? 'var(--red2)' : 'var(--green)',
      statusBg: isOver ? 'var(--redbg)' : 'var(--gbg)',
      barColor: isOver ? 'var(--red2)' : 'var(--green)',
    },
    groups,
    isEmpty: rows.length === 0,
  };
}

export function updateCurrency(coin, value) {
  if (typeof window.updateCurrencySheet === 'function') window.updateCurrencySheet(coin, value);
}

export function addCustomItem() {
  if (typeof window.addCustomItemSheet === 'function') window.addCustomItemSheet();
}

export function addInventoryItem(payload) {
  if (typeof window.addItemToInventory === 'function') {
    window.addItemToInventory(JSON.stringify(payload || {}));
  }
}

export function changeInventoryQty(index, delta) {
  if (typeof window.changeSheetInvQty === 'function') window.changeSheetInvQty(index, delta);
}

export function toggleInventoryEquip(index) {
  if (typeof window.toggleEquip === 'function') window.toggleEquip(index);
}

export function toggleInventoryFlag(index, key) {
  if (typeof window.toggleItemFlag === 'function') window.toggleItemFlag(index, key);
}

export function setInventoryWeaponOverride(index, key) {
  if (typeof window.setWeaponOverride === 'function') window.setWeaponOverride(index, key);
}

function getWeaponMasteries(character) {
  const out = new Set();
  if (!character?.choices) return out;
  for (const [key, rawValue] of Object.entries(character.choices)) {
    if (!rawValue) continue;
    const lowerKey = key.toLowerCase();
    if (!(lowerKey.includes('mastery') && lowerKey.includes('weapon'))) continue;
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    values.forEach((value) => {
      const normalized = String(value || '')
        .split('|')[0]
        .replace(/\{@\w+\s*/g, '')
        .replace(/[{}]/g, '')
        .trim()
        .toLowerCase();
      if (normalized) out.add(normalized);
    });
  }
  return out;
}

function getActionOwnerLevel(action, character) {
  if (Number.isFinite(Number(action?._ownerLevel))) return Number(action._ownerLevel);
  if (Number.isFinite(Number(action?.level))) return Number(action.level);
  if (action?._cls && action._cls !== 'Feat' && action._cls !== character?.speciesName) {
    const extra = (character?.extraClasses || []).find((entry) => entry?.name === action._cls);
    if (extra) return Number(extra.level || 1);
  }
  return Number(character?.classLevel || character?.level || 1);
}

function resolveActionValue(value, ctx, fallback = '') {
  if (typeof value === 'function') {
    try {
      return value(ctx);
    } catch {
      return fallback;
    }
  }
  return value ?? fallback;
}

function normalizeDiceFormula(formula) {
  return String(formula || '').replace(/\s+/g, '').replace(/\u2212/g, '-');
}

function extractActionDamageFormula(action, character) {
  const ctx = { character, action, ownerLevel: getActionOwnerLevel(action, character) };
  const candidates = [
    action?.healFormula,
    action?.damageFormula,
    action?.rollDamage,
    action?.damage,
  ];

  for (const candidate of candidates) {
    const value = resolveActionValue(candidate, ctx, '');
    if (typeof value === 'string' && /\d+d\d+/i.test(value)) return normalizeDiceFormula(value);
  }

  if (Array.isArray(action?.damageRolls)) {
    const first = action.damageRolls.find((roll) => (
      typeof roll === 'string' || typeof roll?.formula === 'string'
    ));
    const value = typeof first === 'string' ? first : first?.formula;
    if (value && /\d+d\d+/i.test(value)) return normalizeDiceFormula(value);
  }

  const desc = String(resolveActionValue(action?.desc, ctx, ''));
  const match = desc.match(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\b/i);
  return match ? normalizeDiceFormula(match[1]) : '';
}

function inferActionAttackBonus(action) {
  const { getPB, getMod, getFinal, getSpellAttackBonus } = window;
  if (typeof action?.attackBonus === 'number') return action.attackBonus;
  if (typeof getPB !== 'function' || typeof getMod !== 'function' || typeof getFinal !== 'function') return 0;

  if (typeof action?.attackAbility === 'string' && STATS.includes(action.attackAbility.toLowerCase())) {
    return getMod(getFinal(action.attackAbility.toLowerCase())) + getPB() + Number(action?.attackBonusExtra || 0);
  }

  const text = `${action?.name || ''} ${action?.desc || ''}`.toLowerCase();
  if ((action?.attackRoll === 'spell' || /\bspell\b|\bcantrip\b|\bmagic\b/.test(text)) && typeof getSpellAttackBonus === 'function') {
    return getSpellAttackBonus();
  }
  if (/\branged\b/.test(text)) return getMod(getFinal('dex')) + getPB();
  return Math.max(getMod(getFinal('str')), getMod(getFinal('dex'))) + getPB();
}

function computeWeaponAction(item, index, character) {
  const {
    getFinal,
    getMod,
    getPB,
    _sheetItemHasProperty,
    _getActiveWeaponOverrides,
    _sheetWeaponProficiencyInfo,
    _sheetHasNonProficientArmor,
  } = window;

  if (
    typeof getFinal !== 'function' ||
    typeof getMod !== 'function' ||
    typeof getPB !== 'function'
  ) return null;

  const props = item?.property || [];
  const isRanged = item?.type === 'R';
  const itemHasProperty = typeof _sheetItemHasProperty === 'function'
    ? (values) => _sheetItemHasProperty(item, values)
    : (values) => props.some((prop) => values.includes(prop));
  const isFinesse = itemHasProperty(['F', 'finesse']);
  const isOffHand = item?.hand === 'off';
  const isVersatile = itemHasProperty(['V', 'versatile']) && !!item?.dmg2;
  const isTwoHanded = isVersatile && item?.versatileHand === '2h';
  const bonus = parseInt(String(item?.bonusWeapon || '0').replace('+', ''), 10) || 0;

  const strMod = getMod(getFinal('str'));
  const dexMod = getMod(getFinal('dex'));
  const pb = getPB();
  const activeOverrides = typeof _getActiveWeaponOverrides === 'function' ? _getActiveWeaponOverrides() : [];
  const flagOverride = activeOverrides.find((override) => (
    override.itemFlag && Array.isArray(item?.flags) && item.flags.includes(override.itemFlag)
  ));
  const weaponOverride = flagOverride || (
    item?.weaponMod ? activeOverrides.find((override) => override.key === item.weaponMod) : null
  );
  const profInfo = typeof _sheetWeaponProficiencyInfo === 'function'
    ? _sheetWeaponProficiencyInfo(item, weaponOverride)
    : { proficient: true, source: '' };
  const profBonus = profInfo.proficient ? pb : 0;

  let attackAbility = 'str';
  let abilityMod = strMod;
  if (weaponOverride) {
    attackAbility = String(weaponOverride.ability || 'str').toLowerCase();
    abilityMod = getMod(getFinal(attackAbility));
  } else if (isRanged) {
    attackAbility = 'dex';
    abilityMod = dexMod;
  } else if (isFinesse) {
    attackAbility = dexMod > strMod ? 'dex' : 'str';
    abilityMod = Math.max(strMod, dexMod);
  }

  const attackBonus = abilityMod + profBonus + bonus;
  const damageMod = (isOffHand ? Math.min(0, abilityMod) : abilityMod) + bonus;
  const damageDie = (isTwoHanded ? item?.dmg2 : item?.dmg1) || '1d4';
  const damageFormula = `${damageDie}${damageMod >= 0 ? '+' : ''}${damageMod}`;
  const damageType = item?.dmgType || '';
  const propText = props.map((prop) => WEAPON_PROP_LABELS[prop] || prop).filter(Boolean).join(', ');
  const masterySet = getWeaponMasteries(character);
  const hasMastery = masterySet.has(String(item?.name || '').toLowerCase());
  const attackDis = typeof _sheetHasNonProficientArmor === 'function' &&
    _sheetHasNonProficientArmor() &&
    (attackAbility === 'str' || attackAbility === 'dex');
  const rarity = item?.rarity && item.rarity !== 'none' ? item.rarity : null;

  return {
    kind: 'weapon',
    key: `weapon-${index}-${item?.name || ''}`,
    category: isOffHand ? 'bonus' : 'attack',
    icon: isRanged ? 'crosshair' : 'swords',
    name: item?.name || 'Weapon',
    sub: [
      SOURCE_LABELS[item?.source] || item?.source || '',
      bonus > 0 ? `Magic +${bonus}` : '',
      propText,
      isOffHand ? 'no ability mod to damage' : '',
      weaponOverride ? `${String(weaponOverride.ability || '').toUpperCase()} mod` : '',
      !profInfo.proficient ? 'no PB to hit' : '',
    ].filter(Boolean),
    tags: [
      { label: 'ATK', cls: 'atk' },
      isOffHand ? { label: 'OFF', cls: 'util' } : null,
      isTwoHanded ? { label: '2H', cls: 'util' } : null,
      weaponOverride ? { label: String(weaponOverride.label || weaponOverride.key).toUpperCase(), cls: 'cls' } : null,
      !profInfo.proficient ? { label: 'NO PROF', cls: 'save' } : null,
      attackDis ? { label: 'DIS', cls: 'save' } : null,
      hasMastery ? { label: 'MASTERY', cls: 'util' } : null,
      rarity ? { label: rarity, cls: 'util', color: ITEM_RARITY_COLOR[rarity] } : null,
    ].filter(Boolean),
    stat: fbonus(attackBonus),
    attackBonus,
    attackLabel: `Attack: ${item?.name || 'Weapon'}`,
    attackAdv: attackDis ? false : undefined,
    damageFormula,
    damageLabel: `${damageDie}${damageMod >= 0 ? '+' : ''}${damageMod} ${damageType}`.trim(),
    range: isRanged ? (item?.range || 'varies') : `5 ft${itemHasProperty(['T', 'thrown']) ? ' / thrown' : ''}`,
    propText,
    bonus,
    hasMastery,
    index,
    isVersatile,
    isTwoHanded,
    isOffHand,
  };
}

export function computeActions() {
  const character = readActiveCharacter();
  if (!character) return { sections: [] };

  const rows = resolveInventoryRows();
  const equippedWeapons = rows
    .filter(({ item }) => item?.equipped && ['M', 'R'].includes(item.type) && item.hand !== 'off')
    .map(({ item, index }) => computeWeaponAction(item, index, character))
    .filter(Boolean);
  const offHandWeapons = rows
    .filter(({ item }) => item?.equipped && ['M', 'R'].includes(item.type) && item.hand === 'off')
    .map(({ item, index }) => computeWeaponAction(item, index, character))
    .filter(Boolean);

  const className = character.className || '';
  const level = Number(character.level || 1);
  const primaryLevel = Number(character.classLevel || level);
  const classActions = typeof window.getSheetClassActions === 'function'
    ? window.getSheetClassActions(className, primaryLevel)
    : [];
  const subKey = `${className}_${character.subclassShortName || ''}`;
  const subActions = typeof window.getSheetSubclassActions === 'function'
    ? window.getSheetSubclassActions(subKey, primaryLevel)
    : [];
  const extraActions = [];

  (character.extraClasses || []).forEach((extraClass, index) => {
    if (!extraClass?.name) return;
    const extraLevel = Number(extraClass.level || 1);
    const extraSubKey = `${extraClass.name}_${extraClass.subclassShortName || ''}`;
    const extraPrefix = `mc${index}_`;
    if (typeof window.getSheetClassActions === 'function') {
      extraActions.push(...window.getSheetClassActions(extraClass.name, extraLevel).map((action) => ({
        ...action,
        _cls: extraClass.name,
        _ownerLevel: extraLevel,
      })));
    }
    if (typeof window.getSheetSubclassActions === 'function') {
      extraActions.push(...window.getSheetSubclassActions(extraSubKey, extraLevel, extraPrefix).map((action) => ({
        ...action,
        _cls: extraClass.name,
        _ownerLevel: extraLevel,
      })));
    }
  });

  const speciesActions = typeof window.getSheetSpeciesActions === 'function'
    ? window.getSheetSpeciesActions(character.speciesName || '', character.speciesSource || '', level)
      .map((action) => ({ ...action, _cls: character.speciesName || 'Species', _ownerLevel: level }))
    : [];
  const featActions = [];
  (character.allFeatSnapshots || []).forEach((feat) => {
    if (!feat?.name || typeof window.getFeatSheetActions !== 'function') return;
    window.getFeatSheetActions(feat.name).forEach((action) => {
      featActions.push({ ...action, _cls: 'Feat', _ownerLevel: level });
    });
  });

  const allClassActions = [
    ...classActions.map((action) => ({ ...action, _cls: className, _ownerLevel: primaryLevel })),
    ...subActions.map((action) => ({ ...action, _cls: character.subclassShortName || className, _ownerLevel: primaryLevel })),
    ...extraActions,
    ...speciesActions,
    ...featActions,
  ].map((action, index) => {
    const ctx = { character, action, ownerLevel: getActionOwnerLevel(action, character) };
    const name = String(resolveActionValue(action.name, ctx, 'Action') || 'Action');
    const desc = String(resolveActionValue(action.desc, ctx, '') || '');
    const uses = String(resolveActionValue(action.uses, ctx, '') || '');
    const damageFormula = extractActionDamageFormula(action, character);
    const hasAttack = action?.attackRoll !== undefined ||
      action?.attackAbility !== undefined ||
      typeof action?.attackBonus === 'number';

    return {
      kind: 'class',
      key: `class-action-${index}-${name}`,
      category: action.cat === 'react' ? 'reaction' : (action.cat || 'action'),
      icon: action.icon || 'circle',
      name,
      uses,
      desc: cleanTaggedText(desc),
      tags: [
        { label: action.cat === 'bonus' ? 'BONUS' : action.cat === 'attack' ? 'ATK' : action.cat === 'reaction' || action.cat === 'react' ? 'REACT.' : 'ACTION', cls: action.cat === 'bonus' ? 'bonus' : action.cat === 'attack' ? 'atk' : action.cat === 'reaction' || action.cat === 'react' ? 'react' : 'util' },
        { label: String(action._cls || 'Class').toUpperCase(), cls: 'cls' },
      ],
      attackBonus: hasAttack ? inferActionAttackBonus(action) : null,
      attackLabel: `Attack: ${name}`,
      damageFormula,
      damageLabel: damageFormula,
    };
  });

  const unarmedAttackBonus = typeof window.getPB === 'function' && typeof window.getMod === 'function' && typeof window.getFinal === 'function'
    ? window.getPB() + window.getMod(window.getFinal('str'))
    : 0;
  const unarmedDamage = typeof window.getMod === 'function' && typeof window.getFinal === 'function'
    ? Math.max(1, 1 + window.getMod(window.getFinal('str')))
    : 1;
  const unarmed = {
    ...UNARMED_ACTION,
    kind: 'unarmed',
    key: 'unarmed-strike',
    category: 'attack',
    tags: [{ label: 'ATK', cls: 'atk' }],
    stat: fbonus(unarmedAttackBonus),
    attackBonus: unarmedAttackBonus,
    attackLabel: 'Unarmed Strike',
    flatDamage: unarmedDamage,
    damageLabel: `${unarmedDamage} bludgeoning`,
  };

  return {
    sections: [
      {
        key: 'attack',
        label: 'Attacks',
        icon: 'swords',
        items: [...equippedWeapons, unarmed, ...allClassActions.filter((action) => action.category === 'attack')],
        emptyHint: 'Go to Inventory, find a weapon and press Equip to see it here.',
      },
      {
        key: 'action',
        label: 'Actions',
        icon: 'target',
        items: [
          ...allClassActions.filter((action) => action.category === 'action' && action.uses !== 'Passive'),
        ],
      },
      {
        key: 'bonus',
        label: 'Bonus Actions',
        icon: 'zap',
        items: [
          ...offHandWeapons,
          ...allClassActions.filter((action) => action.category === 'bonus'),
        ],
        emptyHint: `No bonus actions specific to ${className || 'this class'}.`,
      },
      {
        key: 'reaction',
        label: 'Reactions',
        icon: 'rotate-ccw',
        items: [
          ...allClassActions.filter((action) => action.category === 'reaction'),
        ],
      },
    ],
  };
}

export function rollDamage(formula, label) {
  if (typeof window.rollDamage === 'function') window.rollDamage(formula, label);
}

export function rollFlatDamage(label, total, formulaLabel) {
  if (typeof window.showDiceToast === 'function') {
    window.showDiceToast('Damage', [], total, total, formulaLabel);
  } else if (typeof window.rollDamage === 'function') {
    window.rollDamage(String(total), label);
  }
}

export function toggleWeaponHand(index) {
  if (typeof window.toggleWeaponHand === 'function') window.toggleWeaponHand(index);
}

export function toggleVersatile(index) {
  if (typeof window.toggleVersatile === 'function') window.toggleVersatile(index);
}
