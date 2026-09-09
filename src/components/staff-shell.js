/** Shared, role-aware shell for staff workspaces. */
import { clearTeacherAuthenticated, getCurrentTeacher, getStaffClassContext, hasPermission, ROLE_LABELS, setStaffClassContext } from '../engine/storage.js';
import { renderNav, bindNavEvents } from './nav.js';

const navigation = [
  { href: '/dashboard', label: 'Overview', permission: 'dashboard', icon: '◫' },
  { href: '/students', label: 'Classes & Learners', permission: 'roster.manage', icon: '♙' },
  { href: '/assessment-lab', label: 'Assessments', permission: 'assessment.manage', icon: '✓' },
  { href: '/gradebook', label: 'Gradebook & Reports', permission: 'gradebook', icon: '▤' },
  { href: '/lesson-editor', label: 'Curriculum', permission: 'cms.manage', icon: '▱' },
  { href: '/lab-monitor', label: 'Lab Monitor', permission: 'lab.monitor', icon: '◉' },
  { href: '/admin', label: 'Administration', permission: 'users.manage', icon: '⚙' }
];

export function renderStaffShell({ title, subtitle = '', activePath, content }) {
  const staff = getCurrentTeacher();
  const classContext = getStaffClassContext();
  const entries = navigation.filter((entry) => hasPermission(entry.permission, staff));
  return `
    ${renderNav({ title: 'ClassConnect', showBack: false, showLogout: true })}
    <div class="staff-shell">
      <aside class="staff-sidebar" aria-label="Staff workspace navigation">
        <div class="staff-sidebar__identity"><div class="staff-sidebar__avatar">${(staff?.name || staff?.username || 'S').slice(0, 1).toUpperCase()}</div><div><strong>${escapeHTML(staff?.name || staff?.username || 'Staff')}</strong><span>${escapeHTML(ROLE_LABELS[staff?.role] || 'Staff')}${staff?.role === 'teacher' ? ` · ${staff.classIds?.length || 0} assigned class${staff.classIds?.length === 1 ? '' : 'es'}` : ''}</span></div></div>
        <nav class="staff-sidebar__nav">${entries.map((entry) => `<button class="staff-nav-item ${activePath === entry.href ? 'staff-nav-item--active' : ''}" data-staff-route="${entry.href}" aria-current="${activePath === entry.href ? 'page' : 'false'}"><span aria-hidden="true">${entry.icon}</span>${entry.label}</button>`).join('')}</nav>
        <div class="staff-sidebar__footer">Offline school workspace<br><span>Data stays on this device</span></div>
      </aside>
      <main class="staff-main"><header class="staff-page-header"><div><p class="staff-page-header__eyebrow">Staff workspace</p><h1>${escapeHTML(title)}</h1>${subtitle ? `<p>${escapeHTML(subtitle)}</p>` : ''}</div><div id="staff-page-actions" class="staff-page-header__actions">${classContext.classes.length ? `<label class="staff-context-select">Class scope<select id="staff-global-class"><option value="all">All permitted classes</option>${classContext.classes.map((entry) => `<option value="${entry.id}" ${String(entry.id) === String(classContext.selectedClassId) ? 'selected' : ''}>${escapeHTML(entry.name)}</option>`).join('')}</select></label>` : ''}</div></header>${content}</main>
    </div>`;
}

export function bindStaffShell(navigate, { onLogout } = {}) {
  bindNavEvents({ onBrand: () => navigate('/dashboard'), onLogout: onLogout || (() => { clearTeacherAuthenticated(); navigate('/'); }) });
  document.querySelectorAll('[data-staff-route]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.staffRoute)));
  document.getElementById('staff-global-class')?.addEventListener('change', (event) => { const context = getStaffClassContext(); setStaffClassContext(context.classes, event.currentTarget.value); navigate(window.location.pathname, false); });
}

function escapeHTML(value = '') { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }

export function renderStaffAccessDenied(navigatePath = '/dashboard') {
  return `${renderNav({ title: 'ClassConnect', showLogout: true })}<main class="access-denied"><section class="card"><p class="staff-page-header__eyebrow">Access restricted</p><h1>You do not have access to this workspace</h1><p>Your staff role does not include this area. Return to a workspace available to you.</p><button class="btn btn--primary" data-access-denied-return="${navigatePath}">Return to my workspace</button></section></main>`;
}

export function bindStaffAccessDenied(navigate) {
  bindNavEvents({ onLogout: () => { clearTeacherAuthenticated(); navigate('/'); } });
  document.querySelector('[data-access-denied-return]')?.addEventListener('click', (event) => navigate(event.currentTarget.dataset.accessDeniedReturn));
}
