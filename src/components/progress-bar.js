/**
 * ClassConnect — Progress Bar Component
 */

export function renderProgressBar(current, total, label = '') {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return `
    <div class="progress-container" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
      ${label ? `<div class="progress-label">${label}</div>` : ''}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${pct}%"></div>
      </div>
      <div class="progress-text">${pct}%</div>
    </div>
  `;
}
