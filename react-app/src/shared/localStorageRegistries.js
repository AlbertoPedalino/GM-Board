export const REGISTRY_META = {
  gb_board_registry: {
    label: 'GM Board',
    prefix: (id) => `gb:board:${id}:`,
    activeKey: 'gb_active_board_id',
    route: (id) => `/gmboard?board=${encodeURIComponent(id)}`,
    newRoute: '/gmboard?board=new',
  },
  gb_encounter_registry: {
    label: 'Encounter',
    prefix: (id) => `gb:enc:${id}:`,
    activeKey: 'gb_active_encounter_id',
    route: (id) => `/encounter-builder?enc=${encodeURIComponent(id)}`,
    newRoute: '/encounter-builder?enc=new',
  },
  gb_char_registry: {
    label: 'Personaggio',
    prefix: (id) => `gb:char:${id}:`,
    activeKey: 'gb_active_char_id',
    route: (id) => `/charsheet?char=${encodeURIComponent(id)}`,
    newRoute: '/charbuilder?char=new',
  },
};

export function readRegistry(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]').filter((x) => x && x.id).slice(0, 10);
  } catch { return []; }
}

export function writeRegistry(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

export function getRegistryMeta(key) {
  return REGISTRY_META[key] || null;
}

export function deleteRegistryEntry(registryKey, id) {
  const meta = REGISTRY_META[registryKey];
  if (!meta) return false;
  if (!window.confirm(`Eliminare questo salvataggio ${meta.label} e tutti i suoi dati locali?`)) return false;

  const prefix = meta.prefix(id);
  Object.keys(localStorage)
    .filter((k) => k.startsWith(prefix))
    .forEach((k) => localStorage.removeItem(k));

  if (localStorage.getItem(meta.activeKey) === id) {
    localStorage.removeItem(meta.activeKey);
  }

  if (registryKey === 'gb_char_registry') {
    const UNSCOPED_KEYS = [
      '5e_current_char', '5e_builder_state', '5e_inventory', '5e_currency',
      '5e_hp_current', '5e_hp_max_bonus', '5e_hp_temp', '5e_death_saves',
      '5e_hd_used', '5e_hd_used_pools', '5e_slots_used', '5e_created_slots', '5e_inspiration',
      '5e_conditions_active', '5e_xp', '5e_notes', '5e_resources',
    ];
    UNSCOPED_KEYS.forEach((k) => localStorage.removeItem(k));
  }

  const next = readRegistry(registryKey).filter((entry) => entry.id !== id);
  writeRegistry(registryKey, next);
  return true;
}

export function renameRegistryEntry(registryKey, id, nextName) {
  const meta = REGISTRY_META[registryKey];
  if (!meta) return false;
  const name = nextName || prompt('Nome salvataggio', id);
  if (!name || !name.trim()) return false;
  const list = readRegistry(registryKey);
  const next = list.map((x) => x.id === id ? { ...x, name: name.trim(), updatedAt: Date.now() } : x);
  writeRegistry(registryKey, next);
  return true;
}
