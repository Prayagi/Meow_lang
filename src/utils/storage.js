/**
 * localStorage helpers for the Meow coding platform.
 * All keys are prefixed with "meow_" to avoid collisions.
 * Every function is SSR-safe — returns fallbacks when window is unavailable.
 */

const PREFIX = "meow_";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Save a value to localStorage (JSON-serialised).
 * @param {string} key  — unprefixed key
 * @param {*}      value
 */
export function save(key, value) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — fail silently
  }
}

/**
 * Load a value from localStorage.
 * @param {string} key          — unprefixed key
 * @param {*}      fallback     — returned when the key doesn't exist or we're on the server
 * @returns {*}
 */
export function load(key, fallback = null) {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Remove a single key from localStorage.
 * @param {string} key — unprefixed key
 */
export function remove(key) {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

/**
 * Clear ALL meow-prefixed keys from localStorage.
 */
export function clearAll() {
  if (!isBrowser()) return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(PREFIX)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

/**
 * Check if a key exists.
 * @param {string} key — unprefixed key
 * @returns {boolean}
 */
export function has(key) {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(PREFIX + key) !== null;
}
