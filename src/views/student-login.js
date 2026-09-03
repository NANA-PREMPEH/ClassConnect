/**
 * ClassConnect — Student Login View
 * Simple PIN-based login/creation for shared devices
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { createStudent, setCurrentStudent, getAllStudents, getLatestDiagnosticForStudent } from '../engine/storage.js';
import { showToast } from '../components/ui.js';

export function renderStudentLogin() {
  return `
    ${renderNav({ title: 'ClassConnect', showBack: true })}
    <div class="container container--narrow view-enter" style="padding-top: var(--space-8); padding-bottom: var(--space-12);">
      <div class="card card--glass">
        <div style="text-align: center; margin-bottom: var(--space-8);">
          <h2 class="card__title" style="font-size: var(--font-size-2xl);">Student Login</h2>
          <p class="card__subtitle">Enter your name and a 4-digit PIN.</p>
        </div>

        <form id="login-form" style="display: flex; flex-direction: column; gap: var(--space-6);">
          <div class="input-group">
            <label for="student-name">Your Full Name</label>
            <input type="text" id="student-name" class="input" placeholder="e.g., Kwame Mensah" required minlength="2" autocomplete="off">
          </div>
          <div class="input-group">
            <label for="student-pin">4-Digit PIN (Keep this secret!)</label>
            <input type="password" id="student-pin" class="input input--pin" placeholder="••••" required pattern="[0-9]{4}" maxlength="4" inputmode="numeric">
          </div>
          <button type="submit" class="btn btn--primary btn--lg btn--full">Continue to Your Learning Path</button>
        </form>

        <div id="recent-students" hidden>
          <div class="divider"></div>
          <h3 style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">Recent Students</h3>
          <div id="recent-student-list" style="display: flex; flex-wrap: wrap; gap: var(--space-3);"></div>
        </div>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `;
}

export function bindStudentLoginEvents(navigate) {
  bindNavEvents({
    onBack: () => navigate('/')
  });

  const form = document.getElementById('login-form');
  const nameInput = document.getElementById('student-name');
  const pinInput = document.getElementById('student-pin');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const pin = pinInput.value;

    if (!name || pin.length !== 4) {
      showToast('Please enter your name and a 4-digit PIN.', 'error');
      return;
    }

    try {
      // Find or create
      const student = await createStudent(name, pin);
      setCurrentStudent(student);
      const diagnostic = await getLatestDiagnosticForStudent(student.id);
      navigate(diagnostic ? '/lessons' : '/diagnostic');
    } catch (err) {
      console.error('[ClassConnect] Student login error:', err);
      let message = 'Login failed. Please try again.';

      if (err?.message === 'The local ClassConnect database is busy.') {
        message = 'Your saved learning data is busy. Close other ClassConnect tabs, then try again.';
      } else if (
        err?.name === 'VersionError' ||
        err?.message?.includes('version') ||
        err?.message?.includes('blocked')
      ) {
        message = 'A database update is needed. Please close all other ClassConnect tabs and try again.';
      }

      showToast(message, 'error');
    }
  });

  const recentStudents = document.getElementById('recent-students');
  const recentStudentList = document.getElementById('recent-student-list');

  recentStudentList.addEventListener('click', (event) => {
    const button = event.target.closest('.student-quick-select');
    if (button) {
      nameInput.value = button.dataset.name;
      pinInput.focus();
    }
  });

  // Recent students are a convenience only. Do not delay the login form while
  // the device database is opening or being upgraded.
  void getAllStudents()
    .then((students) => {
      if (!students.length) return;

      students.slice(0, 5).forEach((student) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'badge badge--neutral student-quick-select';
        button.dataset.name = student.name;
        button.style.cssText = 'padding: var(--space-2) var(--space-3); cursor: pointer; border: 1px solid var(--color-slate-600);';
        button.textContent = student.name;
        recentStudentList.append(button);
      });

      recentStudents.hidden = false;
    })
    .catch((error) => {
      console.warn('Recent students could not be loaded.', error);
    });
}
