function getStorage() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch (_) {
    return null;
  }
}

export function getStorageItem(key, fallback = null) {
  try {
    const storage = getStorage();
    const value = storage?.getItem(key);
    return value == null ? fallback : value;
  } catch (_) {
    return fallback;
  }
}

export function setStorageItem(key, value) {
  try {
    getStorage()?.setItem(key, String(value));
  } catch (_) {}
}

export function removeStorageItem(key) {
  try {
    getStorage()?.removeItem(key);
  } catch (_) {}
}

export function getStorageJson(key, fallback = null) {
  const raw = getStorageItem(key, null);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

export function setStorageJson(key, value) {
  setStorageItem(key, JSON.stringify(value));
}
