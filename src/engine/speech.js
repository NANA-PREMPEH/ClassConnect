import { getSetting, setSetting } from './storage.js';

export function speak(text) {
  if (!('speechSynthesis' in window) || !text) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ' '));
  utterance.rate = Number(getSetting('speechRate') || 1);
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() { window.speechSynthesis?.cancel(); }

export function applyAccessibilitySettings() {
  const root = document.documentElement;
  root.dataset.contrast = getSetting('highContrast') === 'true' ? 'high' : 'standard';
  root.dataset.readingFont = getSetting('dyslexiaFont') === 'true' ? 'dyslexia' : 'standard';
  root.dataset.fontScale = getSetting('fontScale') || 'standard';
}

export function saveAccessibilitySettings(settings) {
  Object.entries(settings).forEach(([key, value]) => setSetting(key, String(value)));
  applyAccessibilitySettings();
}
