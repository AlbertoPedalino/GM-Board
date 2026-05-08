/**
 * Spell slot and resource management functions
 * Direct localStorage implementation, no legacy fallbacks
 */

function dispatchSheetSnapshotChange() {
  if (typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('gb-sheet-snapshot-change'));
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

/**
 * Toggle spell slot used/unused for a given level
 * @param {number} level 1-9
 * @param {number} index Slot index (0-based)
 */
export function toggleSpellSlot(level, index) {
  try {
    const usedSlots = readJsonLs('5e_slots_used', {}) || {};
    const key = `slot_${level}`;
    const used = usedSlots[key] || [];
    
    if (used.includes(index)) {
      used.splice(used.indexOf(index), 1);
    } else {
      used.push(index);
    }
    
    usedSlots[key] = used;
    localStorage.setItem('5e_slots_used', JSON.stringify(usedSlots));
    dispatchSheetSnapshotChange();
  } catch {
    // ignore
  }
}

/**
 * Toggle pact slot used/unused
 * @param {number} level Pact slot level (typically 1-5)
 * @param {number} total Total pact slots at this level
 * @param {number} index Slot index (0-based)
 */
export function togglePactSlot(level, total, index) {
  try {
    const usedSlots = readJsonLs('5e_slots_used', {}) || {};
    const key = `pact_${level}`;
    const used = usedSlots[key] || [];
    
    if (used.includes(index)) {
      used.splice(used.indexOf(index), 1);
    } else {
      used.push(index);
    }
    
    usedSlots[key] = used;
    localStorage.setItem('5e_slots_used', JSON.stringify(usedSlots));
    dispatchSheetSnapshotChange();
  } catch {
    // ignore
  }
}

/**
 * Get which spell slots are marked as used
 * @param {number} level 1-9 for regular, or pactX for pact slots
 * @returns {number[]} Array of used slot indices
 */
export function getUsedSlots(type, level) {
  try {
    const usedSlots = readJsonLs('5e_slots_used', {}) || {};
    const key = `${type}_${level}`;
    return usedSlots[key] || [];
  } catch {
    return [];
  }
}

/**
 * Mark specific spell slots as used in bulk
 * @param {object} slotsMap { 'slot_1': [0, 2], 'pact_2': [1] }
 */
export function setUsedSlots(slotsMap) {
  try {
    localStorage.setItem('5e_slots_used', JSON.stringify(slotsMap || {}));
    dispatchSheetSnapshotChange();
  } catch {
    // ignore
  }
}

/**
 * Load resources from localStorage (initializes charResources global if needed)
 * In React context, this just returns the data - UI manages state separately
 */
export function loadResources() {
  try {
    return readJsonLs('5e_resources', {}) || {};
  } catch {
    return {};
  }
}

/**
 * Save resources to localStorage
 * @param {object} resources Resource state
 */
export function saveResources(resources) {
  try {
    localStorage.setItem('5e_resources', JSON.stringify(resources || {}));
    dispatchSheetSnapshotChange();
  } catch {
    // ignore
  }
}
