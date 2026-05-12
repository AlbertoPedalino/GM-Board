import { setStorageJson } from '../storage.js';

export function getCreatedSpellSlots(sheet) {
  return (sheet?.createdSpellSlots) || {};
}

export function getAvailableRegularSlots(regularSlots, sheet, level) {
  const idx = Number(level) - 1;
  if (idx < 0 || idx >= regularSlots.length) return 0;
  const max = Number(regularSlots[idx] || 0);
  const used = Number(sheet?.spellSlotUsed?.[level] ?? 0);
  const created = Number((sheet?.createdSpellSlots?.[level]) || 0);
  return Math.max(0, max - used + created);
}

export function persistCreatedSlots(createdSlots, onUpdateSheet) {
  setStorageJson('5e_created_slots', createdSlots);
  if (typeof onUpdateSheet === 'function') onUpdateSheet({ createdSpellSlots: createdSlots });
}

export function consumeSlot(regularSlots, sheet, level, onUpdateSheet) {
  const idx = Number(level) - 1;
  if (idx < 0 || idx >= regularSlots.length) return false;
  const max = Number(regularSlots[idx] || 0);
  const used = Number(sheet?.spellSlotUsed?.[level] ?? 0);
  const created = Number((sheet?.createdSpellSlots?.[level]) || 0);
  const available = max - used + created;
  if (available <= 0) return false;

  if (created > 0) {
    const next = { ...(sheet?.createdSpellSlots || {}) };
    next[level] = created - 1;
    if (next[level] <= 0) delete next[level];
    persistCreatedSlots(next, onUpdateSheet);
  } else {
    const next = { ...(sheet?.spellSlotUsed || {}) };
    next[level] = used + 1;
    setStorageJson('5e_slots_used', next);
    if (typeof onUpdateSheet === 'function') onUpdateSheet({ spellSlotUsed: next });
  }
  return true;
}
