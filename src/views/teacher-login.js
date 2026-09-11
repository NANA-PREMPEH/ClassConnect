/** ClassConnect — RBAC teacher sign-in and initial administrator setup. */
import { renderNav, bindNavEvents } from '../components/nav.js';
import { showToast } from '../components/ui.js';
import { USER_ROLES, ROLE_LABELS, authenticateUser, createUser, getAllUsers, provisionLegacyAdmin, setTeacherSession } from '../engine/storage.js';
import { isSupabaseAuthConfigured, signInWithSupabase } from '../engine/supabase-auth.js';

let loginState = { users: [] };

export async function renderTeacherLogin() {
  const cloudAuth = isSupabaseAuthConfigured();
  if (!cloudAuth) { await provisionLegacyAdmin(); loginState.users = await getAllUsers(); }
  const setup = !cloudAuth && loginState.users.length === 0;
  return `${renderNav({ title: 'Staff Access', showBack: true })}<main class="auth-page view-enter"><section class="auth-layout" aria-labelledby="staff-login-title"><aside class="auth-intro"><div class="auth-brand"><span class="auth-brand__mark" aria-hidden="true">⌁</span><span class="auth-brand__name">ClassConnect</span></div><div class="auth-intro__content"><p class="auth-kicker">Staff workspace</p><h1 class="auth-intro__title">The information you need to support every learner.</h1><p class="auth-intro__text">Secure access to progress, learning resources, and your school’s assessment tools.</p></div><div class="auth-benefits"><p class="auth-benefit"><span class="auth-benefit__icon" aria-hidden="true">✓</span>Role-based access for every member of staff.</p><p class="auth-benefit"><span class="auth-benefit__icon" aria-hidden="true">✓</span>Designed to work reliably in the classroom.</p></div></aside><div class="auth-panel"><header class="auth-panel__header"><p class="auth-panel__eyebrow">${setup ? 'First-time setup' : 'Staff sign in'}</p><h1 class="auth-panel__title" id="staff-login-title">${setup ? 'Set up your school' : 'Welcome back'}</h1><p class="auth-panel__subtitle">${setup ? 'Create the first administrator account. You can add teachers and invigilators later.' : 'Enter your individual staff credentials to open the dashboard.'}</p></header><form id="teacher-access-form" class="auth-form">${setup ? '<div class="input-group"><label for="staff-name">Full name</label><input id="staff-name" class="input" required maxlength="80" autocomplete="name" placeholder="e.g., Mrs. Ama Mensah"></div>' : ''}<div class="input-group"><label for="staff-username">Username</label><input id="staff-username" class="input" required pattern="[A-Za-z0-9._-]{3,40}" autocomplete="username" placeholder="e.g., ama.mensah"></div><div class="input-group"><label for="staff-pin">${setup ? 'Administrator PIN (4–8 digits)' : 'Account PIN'}</label><input type="password" id="staff-pin" class="input input--pin" required pattern="[0-9]{4,8}" maxlength="8" inputmode="numeric" autocomplete="current-password" placeholder="••••"></div>${setup ? '<div class="input-group"><label for="staff-pin-confirm">Confirm PIN</label><input type="password" id="staff-pin-confirm" class="input input--pin" required pattern="[0-9]{4,8}" maxlength="8" inputmode="numeric" autocomplete="new-password" placeholder="••••"></div>' : ''}<button type="submit" class="btn btn--primary btn--lg btn--full auth-form__submit">${setup ? 'Create account and open dashboard' : 'Sign in to dashboard'}</button></form><p class="auth-panel__footer"><strong>Secure staff access.</strong> Use only your own account and sign out when you finish on a shared device.</p></div></section></main><div class="bg-pattern"></div>`;
}

export function bindTeacherLoginEvents(navigate) {
  bindNavEvents({ onBack: () => navigate('/') }); const setup = loginState.users.length === 0;
  if (isSupabaseAuthConfigured()) {
    const identifier = document.getElementById('staff-username');
    const password = document.getElementById('staff-pin');
    document.querySelector('label[for="staff-username"]')?.replaceChildren('School email address');
    document.querySelector('label[for="staff-pin"]')?.replaceChildren('Password');
    identifier?.setAttribute('type', 'email');
    identifier?.removeAttribute('pattern');
    identifier?.setAttribute('autocomplete', 'email');
    identifier?.setAttribute('placeholder', 'name@school.edu.gh');
    password?.removeAttribute('pattern');
    password?.removeAttribute('maxlength');
    password?.removeAttribute('inputmode');
  }
  document.getElementById('teacher-access-form')?.addEventListener('submit', async (event) => { event.preventDefault(); const username = document.getElementById('staff-username')?.value.trim(); const pin = document.getElementById('staff-pin')?.value.trim(); try { if (isSupabaseAuthConfigured()) { const profile = await signInWithSupabase(username, pin); if (profile.role === 'student') throw new Error('Use the student sign-in for this account.'); setTeacherSession({ id: profile.id, username, name: profile.display_name, role: profile.role === 'administrator' ? USER_ROLES.ADMIN : profile.role, classIds: [] }); showToast(`Welcome, ${profile.display_name}.`, 'success'); } else if (setup) { if (pin !== document.getElementById('staff-pin-confirm')?.value.trim()) throw new Error('PINs do not match.'); const user = await createUser({ name: document.getElementById('staff-name')?.value.trim(), username, pin, role: USER_ROLES.ADMIN }); setTeacherSession(user); showToast('Administrator account created.', 'success'); } else { const result = await authenticateUser(username, pin); if (!result.user) throw new Error(result.error); setTeacherSession(result.user); showToast(`Welcome, ${result.user.name || result.user.username}.`, 'success'); } navigate('/dashboard'); } catch (error) { showToast(error.message || 'Unable to sign in.', 'error'); } });
}
export { ROLE_LABELS };
