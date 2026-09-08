import { renderNav, bindNavEvents } from '../components/nav.js';
import { createLabRoom, getLabJoinUrl, getLabRoom, sendLabControl, startLabSync } from '../engine/lan-sync.js';

const sessions = new Map();
let unsubscribe = null;
let navigateRef = null;

function escapeHTML(value = '') { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
function renderBoard() {
  const room = getLabRoom();
  const cards = [...sessions.values()].sort((a, b) => String(a.studentName || a.clientId).localeCompare(String(b.studentName || b.clientId)));
  return `
    <div class="container view-enter lab-monitor-page">
      <section class="card card--glass lab-monitor-hero">
        <div><div class="assessment-hero__eyebrow">Exam Control</div><h1 class="assessment-hero__title">Live classroom monitor</h1><p class="assessment-hero__text">Keep this teacher tab open while students work. Status is relayed only across the local Vite lab host.</p></div>
        <div class="lab-monitor-actions"><button class="btn btn--secondary" id="lab-new-room">${room ? 'New lab session' : 'Start lab session'}</button><button class="btn btn--primary" id="lab-unlock">Unlock assessment</button><button class="btn btn--warning" id="lab-lock">Lock all screens</button><button class="btn btn--danger" id="lab-submit">Force submit all</button></div>
        ${room ? `<div class="lab-join"><strong>Student link:</strong> <code>${escapeHTML(getLabJoinUrl(room))}</code><button class="btn btn--ghost btn--sm" id="lab-copy-link">Copy</button><span>Open this link on each PC (or turn it into a QR code using the browser’s Share menu).</span></div>` : ''}
      </section>
      <div class="lab-monitor-summary"><span>${cards.length} active PC${cards.length === 1 ? '' : 's'}</span><span class="badge badge--danger" id="lab-alert-count">${cards.filter((item) => item.alert).length} proctor alert${cards.filter((item) => item.alert).length === 1 ? '' : 's'}</span></div>
      <section class="lab-monitor-grid">${cards.length ? cards.map((item) => `<article class="card lab-student-card ${item.alert ? 'lab-student-card--alert' : ''}"><div class="lab-student-card__head"><strong>${escapeHTML(item.studentName || item.clientId || 'Student PC')}</strong><span class="badge badge--${item.alert ? 'danger' : item.status === 'Completed' ? 'success' : 'primary'}">${escapeHTML(item.status || 'Connected')}</span></div><p>${escapeHTML(item.detail || 'Waiting for activity')}</p><small>Last seen ${new Date(item.sentAt || Date.now()).toLocaleTimeString()}</small>${item.alert ? '<div class="lab-alert">Fullscreen exit or hidden tab detected</div>' : ''}</article>`).join('') : '<div class="card insight-empty">No student PCs have reported yet. Share the student link above and keep this page open.</div>'}</section>
    </div>`;
}
function refresh() { const root = document.getElementById('lab-monitor-root'); if (root) root.innerHTML = renderBoard(); bindControls(); }
function bindControls() {
  document.getElementById('lab-new-room')?.addEventListener('click', () => { createLabRoom(); sessions.clear(); refresh(); });
  document.getElementById('lab-unlock')?.addEventListener('click', () => sendLabControl('unlock-assessment'));
  document.getElementById('lab-lock')?.addEventListener('click', () => sendLabControl('lock-screens'));
  document.getElementById('lab-submit')?.addEventListener('click', () => sendLabControl('force-submit'));
  document.getElementById('lab-copy-link')?.addEventListener('click', async () => { await navigator.clipboard?.writeText(getLabJoinUrl()); });
}
export function renderLabMonitor() { return `${renderNav({ title: 'Lab Monitor', showBack: true, showLogout: true })}<div id="lab-monitor-root">${renderBoard()}</div>`; }
export function bindLabMonitorEvents(navigate) { navigateRef = navigate; bindNavEvents({ onBack: () => navigate('/dashboard') }); unsubscribe = startLabSync((message) => { if (message.type !== 'status') return; const key = message.clientId || message.studentId || message.studentName || makeKey(); sessions.set(key, message); refresh(); }); bindControls(); }
function makeKey() { return `pc-${sessions.size + 1}`; }
export function teardownLabMonitor() { unsubscribe?.(); unsubscribe = null; sessions.clear(); navigateRef = null; }
