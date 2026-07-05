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

import { renderHome, bindHomeEvents } from './views/home.js';
import { renderStudentLogin, bindStudentLoginEvents } from './views/student-login.js';
import { renderTeacherLogin, bindTeacherLoginEvents } from './views/teacher-login.js';
import { renderLessonList, bindLessonListEvents, renderLessonDetail, bindLessonDetailEvents } from './views/lesson-viewer.js';
import { renderQuiz, bindQuizEvents, ensureQuizSession, clearQuizSession } from './views/quiz.js';
import { renderQuizResults, bindQuizResultsEvents } from './views/quiz-results.js';
import { renderDashboard, bindDashboardEvents } from './views/dashboard.js';
import { renderDiagnostic, bindDiagnosticEvents, ensureDiagnosticSession, clearDiagnosticSession } from './views/diagnostic.js';
import { renderDiagnosticResults, bindDiagnosticResultsEvents } from './views/diagnostic-results.js';
import { renderTutor, bindTutorEvents } from './views/tutor.js';
import { getCurrentStudent, hydrateSettingsFromDB, isTeacherAuthenticated } from './engine/storage.js';
import { initTheme } from './engine/theme.js';

function loadChartJS() {
  if (!window.Chart && !document.getElementById('chartjs-script')) {
    const script = document.createElement('script');
    script.id = 'chartjs-script';
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.js';
    document.head.appendChild(script);
  }
}

let currentPath = window.location.pathname;
const appRoot = document.getElementById('app');

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
    || path === '/diagnostic'
    || path.startsWith('/diagnostic-results/')
    || path.startsWith('/lesson/')
    || path.startsWith('/quiz/')
    || path.startsWith('/quiz-results/')
    || path === '/tutor';
}

async function renderRoute() {
  if (currentPath === '/dashboard' && !isTeacherAuthenticated()) {
    currentPath = '/teacher-login';
    window.history.replaceState({}, '', '/teacher-login');
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

  if (currentPath === '/dashboard') {
    loadChartJS();
  }

  if (!currentPath.startsWith('/quiz/')) {
    clearQuizSession();
  }

  if (currentPath !== '/diagnostic') {
    clearDiagnosticSession();
  }

  if (appRoot.firstElementChild) {
    appRoot.firstElementChild.classList.add('view-exit');
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  let html = '';
  let bindEvents = () => {};

  if (currentPath === '/' || currentPath === '/index.html') {
    html = renderHome();
    bindEvents = () => bindHomeEvents(navigate);
  } else if (currentPath === '/student-login') {
    html = await renderStudentLogin();
    bindEvents = () => bindStudentLoginEvents(navigate);
  } else if (currentPath === '/teacher-login') {
    html = renderTeacherLogin();
    bindEvents = () => bindTeacherLoginEvents(navigate);
  } else if (currentPath === '/lessons') {
    html = await renderLessonList();
    bindEvents = () => bindLessonListEvents(navigate);
  } else if (currentPath === '/diagnostic') {
    ensureDiagnosticSession();
    html = renderDiagnostic();
    bindEvents = () => bindDiagnosticEvents(navigate, renderRoute);
  } else if (currentPath.startsWith('/diagnostic-results/')) {
    const id = currentPath.split('/')[2];
    html = await renderDiagnosticResults(id);
    bindEvents = () => bindDiagnosticResultsEvents(navigate, id);
  } else if (currentPath.startsWith('/lesson/')) {
    const id = Number.parseInt(currentPath.split('/')[2], 10);
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
  } else if (currentPath === '/tutor') {
    html = await renderTutor();
    bindEvents = () => bindTutorEvents(navigate, renderRoute);
  } else if (currentPath === '/dashboard') {
    html = await renderDashboard();
    bindEvents = () => bindDashboardEvents(navigate);
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
    await hydrateSettingsFromDB();
    initTheme();
    renderRoute();
  }, loaderDelayMs);
});
