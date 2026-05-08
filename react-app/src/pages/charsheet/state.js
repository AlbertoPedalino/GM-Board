import { getMod, getFinal, calcMaxHP, getSkillProficiency, getSkillBonus, getPB, hasSaveProficiency, getSaveBonus, getLevelFromXp, getXpForNextLevel } from './logic/calculations.js';
import { mapCharacterToBuilderState } from '../../shared/builderSync.js';

export function loadCharacter() {
  try {
    const raw = localStorage.getItem('5e_current_char');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function loadSheetState(C) {
  const rawHP = parseInt(localStorage.getItem('5e_hp_current'));
  const rawMaxBonus = parseInt(localStorage.getItem('5e_hp_max_bonus'));
  const baseMax = Math.max(1, calcMaxHP(C));
  const maxHPBonus = isNaN(rawMaxBonus) ? 0 : rawMaxBonus;
  const maxHP = Math.max(1, baseMax + maxHPBonus);
  let currentHP = isNaN(rawHP) ? maxHP : rawHP;
  currentHP = Math.max(0, Math.min(maxHP, currentHP));
  const tempHP = Math.max(0, parseInt(localStorage.getItem('5e_hp_temp')) || 0);

  let deathSaves = { success: 0, fail: 0 };
  try {
    const ds = JSON.parse(localStorage.getItem('5e_death_saves') || '{}');
    deathSaves = {
      success: Math.max(0, Math.min(3, parseInt(ds.success) || 0)),
      fail: Math.max(0, Math.min(3, parseInt(ds.fail) || 0)),
    };
  } catch {}

  const usedHD = parseInt(localStorage.getItem('5e_hd_used')) || 0;

  let spellSlotUsed = {};
  try { spellSlotUsed = JSON.parse(localStorage.getItem('5e_slots_used') || '{}'); } catch {}

  let sheetInventory = [];
  try { sheetInventory = JSON.parse(localStorage.getItem('5e_inventory') || JSON.stringify(C.inventory || [])); } catch { sheetInventory = C.inventory || []; }
  if (Array.isArray(sheetInventory) && !sheetInventory.length && Array.isArray(C?.inventory) && C.inventory.length) {
    sheetInventory = JSON.parse(JSON.stringify(C.inventory));
  }

  let sheetCurrency = { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 };
  try { sheetCurrency = JSON.parse(localStorage.getItem('5e_currency') || JSON.stringify(C.currency || sheetCurrency)); } catch {}

  const sheetInspiration = localStorage.getItem('5e_inspiration') === 'true' || C?.inspiration || false;

  let activeConditions = [];
  try {
    const raw = JSON.parse(localStorage.getItem('5e_conditions_active') || '[]');
    if (Array.isArray(raw)) activeConditions = raw;
  } catch {}

  const xpStored = parseInt(localStorage.getItem('5e_xp') || C.xp || 0);

  const notes = localStorage.getItem('5e_notes') || '';

  return {
    currentHP, maxHP, maxHPBonus, tempHP, deathSaves, usedHD, spellSlotUsed,
    sheetInventory, sheetCurrency, sheetInspiration, activeConditions, xpStored, notes,
  };
}

export function saveHPState(currentHP, tempHP, maxHPBonus) {
  localStorage.setItem('5e_hp_current', String(currentHP));
  localStorage.setItem('5e_hp_temp', String(tempHP));
  localStorage.setItem('5e_hp_max_bonus', String(maxHPBonus));
}

export function saveDeathSaves(deathSaves) {
  localStorage.setItem('5e_death_saves', JSON.stringify(deathSaves));
}

export function saveInspiration(val) {
  localStorage.setItem('5e_inspiration', val ? 'true' : 'false');
}

export function saveConditions(conditions) {
  localStorage.setItem('5e_conditions_active', JSON.stringify(conditions));
}

export function saveInventory(inventory) {
  localStorage.setItem('5e_inventory', JSON.stringify(inventory || []));
}

export function saveCurrency(currency) {
  localStorage.setItem('5e_currency', JSON.stringify(currency || {}));
}

export function saveCurrentCharacter(character) {
  localStorage.setItem('5e_current_char', JSON.stringify(character));
  syncBuilderState(character);
}

function syncBuilderState(character) {
  if (!character || typeof character !== 'object') return;
  try {
    const previous = JSON.parse(localStorage.getItem('5e_builder_state') || '{}');
    const mapped = mapCharacterToBuilderState(character);
    localStorage.setItem('5e_builder_state', JSON.stringify({ ...previous, ...mapped }));
  } catch {}
}

export function loadResources(C) {
  try {
    const raw = localStorage.getItem('5e_resources');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch { return {}; }
}

export function saveResources(resources) {
  localStorage.setItem('5e_resources', JSON.stringify(resources));
}

export function getEncumberedLevel(C, inventory) {
  if (!C) return 0;
  const strength = getFinal(C, 'str');
  const carryCap = strength * 15;
  const totalWeight = (inventory || []).reduce((s, i) => s + ((i.weight || i.weightLb || 0) * (i.qty || i.quantity || 1)), 0);
  if (totalWeight > carryCap) return 2;
  if (totalWeight > carryCap * 0.666) return 1;
  return 0;
}
