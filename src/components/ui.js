/**
 * ClassConnect — Shared UI Utilities
 */

export { renderProgressBar } from './progress-bar.js';
export { renderQuestionCard } from './question-card.js';
export { renderFeedbackCard } from './feedback-card.js';
export { renderStatCard } from './stat-card.js';

let toastContainer = null;

export function showToast(message, type = 'info', duration = 3000) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const icons = {
    success: 'OK',
    error: 'X',
    info: 'i'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function renderScoreRing(score, total) {
  const pct = total > 0 ? score / total : 0;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference * (1 - pct);

  let color = '#FB7185';
  if (pct >= 0.8) color = '#34D399';
  else if (pct >= 0.6) color = '#818CF8';
  else if (pct >= 0.4) color = '#FBBF24';

  return `
    <div class="quiz-results__score-ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="45"/>
        <circle class="ring-fill" cx="50" cy="50" r="45"
          stroke="${color}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          style="animation: ringDraw 1.5s ease-out forwards;"
        />
      </svg>
      <div class="quiz-results__score-label">
        <div class="quiz-results__score-value" style="color: ${color}">${score}</div>
        <div class="quiz-results__score-total">out of ${total}</div>
      </div>
    </div>
  `;
}

export function showModal(title, bodyHTML, actions = [], options = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  const modalClass = options.modalClass ? ` ${options.modalClass}` : '';

  overlay.innerHTML = `
    <div class="modal${modalClass}">
      <h3 class="modal__title">${title}</h3>
      <div class="modal__body">${bodyHTML}</div>
      <div class="modal__actions" id="modal-actions">
        ${actions.map((action, index) => `
          <button class="btn ${action.variant || 'btn--ghost'}" id="modal-action-${index}">${action.label}</button>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  actions.forEach((action, index) => {
    const button = document.getElementById(`modal-action-${index}`);
    if (button) {
      button.addEventListener('click', async () => {
        let shouldClose = true;

        if (action.onClick) {
          const result = await action.onClick(overlay);
          shouldClose = result !== false;
        }

        if (shouldClose) {
          overlay.remove();
        }
      });
    }
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.remove();
  });

  return overlay;
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.remove();
}
