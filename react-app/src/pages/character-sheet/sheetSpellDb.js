const SPELL_BASE_URL = 'https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/main/data/';
const SPELL_FILES = [
  'spells/spells-xphb.json',
  'spells/spells-fraif.json',
  'spells/spells-frhof.json',
  'spells/spells-efa.json',
];
const ALLOWED_SOURCES = new Set(['XPHB', 'FRAiF', 'FRHoF', 'EFA']);

let cache = null;
let loadPromise = null;

function adapt(spell) {
  // Return spell as-is, no legacy adaptation
  return spell;
}

async function fetchAll() {
  const out = [];
  const seen = new Set();
  for (const file of SPELL_FILES) {
    try {
      const res = await fetch(SPELL_BASE_URL + file);
      if (!res.ok) continue;
      const data = await res.json();
      for (const spell of data?.spell || []) {
        if (!ALLOWED_SOURCES.has(spell.source)) continue;
        if (seen.has(spell.name)) continue;
        seen.add(spell.name);
        out.push(adapt(spell));
      }
    } catch {
      // ignore
    }
  }
  return out;
}

export function loadSheetSpellDb() {
  if (cache) return Promise.resolve(cache);
  if (loadPromise) return loadPromise;
  loadPromise = fetchAll()
    .then((arr) => {
      cache = arr;
      return cache;
    })
    .catch((err) => {
      loadPromise = null;
      throw err;
    });
  return loadPromise;
}

export function lookupSheetSpell(name) {
  if (!cache) return null;
  const lower = String(name || '').toLowerCase();
  return cache.find((spell) => String(spell?.name || '').toLowerCase() === lower) || null;
}

export function isSheetSpellDbLoaded() {
  return !!cache;
}
