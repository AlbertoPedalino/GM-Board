const MASTERY_NAMES = ['Sap', 'Vex', 'Topple', 'Push', 'Slow', 'Cleave', 'Graze', 'Nick'];

const WEAPON_MASTERY_FALLBACK = {
  club: 'Slow',
  dagger: 'Nick',
  greatclub: 'Push',
  handaxe: 'Vex',
  javelin: 'Slow',
  lighthammer: 'Nick',
  mace: 'Sap',
  quarterstaff: 'Topple',
  sickle: 'Nick',
  spear: 'Sap',
  lightcrossbow: 'Slow',
  dart: 'Vex',
  shortbow: 'Vex',
  sling: 'Slow',
  battleaxe: 'Topple',
  flail: 'Sap',
  glaive: 'Graze',
  greataxe: 'Cleave',
  greatsword: 'Graze',
  halberd: 'Cleave',
  lance: 'Topple',
  longsword: 'Sap',
  maul: 'Topple',
  morningstar: 'Sap',
  pike: 'Push',
  rapier: 'Vex',
  scimitar: 'Nick',
  shortsword: 'Vex',
  trident: 'Topple',
  warpick: 'Sap',
  warhammer: 'Push',
  whip: 'Slow',
  blowgun: 'Vex',
  handcrossbow: 'Vex',
  heavycrossbow: 'Push',
  longbow: 'Slow',
  musket: 'Slow',
  pistol: 'Vex',
};

const MASTERY_DESCRIPTIONS = {
  Sap: "The target has disadvantage on its next attack roll before the start of your next turn.",
  Vex: "You have advantage on your next attack roll against the target before the end of your next turn.",
  Topple: 'The target must save or fall Prone.',
  Push: 'You can push the target.',
  Slow: "You reduce the target's speed.",
  Cleave: 'You can make an extra attack against another creature near the target.',
  Graze: 'You deal ability modifier damage even on a miss.',
  Nick: 'You can make the extra Light weapon attack as part of the Attack action.',
};

function asArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.flatMap(asArray);
  if (value instanceof Set) return Array.from(value).flatMap(asArray);
  return [value];
}

function cleanTagText(value) {
  return String(value || '')
    .replace(/\{@[a-z]+ ([^|}]+)(?:\|[^}]*)?\}/gi, '$1')
    .replace(/[{}]/g, '')
    .trim();
}

function compactKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function splitNameAndSource(value) {
  const raw = cleanTagText(value);
  if (!raw) return { name: '', source: '' };
  const [namePart, sourcePart] = raw.split('|');
  return {
    name: String(namePart || '').trim(),
    source: String(sourcePart || '').trim(),
  };
}

function toTitleCase(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

function aliasWeaponKey(key) {
  if (key === 'crossbowlight') return 'lightcrossbow';
  if (key === 'crossbowhand') return 'handcrossbow';
  if (key === 'crossbowheavy') return 'heavycrossbow';
  return key;
}

function parseChoiceValue(value) {
  if (value == null) return [];
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return [splitNameAndSource(value)];
  }
  if (Array.isArray(value)) return value.flatMap(parseChoiceValue);
  if (typeof value === 'object') {
    const candidate = value.name ?? value.label ?? value.value ?? value.key ?? value.id ?? '';
    const parsed = splitNameAndSource(candidate);
    if (!parsed.name) {
      return Object.values(value).flatMap(parseChoiceValue);
    }
    return [parsed];
  }
  return [];
}

function itemMasteryFromProperties(item) {
  const properties = [...asArray(item?.property), ...asArray(item?.properties)].map((prop) => String(prop).trim());
  for (const prop of properties) {
    const exact = MASTERY_NAMES.find((name) => compactKey(name) === compactKey(prop));
    if (exact) return exact;
  }
  return null;
}

function itemMasteryFromEntries(item) {
  const entriesText = asArray(item?.entries).join(' ');
  const lower = entriesText.toLowerCase();
  return MASTERY_NAMES.find((name) => lower.includes(name.toLowerCase())) || null;
}

function fallbackMasteryForWeaponName(weaponName) {
  const key = aliasWeaponKey(compactKey(weaponName));
  return WEAPON_MASTERY_FALLBACK[key] || null;
}

export function normalizeWeaponName(value) {
  const { name } = splitNameAndSource(typeof value === 'object' ? (value?.name ?? value?.label ?? value?.value ?? '') : value);
  if (!name) return '';
  return toTitleCase(name.replace(/,\s*\+\d+$/i, '').replace(/\s*\+\d+$/i, '').trim());
}

export function collectWeaponMasteryChoiceEntries(character) {
  const choices = character?.choices && typeof character.choices === 'object' ? character.choices : {};
  const out = [];

  Object.entries(choices).forEach(([key, rawValue]) => {
    const keyNorm = compactKey(key);
    if (!(keyNorm.includes('weapon') && keyNorm.includes('mastery'))) return;
    parseChoiceValue(rawValue).forEach((parsed) => {
      const normalizedName = normalizeWeaponName(parsed.name);
      if (!normalizedName) return;
      out.push({
        key,
        weaponName: normalizedName,
        source: parsed.source || '',
      });
    });
  });

  const seen = new Set();
  return out.filter((entry) => {
    const dedupeKey = `${compactKey(entry.key)}|${compactKey(entry.weaponName)}|${compactKey(entry.source)}`;
    if (seen.has(dedupeKey)) return false;
    seen.add(dedupeKey);
    return true;
  });
}

export function resolveWeaponMasteryForItem(item) {
  if (!item || typeof item !== 'object') return null;
  const direct = item.mastery ?? item.weaponMastery ?? item.masteryProperty ?? item.masteryName;
  if (typeof direct === 'string' && direct.trim()) {
    const exact = MASTERY_NAMES.find((name) => compactKey(name) === compactKey(direct));
    if (exact) return exact;
  }
  if (Array.isArray(direct)) {
    const first = direct.map((value) => String(value || '').trim()).find(Boolean);
    const exact = MASTERY_NAMES.find((name) => compactKey(name) === compactKey(first));
    if (exact) return exact;
  }
  return itemMasteryFromProperties(item) || itemMasteryFromEntries(item) || fallbackMasteryForWeaponName(item.name);
}

export function findWeaponItemByName(items, weaponName, source = '') {
  const targetName = aliasWeaponKey(compactKey(normalizeWeaponName(weaponName)));
  const targetSource = compactKey(source);
  if (!targetName) return null;

  const weaponItems = asArray(items).filter((item) => item && typeof item === 'object');
  const direct = weaponItems.find((item) => {
    const itemName = aliasWeaponKey(compactKey(normalizeWeaponName(item.name)));
    if (itemName !== targetName) return false;
    if (!targetSource) return true;
    return compactKey(item.source) === targetSource;
  });
  if (direct) return direct;

  return weaponItems.find((item) => aliasWeaponKey(compactKey(normalizeWeaponName(item.name))) === targetName) || null;
}

export function collectResolvedWeaponMasteries(character, items = []) {
  const entries = collectWeaponMasteryChoiceEntries(character);
  const out = [];
  const seen = new Set();

  entries.forEach((entry) => {
    const item = findWeaponItemByName(items, entry.weaponName, entry.source);
    const mastery = resolveWeaponMasteryForItem(item) || fallbackMasteryForWeaponName(entry.weaponName);
    const dedupeKey = compactKey(entry.weaponName);
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    out.push({
      key: entry.key,
      weaponName: entry.weaponName,
      source: entry.source || '',
      mastery: mastery || null,
    });
  });

  return out.sort((a, b) => a.weaponName.localeCompare(b.weaponName));
}

export function getWeaponMasteryReminderText(mastery) {
  return MASTERY_DESCRIPTIONS[mastery] || '';
}

export function getWeaponMasteryFallbackMap() {
  return { ...WEAPON_MASTERY_FALLBACK };
}
