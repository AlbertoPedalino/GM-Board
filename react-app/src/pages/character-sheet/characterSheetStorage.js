export const SHEET_KEYS = [
  '5e_current_char',
  '5e_inventory',
  '5e_currency',
  '5e_xp',
  '5e_hp_current',
  '5e_hp_temp',
  '5e_hp_max_bonus',
  '5e_death_saves',
  '5e_conditions_active',
  '5e_hd_used',
  '5e_slots_used',
  '5e_notes',
  '5e_skill_adv',
  '5e_resources',
  '5e_builder_state',
  '5e_inspiration',
];

const XP_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000,
  305000, 355000,
];

export function cleanCharacterId(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 48);
}

export function configureCharacterSheetScope() {
  if (!window.__gbRawStorage) {
    window.__gbRawStorage = {
      getItem: Storage.prototype.getItem,
      setItem: Storage.prototype.setItem,
      removeItem: Storage.prototype.removeItem,
    };
  }

  const raw = window.__gbRawStorage;
  const params = new URLSearchParams(window.location.search);
  let id = cleanCharacterId(params.get('char'));

  if (id === 'new') {
    id = `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    window.history.replaceState(null, '', `${window.location.pathname}?char=${encodeURIComponent(id)}`);
  }

  if (!id) {
    id = cleanCharacterId(raw.getItem.call(localStorage, 'gb_active_char_id')) || 'default';
  }

  raw.setItem.call(localStorage, 'gb_active_char_id', id);
  window.GB_CHAR_ID = id;
  window.GB_SHEET_KEYS = SHEET_KEYS;
  window.__gbCharacterSheetCharId = id;
  window.gbScopedHref = (page) => `${page}?char=${encodeURIComponent(window.__gbCharacterSheetCharId || id)}`;
  window.gbRegisterCharScope = function gbRegisterCharScope(label) {
    const currentId = window.__gbCharacterSheetCharId || id;
    const rawRegistry = raw.getItem.call(localStorage, 'gb_char_registry') || '[]';
    let list = [];
    try {
      list = JSON.parse(rawRegistry);
    } catch {
      list = [];
    }

    const now = Date.now();
    const existing = list.find((entry) => entry && entry.id === currentId);
    const name = (existing && existing.name) || String(label || '').trim() || currentId;
    list = [
      { id: currentId, name, updatedAt: now },
      ...list.filter((entry) => entry && entry.id !== currentId),
    ].slice(0, 20);
    raw.setItem.call(localStorage, 'gb_char_registry', JSON.stringify(list));
  };

  if (!window.__gbCharacterSheetStoragePatched) {
    const scopedKeys = new Set(SHEET_KEYS);
    const scoped = (key) => {
      const keyName = String(key || '');
      const currentId = window.__gbCharacterSheetCharId || 'default';
      return scopedKeys.has(keyName) ? `gb:char:${currentId}:${keyName}` : key;
    };

    Storage.prototype.getItem = function getItem(key) {
      return raw.getItem.call(this, scoped(key));
    };
    Storage.prototype.setItem = function setItem(key, value) {
      return raw.setItem.call(this, scoped(key), value);
    };
    Storage.prototype.removeItem = function removeItem(key) {
      return raw.removeItem.call(this, scoped(key));
    };
    window.__gbCharacterSheetStoragePatched = true;
  }
}

export function readJsonStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getClassSummary(character) {
  if (!character) return '';

  const extra = Array.isArray(character.extraClasses) ? character.extraClasses : [];
  const extraLevel = extra.reduce((sum, entry) => sum + (Number(entry?.level) || 1), 0);
  const primaryLevel = character.classLevel || ((Number(character.level) || 1) - extraLevel);
  const subclass = character.subclassShortName ? ` (${character.subclassShortName})` : '';

  if (!extra.length) {
    return `${character.className || '-'}${subclass} Lv.${character.level || 1}`;
  }

  const parts = [`${character.className || '-'}${subclass} ${primaryLevel}`];
  extra.forEach((entry) => {
    const entrySubclass = entry?.subclassShortName ? ` (${entry.subclassShortName})` : '';
    parts.push(`${entry?.name || '-'}${entrySubclass} ${entry?.level || 1}`);
  });

  return `${parts.join(' / ')} [Lv.${character.level || 1}]`;
}

function getXpState(character) {
  const level = Math.min(Number(character?.level || 1), 20);
  const xp = parseInt(localStorage.getItem('5e_xp') || character?.xp || 0, 10) || 0;
  const curLvXP = XP_THRESHOLDS[level - 1] || 0;
  const nextLvXP = level >= 20 ? XP_THRESHOLDS[19] : XP_THRESHOLDS[level] || XP_THRESHOLDS[19];
  const pct = level >= 20
    ? 100
    : Math.max(0, Math.min(100, Math.round(((xp - curLvXP) / (nextLvXP - curLvXP)) * 100)));

  return {
    xp,
    pct,
    label: level >= 20 ? 'MAX' : `-> Lv.${level + 1} (${nextLvXP.toLocaleString()})`,
  };
}

export function readCharacterSheetHeader() {
  configureCharacterSheetScope();

  const character = readJsonStorage('5e_current_char');
  if (!character) {
    return {
      hasCharacter: false,
      name: 'No character found',
      meta: 'Go back to the builder to create a character',
      avatar: '?',
      xp: 0,
      xpPct: 0,
      xpLabel: 'XP',
    };
  }

  const classSummary = getClassSummary(character);
  const xp = getXpState(character);

  if (typeof window.gbRegisterCharScope === 'function') {
    window.gbRegisterCharScope(character.name || character.className || 'Unnamed Character');
  }

  return {
    hasCharacter: true,
    name: character.name || 'Unnamed Character',
    meta: [character.speciesName, classSummary, character.bgName].filter(Boolean).join(' / '),
    avatar: (character.name || '?')[0].toUpperCase(),
    xp: xp.xp,
    xpPct: xp.pct,
    xpLabel: xp.label,
  };
}

export function writeSheetXp(nextXp) {
  const xp = parseInt(nextXp, 10) || 0;
  localStorage.setItem('5e_xp', String(xp));
  return xp;
}

export function readCharacterSheetTabs() {
  return {
    spellsHtml: document.getElementById('spells-wrap')?.innerHTML || '',
  };
}
