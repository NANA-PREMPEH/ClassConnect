/**
 * ClassConnect — Theme Engine
 */

import { getSetting, setSetting } from './storage.js';

const DEFAULT_THEME = 'dark';

function normalizeTheme(theme) {
  return theme === 'light' ? 'light' : DEFAULT_THEME;
}

export function getCurrentTheme() {
  return normalizeTheme(getSetting('theme'));
}

export function applyTheme(theme) {
  const nextTheme = normalizeTheme(theme);
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
  return nextTheme;
}

export function setTheme(theme) {
  const nextTheme = applyTheme(theme);
  setSetting('theme', nextTheme);
  return nextTheme;
}

export function toggleTheme() {
  return setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
}

export function initTheme() {
  return applyTheme(getCurrentTheme());
}
