/**
 * ClassConnect — Teacher Login / Setup View
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { showToast } from '../components/ui.js';
import {
  getApiKey,
  getTeacherPin,
  setApiKeyAsync,
  setTeacherAuthenticated,
  setTeacherPinAsync
} from '../engine/storage.js';

export function renderTeacherLogin() {
  const teacherPin = getTeacherPin();
  const isSetupMode = !teacherPin;

  return `
    ${renderNav({ title: 'Teacher Access', showBack: true })}
    <div class="container container--narrow view-enter" style="padding-top: var(--space-8); padding-bottom: var(--space-12);">
      <div class="card card--glass">
        <div style="text-align: center; margin-bottom: var(--space-8);">
          <h2 class="card__title" style="font-size: var(--font-size-2xl);">
            ${isSetupMode ? 'Set Up Teacher Access' : 'Teacher Sign In'}
          </h2>
          <p class="card__subtitle">
            ${isSetupMode
              ? 'Create a 4-digit teacher PIN for this device. You can also save a Gemini API key now or later.'
              : 'Enter your teacher PIN to open the dashboard on this device.'}
          </p>
        </div>

        <form id="teacher-access-form" style="display: flex; flex-direction: column; gap: var(--space-6);">
          <div class="input-group">
            <label for="teacher-pin">${isSetupMode ? 'Create 4-digit Teacher PIN' : 'Teacher PIN'}</label>
            <input type="password" id="teacher-pin" class="input input--pin" placeholder="0000" required pattern="[0-9]{4}" maxlength="4" inputmode="numeric">
          </div>

          ${isSetupMode ? `
            <div class="input-group">
              <label for="teacher-pin-confirm">Confirm Teacher PIN</label>
              <input type="password" id="teacher-pin-confirm" class="input input--pin" placeholder="0000" required pattern="[0-9]{4}" maxlength="4" inputmode="numeric">
            </div>
            <div class="input-group">
              <label for="teacher-api-key">Gemini API Key (optional)</label>
              <input type="password" id="teacher-api-key" class="input" value="${getApiKey() || ''}" placeholder="AIzaSy...">
            </div>
          ` : ''}

          <button type="submit" class="btn btn--primary btn--lg btn--full">
            ${isSetupMode ? 'Save PIN and Open Dashboard' : 'Open Dashboard'}
          </button>
        </form>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `;
}

export function bindTeacherLoginEvents(navigate) {
  bindNavEvents({
    onBack: () => navigate('/')
  });

  const existingPin = getTeacherPin();
  const isSetupMode = !existingPin;
  const form = document.getElementById('teacher-access-form');
  const pinInput = document.getElementById('teacher-pin');
  const confirmInput = document.getElementById('teacher-pin-confirm');
  const apiKeyInput = document.getElementById('teacher-api-key');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const pin = pinInput.value.trim();
    if (!/^\d{4}$/.test(pin)) {
      showToast('Enter a valid 4-digit teacher PIN.', 'error');
      return;
    }

    if (isSetupMode) {
      const confirmed = confirmInput?.value.trim();
      if (pin !== confirmed) {
        showToast('Teacher PINs do not match yet.', 'error');
        return;
      }

      try {
        await setTeacherPinAsync(pin);

        if (apiKeyInput?.value.trim()) {
          await setApiKeyAsync(apiKeyInput.value.trim());
        }

        setTeacherAuthenticated(true);
        showToast('Teacher access saved for this device.', 'success');
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
        showToast('Unable to save teacher access right now.', 'error');
      }

      return;
    }

    if (pin !== existingPin) {
      showToast('That teacher PIN is not correct.', 'error');
      return;
    }

    setTeacherAuthenticated(true);
    navigate('/dashboard');
  });
}
