/**
 * ClassConnect — Application Entry Point
 * Handles routing, initialization, and PWA registration.
 */

import './styles/index.css';
import './styles/components.css';
import './styles/lessons.css';
import './styles/quiz.css';
import './styles/dashboard.css';
import './styles/personalization.css';
import './styles/assessment.css';
import './styles/gradebook.css';
import './styles/report-card.css';
import './styles/lab-monitor.css';
import './styles/staff-shell.css';
import './styles/authentication.css';

import { renderHome, bindHomeEvents } from './views/home.js';
import { renderStudentLogin, bindStudentLoginEvents } from './views/student-login.js';
import { renderTeacherLogin, bindTeacherLoginEvents } from './views/teacher-login.js';
import { renderLessonList, bindLessonListEvents, renderLessonLibrary, bindLessonLibraryEvents, renderLessonsProgress, bindLessonsProgressEvents, renderLessonsReview, bindLessonsReviewEvents, renderLessonDetail, bindLessonDetailEvents } from './views/lesson-viewer.js';
import { renderQuiz, bindQuizEvents, ensureQuizSession, clearQuizSession } from './views/quiz.js';
import { renderQuizResults, bindQuizResultsEvents } from './views/quiz-results.js';
import { renderDashboard, bindDashboardEvents, teardownDashboardLiveUpdates } from './views/dashboard.js';
import { renderLearnersWorkspace, bindLearnersWorkspaceEvents } from './views/dashboard.js';
import { renderAdministration, bindAdministrationEvents } from './views/administration.js';
import { renderStaffAccessDenied, bindStaffAccessDenied } from './components/staff-shell.js';
import { renderDiagnostic, bindDiagnosticEvents, ensureDiagnosticSession, clearDiagnosticSession } from './views/diagnostic.js';
import { renderDiagnosticResults, bindDiagnosticResultsEvents } from './views/diagnostic-results.js';
import { renderTutor, bindTutorEvents } from './views/tutor.js';
import { renderAssessmentLab, bindAssessmentLabEvents } from './views/assessment-lab.js';
import { renderAssessmentCenter, bindAssessmentCenterEvents } from './views/assessment-center.js';
import { renderAssessmentSession, bindAssessmentSessionEvents, ensureAssessmentSession, clearAssessmentSession } from './views/assessment-session.js';
import { renderAssessmentResults, bindAssessmentResultsEvents } from './views/assessment-results.js';
import { renderGradebook, bindGradebookEvents } from './views/gradebook.js';
import { renderReportCard, bindReportCardEvents } from './views/report-card.js';
import { renderLabMonitor, bindLabMonitorEvents, teardownLabMonitor } from './views/lab-monitor.js';
import { renderLessonEditor, bindLessonEditorEvents } from './views/lesson-editor.js';
import { renderQuestionEditor, bindQuestionEditorEvents } from './views/question-editor.js';
import { getCurrentStudent, hasPermission, hydrateSettingsFromDB, isTeacherAuthenticated } from './engine/storage.js';
import { initTheme } from './engine/theme.js';
import { applyAccessibilitySettings } from './engine/speech.js';

let currentPath = window.location.pathname;
const appRoot = document.getElementById('app');
const SETTINGS_HYDRATION_TIMEOUT_MS = 4000;

async function hydrateInitialSettings() {
  let timeoutId;

  try {
    await Promise.race([
      hydrateSettingsFromDB(),
      new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error('Saved settings did not load in time.'));
        }, SETTINGS_HYDRATION_TIMEOUT_MS);
      })
    ]);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function navigate(path, addToHistory = true) {
  if (addToHistory && path !== window.location.pathname) {
    window.history.pushState({}, '', path);
  }

  currentPath = path;
  await renderRoute();
}

window.addEventListener('popstate', () => {
  currentPath = window.location.pathname;
  renderRoute();
});

function requiresStudentAuth(path) {
  return path === '/lessons'
    || path.startsWith('/lessons/')
    || path === '/diagnostic'
    || path === '/assessments'
    || path.startsWith('/diagnostic-results/')
    || path.startsWith('/assessment/')
    || path.startsWith('/assessment-results/')
    || path.startsWith('/lesson/')
    || path.startsWith('/quiz/')
    || path.startsWith('/quiz-results/')
    || path === '/tutor';
}

function requiredTeacherPermission(path) {
  if (path === '/dashboard') return 'dashboard';
  if (path === '/students') return 'roster.manage';
  if (path === '/admin') return 'users.manage';
  if (path === '/assessment-lab') return 'assessment.manage';
  if (path === '/lab-monitor') return 'lab.monitor';
  if (path === '/lesson-editor' || path === '/question-editor') return 'cms.manage';
  if (path === '/gradebook' || path === '/report-card' || path.startsWith('/report-card/')) return 'gradebook';
  return null;
}

async function renderRoute() {
  let accessDenied = false;
  if (currentPath === '/dashboard/legacy') {
    currentPath = '/dashboard';
    window.history.replaceState({}, '', currentPath);
  }
  if (currentPath === '/dashboard' && !isTeacherAuthenticated()) {
    currentPath = '/teacher-login';
    window.history.replaceState({}, '', '/teacher-login');
  }

  if ((currentPath === '/assessment-lab' || currentPath === '/lab-monitor') && !isTeacherAuthenticated()) {
    currentPath = '/teacher-login';
    window.history.replaceState({}, '', '/teacher-login');
  }

  const requiredPermission = requiredTeacherPermission(currentPath);
  if (requiredPermission && (!isTeacherAuthenticated() || !hasPermission(requiredPermission))) {
    if (isTeacherAuthenticated()) accessDenied = true;
    else {
      currentPath = '/teacher-login';
      window.history.replaceState({}, '', currentPath);
    }
  }

  if (requiresStudentAuth(currentPath) && !getCurrentStudent()) {
    currentPath = '/student-login';
    window.history.replaceState({}, '', '/student-login');
  }

  const loader = document.getElementById('app-loader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 1000);
  }

  if (!currentPath.startsWith('/quiz/')) {
    clearQuizSession();
  }

  if (currentPath !== '/diagnostic') {
    clearDiagnosticSession();
  }

  if (!currentPath.startsWith('/assessment/')) {
    clearAssessmentSession();
  }

  if (currentPath !== '/dashboard') {
    teardownDashboardLiveUpdates();
  }
  if (currentPath !== '/lab-monitor') teardownLabMonitor();

  if (appRoot.firstElementChild) {
    appRoot.firstElementChild.classList.add('view-exit');
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  let html = '';
  let bindEvents = () => {};

  if (accessDenied) {
    html = renderStaffAccessDenied('/dashboard');
    bindEvents = () => bindStaffAccessDenied(navigate);
  } else if (currentPath === '/' || currentPath === '/index.html') {
    html = renderHome();
    bindEvents = () => bindHomeEvents(navigate);
  } else if (currentPath === '/student-login') {
    html = await renderStudentLogin();
    bindEvents = () => bindStudentLoginEvents(navigate);
  } else if (currentPath === '/teacher-login') {
    html = await renderTeacherLogin();
    bindEvents = () => bindTeacherLoginEvents(navigate);
  } else if (currentPath === '/lessons') {
    html = await renderLessonList();
    bindEvents = () => bindLessonListEvents(navigate);
  } else if (currentPath === '/lessons/library') {
    html = await renderLessonLibrary();
    bindEvents = () => bindLessonLibraryEvents(navigate);
  } else if (currentPath === '/lessons/progress') {
    html = await renderLessonsProgress();
    bindEvents = () => bindLessonsProgressEvents(navigate);
  } else if (currentPath === '/lessons/review') {
    html = await renderLessonsReview();
    bindEvents = () => bindLessonsReviewEvents(navigate);
  } else if (currentPath === '/assessments') {
    html = await renderAssessmentCenter();
    bindEvents = () => bindAssessmentCenterEvents(navigate);
  } else if (currentPath === '/diagnostic') {
    ensureDiagnosticSession();
    html = renderDiagnostic();
    bindEvents = () => bindDiagnosticEvents(navigate, renderRoute);
  } else if (currentPath.startsWith('/diagnostic-results/')) {
    const id = currentPath.split('/')[2];
    html = await renderDiagnosticResults(id);
    bindEvents = () => bindDiagnosticResultsEvents(navigate, id);
  } else if (currentPath.startsWith('/lesson/')) {
    const lessonRouteId = currentPath.split('/')[2];
    const id = lessonRouteId.startsWith('custom-') ? lessonRouteId : Number.parseInt(lessonRouteId, 10);
    html = await renderLessonDetail(id);
    bindEvents = () => bindLessonDetailEvents(navigate, id);
  } else if (currentPath.startsWith('/quiz/')) {
    const id = Number.parseInt(currentPath.split('/')[2], 10);
    ensureQuizSession(id);
    html = renderQuiz();
    bindEvents = () => bindQuizEvents(navigate, renderRoute, id);
  } else if (currentPath.startsWith('/quiz-results/')) {
    const id = currentPath.split('/')[2];
    html = await renderQuizResults(id);
    bindEvents = () => bindQuizResultsEvents(navigate, id);
  } else if (currentPath.startsWith('/assessment-results/')) {
    const id = currentPath.split('/')[2];
    html = await renderAssessmentResults(id);
    bindEvents = () => bindAssessmentResultsEvents(navigate, id);
  } else if (currentPath.startsWith('/assessment/')) {
    const id = Number.parseInt(currentPath.split('/')[2], 10);
    await ensureAssessmentSession(id);
    html = renderAssessmentSession();
    bindEvents = () => bindAssessmentSessionEvents(navigate, renderRoute, id);
  } else if (currentPath === '/tutor') {
    html = await renderTutor();
    bindEvents = () => bindTutorEvents(navigate, renderRoute);
  } else if (currentPath === '/assessment-lab') {
    html = await renderAssessmentLab();
    bindEvents = () => bindAssessmentLabEvents(navigate);
  } else if (currentPath === '/lab-monitor') {
    html = renderLabMonitor();
    bindEvents = () => bindLabMonitorEvents(navigate);
  } else if (currentPath === '/lesson-editor') {
    html = await renderLessonEditor();
    bindEvents = () => bindLessonEditorEvents(navigate);
  } else if (currentPath === '/question-editor') {
    html = await renderQuestionEditor();
    bindEvents = () => bindQuestionEditorEvents(navigate);
  } else if (currentPath === '/gradebook') {
    html = await renderGradebook();
    bindEvents = () => bindGradebookEvents(navigate);
  } else if (currentPath === '/report-card' || currentPath.startsWith('/report-card/')) {
    const studentId = currentPath.split('/')[2] || null;
    html = await renderReportCard(studentId);
    bindEvents = () => bindReportCardEvents(navigate, studentId);
  } else if (currentPath === '/dashboard') {
    html = await renderDashboard();
    bindEvents = () => bindDashboardEvents(navigate);
  } else if (currentPath === '/students') {
    html = await renderLearnersWorkspace();
    bindEvents = () => bindLearnersWorkspaceEvents(navigate);
  } else if (currentPath === '/admin') {
    html = await renderAdministration();
    bindEvents = () => bindAdministrationEvents(navigate);
  } else {
    navigate('/', false);
    return;
  }

  appRoot.innerHTML = html;
  setTimeout(bindEvents, 0);
  window.scrollTo(0, 0);
}

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const loaderDelayMs = params.has('capture') ? 0 : 1500;

  setTimeout(async () => {
    try {
      await hydrateInitialSettings();
    } catch (error) {
      // A stale, blocked, or unavailable IndexedDB database must not leave the
      // application permanently behind its loading screen. Local settings are
      // optional at startup, so the app can safely continue without hydration.
      console.error('Unable to load saved ClassConnect settings.', error);
    }

    initTheme();
    applyAccessibilitySettings();
    await renderRoute();
  }, loaderDelayMs);
});
