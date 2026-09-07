export const DEFAULT_SHEET_SPLIT = 60;
export const MIN_MAP_SPLIT = 35;
export const MAX_MAP_SPLIT = 72;
// A landscape phone can be wide enough for two columns but too short to read
// either. Compact sheets use the whole workspace in both orientations.
export const SHEET_COMPACT_QUERY = '(max-width: 767px), (max-height: 500px)';
export const SHEET_SIDE_BY_SIDE_QUERY = '@media (min-width: 768px) and (min-height: 501px)';

export function normalizeSheetSplit(value) {
  if (value === null || value === undefined || value === '') return DEFAULT_SHEET_SPLIT;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_SHEET_SPLIT;
  const clamped = Math.max(MIN_MAP_SPLIT, Math.min(MAX_MAP_SPLIT, parsed));
  return Math.round(clamped * 10) / 10;
}

export function sheetSplitAtPointer(clientX, left, width) {
  if (!Number.isFinite(width) || width <= 0) return DEFAULT_SHEET_SPLIT;
  return normalizeSheetSplit(((Number(clientX) - Number(left || 0)) / width) * 100);
}

export function sheetGridColumns(value) {
  const map = normalizeSheetSplit(value);
  return `minmax(0, ${map}fr) 12px minmax(360px, ${100 - map}fr)`;
}

export function readSheetSplit(storage, key) {
  try {
    return normalizeSheetSplit(storage?.getItem(key));
  } catch (_) {
    return DEFAULT_SHEET_SPLIT;
  }
}

export function writeSheetSplit(storage, key, value) {
  const normalized = normalizeSheetSplit(value);
  try {
    storage?.setItem(key, String(normalized));
  } catch (_) {
    // Layout preference is optional; a blocked storage must not affect play.
  }
  return normalized;
}
