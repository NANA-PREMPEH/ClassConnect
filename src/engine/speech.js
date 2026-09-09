import { getSetting, setSetting } from './storage.js';

export function getSpeechVoices() {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
}

export function speak(text, { onEnd } = {}) {
  if (!('speechSynthesis' in window) || !text) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ' '));
  utterance.rate = Number(getSetting('speechRate') || 1);
  utterance.pitch = Number(getSetting('speechPitch') || 1);
  const selectedVoice = getSetting('speechVoice');
  if (selectedVoice) {
    utterance.voice = getSpeechVoices().find((voice) => voice.name === selectedVoice) || null;
  }
  if (onEnd) utterance.addEventListener('end', onEnd, { once: true });
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

export function bindReadAloudControls(root = document) {
  root.querySelectorAll('[data-read-aloud-target]').forEach((button) => {
    if (button.dataset.readAloudBound === 'true') return;
    button.dataset.readAloudBound = 'true';
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.readAloudTarget);
      if (!target) return;

      const reading = button.dataset.reading === 'true';
      root.querySelectorAll('[data-read-aloud-target]').forEach((control) => {
        control.dataset.reading = 'false';
        control.setAttribute('aria-pressed', 'false');
        control.textContent = 'Listen';
      });
      if (reading) {
        stopSpeaking();
        return;
      }

      const clone = target.cloneNode(true);
      clone.querySelectorAll('[data-read-aloud-target]').forEach((control) => control.remove());
      button.dataset.reading = 'true';
      button.setAttribute('aria-pressed', 'true');
      button.textContent = 'Stop';
      if (!speak(clone.textContent.trim(), {
        onEnd: () => {
          button.dataset.reading = 'false';
          button.setAttribute('aria-pressed', 'false');
          button.textContent = 'Listen';
        }
      })) {
        button.dataset.reading = 'false';
        button.setAttribute('aria-pressed', 'false');
        button.textContent = 'Listen';
      }
    });
  });
}
