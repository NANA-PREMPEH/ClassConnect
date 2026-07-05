/**
 * ClassConnect — Dashboard Stat Card Component
 */

export function renderStatCard(icon, value, label, variant = 'primary', detail = '') {
  return `
    <div class="card stat-card stat-card--${variant}">
      <div class="stat-card__icon">${icon}</div>
      <div class="stat-card__value">${value}</div>
      <div class="stat-card__label">${label}</div>
      ${detail ? `<div class="stat-card__detail">${detail}</div>` : ''}
    </div>
  `;
}
