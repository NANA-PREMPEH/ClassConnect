/**
 * ClassConnect — Navigation Component
 */

import { getCurrentTheme, toggleTheme } from '../engine/theme.js';
import { getSetting } from '../engine/storage.js';
import { getSpeechVoices, saveAccessibilitySettings } from '../engine/speech.js';

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function renderVoiceOptions() {
  const selectedVoice = getSetting('speechVoice');
  const voices = getSpeechVoices();
  return `<option value="">Device default</option>${voices.map((voice) => `<option value="${esc(voice.name)}" ${voice.name === selectedVoice ? 'selected' : ''}>${esc(`${voice.name} (${voice.lang})`)}</option>`).join('')}`;
}

function renderThemeIcon(theme) {
  if (theme === 'light') {
    return `
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3V1.5M10 18.5V17M4.34 4.34L3.28 3.28M16.72 16.72L15.66 15.66M3 10H1.5M18.5 10H17M4.34 15.66L3.28 16.72M16.72 3.28L15.66 4.34M13.5 10A3.5 3.5 0 116.5 10A3.5 3.5 0 0113.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  return `
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15.5 12.5A6.5 6.5 0 017.5 4.5A6.5 6.5 0 1015.5 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `;
}

function renderThemeButton() {
  const theme = getCurrentTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return `
    <button class="btn btn--icon btn--ghost nav__theme-btn" id="nav-theme-btn" aria-label="Switch to ${nextTheme} theme" title="Switch to ${nextTheme} theme">
      ${renderThemeIcon(theme)}
    </button>
  `;
}

export function renderNav(options = {}) {
  const {
    title = 'ClassConnect',
    showBack = false,
    backLabel = 'Back',
    studentName = null,
    showSettings = false,
    showLogout = Boolean(studentName && ['My learning', 'Lesson library', 'My progress', 'Review', 'Lesson'].includes(title)),
    logoutLabel = 'Sign out',
    showThemeToggle = true
  } = options;

  return `
    <nav class="nav" id="main-nav">
      <div class="container">
        <div class="nav__inner">
          <div class="nav__left">
            ${showBack ? `
              <button class="nav__back-btn" id="nav-back-btn" aria-label="Go back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${backLabel}</span>
              </button>
            ` : `
              <div class="nav__brand" id="nav-brand">
                <svg class="nav__logo" width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <rect x="4" y="8" width="56" height="40" rx="4" stroke="#818CF8" stroke-width="3" fill="none"/>
                  <rect x="20" y="52" width="24" height="4" rx="2" fill="#818CF8"/>
                  <circle cx="32" cy="28" r="8" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
                  <path d="M32 20v8l5.5 3" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span class="nav__brand-text">${title}</span>
              </div>
            `}
          </div>
          <div class="nav__right">
            ${studentName ? `
              <span class="nav__student-name">
                <span class="nav__student-icon">Student</span>
                ${studentName}
              </span>
            ` : ''}
            <span class="nav__status" id="nav-status">
              <span class="status-dot ${navigator.onLine ? 'status-dot--online' : 'status-dot--offline'}" id="status-dot"></span>
              <span class="nav__status-text" id="status-text">${navigator.onLine ? 'Online' : 'Offline'}</span>
            </span>
            <div class="nav__toolbar">
              <details class="nav__accessibility">
                <summary class="btn btn--icon btn--ghost" aria-label="Accessibility settings" title="Accessibility settings">A</summary>
                <div class="nav__accessibility-panel">
                  <strong>Display support</strong>
                  <label><input id="access-high-contrast" type="checkbox" ${getSetting('highContrast') === 'true' ? 'checked' : ''}> High contrast</label>
                  <label><input id="access-dyslexia-font" type="checkbox" ${getSetting('dyslexiaFont') === 'true' ? 'checked' : ''}> Dyslexia-friendly font</label>
                  <label>Text size <select id="access-font-scale"><option value="standard">Standard</option><option value="large" ${getSetting('fontScale') === 'large' ? 'selected' : ''}>Large</option><option value="extra-large" ${getSetting('fontScale') === 'extra-large' ? 'selected' : ''}>Extra large</option></select></label>
                  <label>Speech speed <select id="access-speech-rate"><option value="0.8">Slow</option><option value="1" ${getSetting('speechRate') !== '0.8' && getSetting('speechRate') !== '1.2' ? 'selected' : ''}>Normal</option><option value="1.2" ${getSetting('speechRate') === '1.2' ? 'selected' : ''}>Fast</option></select></label>
                  <label>Speech pitch <select id="access-speech-pitch"><option value="0.8" ${getSetting('speechPitch') === '0.8' ? 'selected' : ''}>Low</option><option value="1" ${getSetting('speechPitch') !== '0.8' && getSetting('speechPitch') !== '1.2' ? 'selected' : ''}>Normal</option><option value="1.2" ${getSetting('speechPitch') === '1.2' ? 'selected' : ''}>High</option></select></label>
                  <label>Voice <select id="access-speech-voice">${renderVoiceOptions()}</select></label>
                </div>
              </details>
              ${showThemeToggle ? renderThemeButton() : ''}
              ${showSettings ? `
                <button class="btn btn--icon btn--ghost nav__settings-btn" id="nav-settings-btn" aria-label="Settings">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M16.5 10a6.5 6.5 0 01-.4 2.2l1.7 1.3-1.5 2.6-2-.6a6.5 6.5 0 01-3.8 2.2L10 20l-10.5-.3L9 17.7a6.5 6.5 0 01-3.8-2.2l-2 .6L1.7 13.5l1.7-1.3A6.5 6.5 0 013 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              ` : ''}
              ${showLogout ? `
                <button class="btn btn--ghost nav__logout-btn" id="nav-logout-btn" aria-label="${logoutLabel}">
                  ${logoutLabel}
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function bindNavEvents(options = {}) {
  const { onBack = null, onSettings = null, onBrand = null, onLogout = null } = options;

  const backBtn = document.getElementById('nav-back-btn');
  if (backBtn && onBack) {
    backBtn.addEventListener('click', onBack);
  }

  const settingsBtn = document.getElementById('nav-settings-btn');
  if (settingsBtn && onSettings) {
    settingsBtn.addEventListener('click', onSettings);
  }

  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn && onLogout) {
    logoutBtn.addEventListener('click', onLogout);
  }

  const themeBtn = document.getElementById('nav-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const theme = toggleTheme();
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      themeBtn.innerHTML = renderThemeIcon(theme);
      themeBtn.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
      themeBtn.setAttribute('title', `Switch to ${nextTheme} theme`);
    });
  }

  const saveAccessibility = () => saveAccessibilitySettings({
    highContrast: document.getElementById('access-high-contrast')?.checked || false,
    dyslexiaFont: document.getElementById('access-dyslexia-font')?.checked || false,
    fontScale: document.getElementById('access-font-scale')?.value || 'standard',
    speechRate: document.getElementById('access-speech-rate')?.value || '1',
    speechPitch: document.getElementById('access-speech-pitch')?.value || '1',
    speechVoice: document.getElementById('access-speech-voice')?.value || ''
  });
  ['access-high-contrast', 'access-dyslexia-font', 'access-font-scale', 'access-speech-rate', 'access-speech-pitch', 'access-speech-voice'].forEach((id) => document.getElementById(id)?.addEventListener('change', saveAccessibility));

  const voiceSelect = document.getElementById('access-speech-voice');
  if (voiceSelect && 'speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      const selectedVoice = getSetting('speechVoice');
      voiceSelect.innerHTML = renderVoiceOptions();
      voiceSelect.value = selectedVoice;
    }, { once: true });
  }

  const brand = document.getElementById('nav-brand');
  if (brand && onBrand) {
    brand.addEventListener('click', onBrand);
    brand.style.cursor = 'pointer';
  }

  const updateStatus = () => {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');

    if (dot) {
      dot.className = `status-dot ${navigator.onLine ? 'status-dot--online' : 'status-dot--offline'}`;
    }

    if (text) {
      text.textContent = navigator.onLine ? 'Online' : 'Offline';
    }
  };

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
}
