/**
 * ClassConnect — Student Login View
 * Simple PIN-based login/creation for shared devices
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { createStudent, setCurrentStudent, getAllStudents } from '../engine/storage.js';
import { showToast } from '../components/ui.js';

export async function renderStudentLogin() {
  const students = await getAllStudents();

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
          <button type="submit" class="btn btn--primary btn--lg btn--full">Continue to Lessons</button>
        </form>

        ${students.length > 0 ? `
          <div class="divider"></div>
          <h3 style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">Recent Students</h3>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-3);">
            ${students.slice(0, 5).map(s => `
              <button class="badge badge--neutral student-quick-select" data-name="${s.name}" style="padding: var(--space-2) var(--space-3); cursor: pointer; border: 1px solid var(--color-slate-600);">
                ${s.name}
              </button>
            `).join('')}
          </div>
        ` : ''}
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
      navigate('/lessons');
    } catch (err) {
      console.error(err);
      showToast('Login failed. Please try again.', 'error');
    }
  });

  // Quick select
  document.querySelectorAll('.student-quick-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      nameInput.value = e.target.dataset.name;
      pinInput.focus();
    });
  });
}
