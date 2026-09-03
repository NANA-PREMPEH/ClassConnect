/**
 * ClassConnect - Teacher Dashboard View
 * Live analytics dashboard backed by IndexedDB with auto-refresh and activity feed.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderStatCard } from '../components/stat-card.js';
import { showModal, showToast } from '../components/ui.js';
import {
  clearTeacherAuthenticated,
  downloadCSV,
  getAllAssessments,
  getAllAssessmentSubmissions,
  getAllDiagnostics,
  exportAllDataAsCSV,
  getAllProgress,
  getAllQuizResults,
  getAllStudents,
  getApiKey,
  getTeacherPin,
  setApiKeyAsync,
  setTeacherPinAsync,
  subscribeToDataChanges
} from '../engine/storage.js';
import { lessons } from '../data/lessons.js';
import { buildStudentProfile } from '../engine/personalization.js';
import { ensureChartJS } from '../engine/chart-loader.js';

const DASHBOARD_REFRESH_INTERVAL_MS = 30000;

let dashboardSnapshot = null;
let dashboardCharts = [];
let studentDetailChart = null;
let dashboardLastUpdatedAt = null;
let dashboardDataUnsubscribe = null;
let dashboardRefreshTimer = null;
let dashboardVisibilityHandler = null;
let dashboardFocusHandler = null;
let dashboardRefreshPromise = null;
let dashboardRefreshQueued = false;
let activeDashboardNavigate = null;

function average(values = []) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatDuration(ms = 0) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function formatTimeStamp(value) {
  if (!value) {
    return 'Not yet';
  }

  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getLessonTitle(lessonId) {
  return lessons.find((lesson) => lesson.id === lessonId)?.title || `Lesson ${lessonId}`;
}

function getLatestResults(results) {
  const latestByStudent = {};
  results
    .slice()
    .sort((left, right) => new Date(left.completedAt) - new Date(right.completedAt))
    .forEach((result) => {
      latestByStudent[result.studentId] = result;
    });

  return Object.values(latestByStudent);
}

function getDiagnosticAverage(diagnostic) {
  const breakdown = diagnostic?.lessonBreakdown || [];
  if (!breakdown.length) {
    return 0;
  }

  return Math.round(average(breakdown.map((entry) => entry.accuracy || 0)) * 100);
}

function buildRecentActivity(students, results, progressRecords, diagnostics, assessments, assessmentSubmissions) {
  const studentMap = new Map(students.map((student) => [student.id, student]));
  const assessmentMap = new Map(assessments.map((assessment) => [assessment.id, assessment]));
  const activity = [];

  results.forEach((result) => {
    const studentName = studentMap.get(result.studentId)?.name || 'Unknown learner';
    const score = result.totalQuestions > 0
      ? Math.round((result.score / result.totalQuestions) * 100)
      : 0;

    activity.push({
      type: 'Quiz',
      tone: score >= 70 ? 'success' : score >= 50 ? 'warning' : 'danger',
      title: `${studentName} completed ${getLessonTitle(result.lessonId)} quiz`,
      meta: `${score}% score · ${result.level || 'No level'} · ${formatDuration(result.totalTimeMs)}`,
      timestamp: result.completedAt
    });
  });

  progressRecords.forEach((record) => {
    const studentName = studentMap.get(record.studentId)?.name || 'Unknown learner';

    activity.push({
      type: 'Progress',
      tone: 'primary',
      title: `${studentName} completed ${getLessonTitle(record.lessonId)}`,
      meta: 'Lesson completion saved to the local database.',
      timestamp: record.completedAt
    });
  });

  diagnostics.forEach((diagnostic) => {
    const studentName = studentMap.get(diagnostic.studentId)?.name || 'Unknown learner';

    activity.push({
      type: 'Diagnostic',
      tone: 'accent',
      title: `${studentName} completed the readiness diagnostic`,
      meta: `${getDiagnosticAverage(diagnostic)}% average readiness across sampled lessons.`,
      timestamp: diagnostic.completedAt
    });
  });

  assessments.forEach((assessment) => {
    activity.push({
      type: 'Assess',
      tone: 'accent',
      title: `Published ${assessment.title}`,
      meta: `${assessment.questions.length} questions · ${assessment.objectiveCoverage.length} objectives covered.`,
      timestamp: assessment.createdAt
    });
  });

  assessmentSubmissions.forEach((submission) => {
    const studentName = studentMap.get(submission.studentId)?.name || 'Unknown learner';
    const assessmentTitle = assessmentMap.get(submission.assessmentId)?.title || 'an assessment';
    const integrityLabel = submission.integrity?.label || 'Low';
    const proctorLabel = submission.proctor?.label || 'Low';
    const score = submission.grading?.percentage ?? 0;

    activity.push({
      type: 'Submit',
      tone: integrityLabel === 'High' || proctorLabel === 'High' ? 'warning' : 'success',
      title: `${studentName} submitted ${assessmentTitle}`,
      meta: `${score}% score · Integrity ${integrityLabel} · Proctor ${proctorLabel}`,
      timestamp: submission.completedAt
    });
  });

  return activity
    .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp))
    .slice(0, 8);
}

function buildDashboardSnapshot(students, results, progressRecords, diagnostics, assessments, assessmentSubmissions) {
  const latestResults = getLatestResults(results);
  const latestDiagnosticsByStudent = {};
  diagnostics
    .slice()
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt))
    .forEach((diagnostic) => {
      if (!latestDiagnosticsByStudent[diagnostic.studentId]) {
        latestDiagnosticsByStudent[diagnostic.studentId] = diagnostic;
      }
    });

  const studentProfiles = students.map((student) => {
    const studentResults = results.filter((result) => result.studentId === student.id);
    const studentProgress = progressRecords.filter((record) => record.studentId === student.id);
    const diagnostic = latestDiagnosticsByStudent[student.id] || null;
    const profile = buildStudentProfile({
      diagnostic,
      results: studentResults,
      progressRecords: studentProgress
    });

    return {
      student,
      results: studentResults,
      progressRecords: studentProgress,
      diagnostic,
      profile
    };
  });

  const completionRate = students.length > 0
    ? Math.round((progressRecords.length / (students.length * lessons.length)) * 100)
    : 0;
  const averageScore = latestResults.length > 0
    ? Math.round((latestResults.reduce((sum, result) => sum + (result.score / result.totalQuestions), 0) / latestResults.length) * 100)
    : 0;
  const studentsAtRisk = studentProfiles.filter((entry) => entry.profile.risk.score >= 60).length;
  const diagnosticCoverage = students.length > 0
    ? Math.round((studentProfiles.filter((entry) => entry.diagnostic).length / students.length) * 100)
    : 0;

  const scoresByLesson = {};
  const countsByLesson = {};
  results.forEach((result) => {
    scoresByLesson[result.lessonId] = (scoresByLesson[result.lessonId] || 0) + (result.score / result.totalQuestions);
    countsByLesson[result.lessonId] = (countsByLesson[result.lessonId] || 0) + 1;
  });

  const lessonScoreData = lessons.map((lesson) => (
    countsByLesson[lesson.id]
      ? Math.round((scoresByLesson[lesson.id] / countsByLesson[lesson.id]) * 100)
      : 0
  ));

  const levelCounts = { Advanced: 0, Proficient: 0, Developing: 0, Beginner: 0 };
  latestResults.forEach((result) => {
    if (levelCounts[result.level] !== undefined) {
      levelCounts[result.level] += 1;
    }
  });

  const misconceptionCounts = {};
  results.forEach((result) => {
    result.responses.forEach((response) => {
      if (response.correct) return;
      const key = `${response.questionId}|${response.stem}|${response.options[response.selectedIndex]}`;
      misconceptionCounts[key] = (misconceptionCounts[key] || 0) + 1;
    });
  });

  const misconceptions = Object.entries(misconceptionCounts)
    .map(([key, count]) => {
      const [questionId, stem, answer] = key.split('|');
      return {
        questionId,
        stem,
        answer,
        count
      };
    })
    .sort((left, right) => right.count - left.count)
    .slice(0, 7);

  const masterySnapshot = lessons.map((lesson) => {
    const masteryScores = studentProfiles
      .map((entry) => entry.profile.lessonProfiles.find((profile) => profile.lessonId === lesson.id)?.mastery || 0);

    return {
      lessonId: lesson.id,
      title: lesson.title,
      averageMastery: masteryScores.length
        ? Math.round((masteryScores.reduce((sum, value) => sum + value, 0) / masteryScores.length) * 100)
        : 0
    };
  });

  const interventionQueue = studentProfiles
    .filter((entry) => entry.profile.risk.score >= 35)
    .sort((left, right) => right.profile.risk.score - left.profile.risk.score)
    .slice(0, 6);

  const recentActivity = buildRecentActivity(
    students,
    results,
    progressRecords,
    diagnostics,
    assessments,
    assessmentSubmissions
  );

  return {
    students,
    results,
    progressRecords,
    diagnostics,
    assessments,
    assessmentSubmissions,
    studentProfiles,
    latestResults,
    recentActivity,
    summary: {
      totalStudents: students.length,
      averageScore,
      completionRate,
      studentsAtRisk,
      diagnosticCoverage,
      totalAssessments: assessments.length,
      totalAssessmentSubmissions: assessmentSubmissions.length
    },
    charts: {
      lessonLabels: lessons.map((lesson) => `Lesson ${lesson.id}`),
      lessonScoreData,
      levelCounts,
      misconceptions
    },
    interventionQueue,
    masterySnapshot
  };
}

async function loadDashboardSnapshot() {
  const [
    students,
    results,
    progressRecords,
    diagnostics,
    assessments,
    assessmentSubmissions
  ] = await Promise.all([
    getAllStudents(),
    getAllQuizResults(),
    getAllProgress(),
    getAllDiagnostics(),
    getAllAssessments(),
    getAllAssessmentSubmissions()
  ]);

  dashboardSnapshot = buildDashboardSnapshot(
    students,
    results,
    progressRecords,
    diagnostics,
    assessments,
    assessmentSubmissions
  );
  dashboardLastUpdatedAt = new Date().toISOString();

  return dashboardSnapshot;
}

function renderRecentActivityFeed(snapshot) {
  return `
    <div class="card dashboard-panel">
      <div class="dashboard-panel__header">
        <h3 class="chart-card__title">Live Activity Feed</h3>
        <span class="badge badge--primary">Database</span>
      </div>
      <p class="chart-card__subtitle">New local records appear here as students learn, submit work, and complete milestones.</p>
      <div class="activity-feed">
        ${snapshot.recentActivity.length > 0 ? snapshot.recentActivity.map((item) => `
          <div class="activity-item">
            <div class="activity-item__top">
              <span class="badge badge--${item.tone}">${item.type}</span>
              <span class="activity-item__time">${formatTimeStamp(item.timestamp)}</span>
            </div>
            <div class="activity-item__title">${item.title}</div>
            <div class="activity-item__meta">${item.meta}</div>
          </div>
        `).join('') : '<div class="insight-empty">Waiting for learner activity on this device.</div>'}
      </div>
    </div>
  `;
}

function renderStudentRoster(snapshot) {
  if (!snapshot.students.length) {
    return `
      <div class="empty-state dashboard-empty">
        <div class="empty-state__icon">Data</div>
        <h2 class="empty-state__title">No Student Learning Data Yet</h2>
        <p class="empty-state__text">As students log in, complete diagnostics, and take quizzes, this live roster will update automatically.</p>
      </div>
    `;
  }

  return `
    <div class="student-table-wrap">
      <table class="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Lessons Completed</th>
            <th>Quizzes Taken</th>
            <th>Latest Score</th>
            <th>Next Focus</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          ${snapshot.students.map((student) => {
            const studentResults = snapshot.results
              .filter((result) => result.studentId === student.id)
              .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
            const latest = studentResults[0];
            const lessonsCompleted = snapshot.progressRecords.filter((record) => record.studentId === student.id).length;
            const studentProfileEntry = snapshot.studentProfiles.find((entry) => entry.student.id === student.id);
            const risk = studentProfileEntry?.profile.risk;
            const nextFocus = studentProfileEntry?.profile.recommendedNext?.title || '-';

            return `
              <tr class="student-row" data-id="${student.id}">
                <td class="student-table__name">${student.name}</td>
                <td>${lessonsCompleted}/${lessons.length}</td>
                <td>${studentResults.length}</td>
                <td class="student-table__score">${latest ? `${Math.round((latest.score / latest.totalQuestions) * 100)}%` : '-'}</td>
                <td>${nextFocus}</td>
                <td><span class="badge badge--${risk?.badge || 'neutral'}">${risk?.label || 'No Data'}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderDashboardBody(snapshot) {
  const { summary } = snapshot;

  return `
    <div class="dashboard-header">
      <div class="dashboard-header__top">
        <div>
          <h1 class="dashboard-header__title">Class Overview</h1>
          <p class="dashboard-header__subtitle">Analytics based on learning data stored on this device.</p>
        </div>
        <div class="dashboard-header__actions">
          <div class="dashboard-live-pill">
            <span class="dashboard-live-pill__dot"></span>
            Live database sync
          </div>
          <button class="btn btn--ghost btn--sm" id="btn-refresh-dashboard">Refresh Now</button>
        </div>
      </div>

      <div class="dashboard-live-bar">
        <div class="dashboard-live-bar__item"><strong>Last updated:</strong> <span id="dashboard-live-updated">${formatTimeStamp(dashboardLastUpdatedAt)}</span></div>
        <div class="dashboard-live-bar__item" id="dashboard-live-status-text"><strong>Sync mode:</strong> Instant local updates plus a 30 second heartbeat refresh.</div>
      </div>
    </div>

    <div class="stat-grid">
      ${renderStatCard('Students', summary.totalStudents, 'Total Students', 'primary', `${snapshot.results.length} quizzes recorded`)}
      ${renderStatCard('Average', `${summary.averageScore}%`, 'Average Score', 'accent', 'Latest quiz per student')}
      ${renderStatCard('Progress', `${summary.completionRate}%`, 'Completion Rate', 'success', `${snapshot.progressRecords.length} lesson completions logged`)}
      ${renderStatCard('Support', summary.studentsAtRisk, 'High Risk Learners', summary.studentsAtRisk > 0 ? 'danger' : 'success', 'Prediction score 60+')}
      ${renderStatCard('Diagnostic', `${summary.diagnosticCoverage}%`, 'Diagnostic Coverage', summary.diagnosticCoverage < 100 ? 'accent' : 'success', 'Students with readiness profiles')}
      ${renderStatCard('Assess', summary.totalAssessments, 'Published Assessments', summary.totalAssessments > 0 ? 'primary' : 'accent', `${summary.totalAssessmentSubmissions} assessment submissions logged`)}
    </div>

    <div class="charts-section">
      <div class="card chart-card">
        <h3 class="chart-card__title">Average Score by Lesson</h3>
        <div class="chart-card__canvas-wrap">
          <canvas id="chart-scores"></canvas>
        </div>
      </div>
      <div class="card chart-card">
        <h3 class="chart-card__title">Ability Level Distribution</h3>
        <div class="chart-card__canvas-wrap">
          <canvas id="chart-levels"></canvas>
        </div>
      </div>
    </div>

    <div class="charts-section" style="grid-template-columns: 1fr;">
      <div class="card chart-card">
        <h3 class="chart-card__title">Most Commonly Missed Questions</h3>
        <p class="chart-card__subtitle">This horizontal chart highlights the misconceptions showing up most often across the class.</p>
        <div class="chart-card__canvas-wrap chart-card__canvas-wrap--tall">
          <canvas id="chart-misconceptions"></canvas>
        </div>
      </div>
    </div>

    <div class="dashboard-panels">
      <div class="card dashboard-panel">
        <h3 class="chart-card__title">Intervention Queue</h3>
        <p class="chart-card__subtitle">Students who would benefit most from targeted teacher support right now.</p>
        <div class="intervention-list">
          ${snapshot.interventionQueue.length > 0 ? snapshot.interventionQueue.map((entry) => `
            <div class="intervention-item">
              <div>
                <div class="intervention-item__name">${entry.student.name}</div>
                <div class="intervention-item__meta">${entry.profile.risk.reasons.join(' | ')}</div>
              </div>
              <div style="text-align: right;">
                <div class="badge badge--${entry.profile.risk.badge}">Risk ${entry.profile.risk.score}</div>
                <div class="intervention-item__action">${entry.profile.risk.action}</div>
              </div>
            </div>
          `).join('') : '<div class="insight-empty">No learners are currently flagged for intervention.</div>'}
        </div>
      </div>

      <div class="card dashboard-panel">
        <h3 class="chart-card__title">Class Mastery Snapshot</h3>
        <p class="chart-card__subtitle">Average mastery by lesson after combining diagnostics, completion, and quiz performance.</p>
        <div class="mastery-grid">
          ${snapshot.masterySnapshot.map((entry) => `
            <div class="mastery-grid__item">
              <div class="mastery-grid__label">Lesson ${entry.lessonId}</div>
              <div class="mastery-grid__title">${entry.title}</div>
              <div class="mastery-grid__value">${entry.averageMastery}%</div>
            </div>
          `).join('')}
        </div>
      </div>

      ${renderRecentActivityFeed(snapshot)}
    </div>

    <div class="student-section">
      <div class="student-section__header">
        <div>
          <h3 class="student-section__title">Student Roster</h3>
          <p class="dashboard-header__subtitle">Tap a student row to open quiz history, risk signals, diagnostic summary, and per-question performance.</p>
        </div>
        <div class="export-area" style="margin-top: 0;">
          <button class="btn btn--primary btn--sm" id="btn-open-assessment-lab">Assessment Lab</button>
          <button class="btn btn--ghost btn--sm" id="btn-export-csv">Export CSV</button>
        </div>
      </div>

      ${renderStudentRoster(snapshot)}
    </div>
  `;
}

function isDashboardMounted() {
  return !!document.getElementById('dashboard-live-root');
}

function destroyCharts() {
  dashboardCharts.forEach((chart) => chart.destroy());
  dashboardCharts = [];
}

function bindDashboardActionHandlers(navigate) {
  const exportBtn = document.getElementById('btn-export-csv');
  const assessmentLabBtn = document.getElementById('btn-open-assessment-lab');
  const refreshBtn = document.getElementById('btn-refresh-dashboard');

  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      const csv = await exportAllDataAsCSV();
      downloadCSV(csv);
      showToast('Data exported successfully', 'success');
    });
  }

  if (assessmentLabBtn) {
    assessmentLabBtn.addEventListener('click', () => {
      navigate('/assessment-lab');
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      void refreshDashboardView('manual');
    });
  }

  document.querySelectorAll('.student-row').forEach((row) => {
    row.addEventListener('click', (event) => {
      const id = Number.parseInt(event.currentTarget.dataset.id, 10);
      showStudentDetailModal(id);
    });
  });
}

async function refreshDashboardView(reason = 'live-update') {
  if (!isDashboardMounted()) {
    teardownDashboardLiveUpdates();
    return;
  }

  if (dashboardRefreshPromise) {
    dashboardRefreshQueued = true;
    return dashboardRefreshPromise;
  }

  const refreshButton = document.getElementById('btn-refresh-dashboard');
  const originalButtonText = refreshButton?.textContent || 'Refresh Now';
  const statusText = document.getElementById('dashboard-live-status-text');

  if (refreshButton) {
    refreshButton.disabled = true;
    refreshButton.textContent = 'Refreshing...';
  }

  if (statusText) {
    statusText.innerHTML = '<strong>Sync mode:</strong> Refreshing live analytics from the local database...';
  }

  dashboardRefreshPromise = (async () => {
    await loadDashboardSnapshot();

    const root = document.getElementById('dashboard-live-root');
    if (!root) {
      return;
    }

    root.innerHTML = renderDashboardBody(dashboardSnapshot);
    bindDashboardActionHandlers(activeDashboardNavigate);
    await renderCharts();

    const updatedText = document.getElementById('dashboard-live-updated');
    if (updatedText) {
      updatedText.textContent = formatTimeStamp(dashboardLastUpdatedAt);
    }

    const syncText = document.getElementById('dashboard-live-status-text');
    if (syncText) {
      const label = reason === 'manual'
        ? 'Manual refresh complete.'
        : 'Live sync updated after a local database change.';
      syncText.innerHTML = `<strong>Sync mode:</strong> ${label}`;
    }
  })()
    .catch((error) => {
      console.error(error);
      showToast('Dashboard refresh failed. Please try again.', 'error');
    })
    .finally(() => {
      if (refreshButton) {
        refreshButton.disabled = false;
        refreshButton.textContent = originalButtonText;
      }

      dashboardRefreshPromise = null;

      if (dashboardRefreshQueued) {
        dashboardRefreshQueued = false;
        void refreshDashboardView('queued');
      }
    });

  return dashboardRefreshPromise;
}

function startDashboardLiveUpdates() {
  dashboardDataUnsubscribe = subscribeToDataChanges(() => {
    if (!isDashboardMounted()) {
      teardownDashboardLiveUpdates();
      return;
    }

    void refreshDashboardView('database-event');
  });

  dashboardVisibilityHandler = () => {
    if (document.visibilityState === 'visible' && isDashboardMounted()) {
      void refreshDashboardView('visibility');
    }
  };

  dashboardFocusHandler = () => {
    if (isDashboardMounted()) {
      void refreshDashboardView('focus');
    }
  };

  document.addEventListener('visibilitychange', dashboardVisibilityHandler);
  window.addEventListener('focus', dashboardFocusHandler);

  dashboardRefreshTimer = window.setInterval(() => {
    if (!isDashboardMounted()) {
      teardownDashboardLiveUpdates();
      return;
    }

    if (document.visibilityState === 'visible') {
      void refreshDashboardView('heartbeat');
    }
  }, DASHBOARD_REFRESH_INTERVAL_MS);
}

export function teardownDashboardLiveUpdates() {
  if (dashboardDataUnsubscribe) {
    dashboardDataUnsubscribe();
    dashboardDataUnsubscribe = null;
  }

  if (dashboardRefreshTimer) {
    window.clearInterval(dashboardRefreshTimer);
    dashboardRefreshTimer = null;
  }

  if (dashboardVisibilityHandler) {
    document.removeEventListener('visibilitychange', dashboardVisibilityHandler);
    dashboardVisibilityHandler = null;
  }

  if (dashboardFocusHandler) {
    window.removeEventListener('focus', dashboardFocusHandler);
    dashboardFocusHandler = null;
  }

  destroyCharts();

  if (studentDetailChart) {
    studentDetailChart.destroy();
    studentDetailChart = null;
  }

  dashboardRefreshPromise = null;
  dashboardRefreshQueued = false;
}

export async function renderDashboard() {
  await loadDashboardSnapshot();

  return `
    ${renderNav({ title: 'Teacher Dashboard', showBack: true, showSettings: true, showLogout: true })}
    <div class="container view-enter dashboard-page" style="padding-top: var(--space-6);">
      <div id="dashboard-live-root">
        ${renderDashboardBody(dashboardSnapshot)}
      </div>
    </div>
  `;
}

export function bindDashboardEvents(navigate) {
  teardownDashboardLiveUpdates();
  activeDashboardNavigate = navigate;

  bindNavEvents({
    onBack: () => navigate('/'),
    onSettings: showSettingsModal,
    onLogout: () => {
      clearTeacherAuthenticated();
      navigate('/');
    }
  });

  bindDashboardActionHandlers(navigate);
  void renderCharts();
  startDashboardLiveUpdates();
}

function showSettingsModal() {
  const currentKey = getApiKey() || '';
  const currentPin = getTeacherPin() || '';
  const html = `
    <div class="input-group" style="margin-bottom: var(--space-4);">
      <label>Google Gemini API Key</label>
      <input type="password" id="settings-api-key" class="input" value="${currentKey}" placeholder="AIzaSy...">
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">Used for quiz explanations, diagnostic coaching, and the AI tutor. You can update this any time.</p>
    </div>
    <div class="input-group">
      <label>Teacher PIN</label>
      <input type="password" id="settings-teacher-pin" class="input input--pin" value="${currentPin}" placeholder="0000" maxlength="4" inputmode="numeric">
    </div>
  `;

  showModal('Dashboard Settings', html, [
    { label: 'Cancel', variant: 'btn--ghost' },
    {
      label: 'Save',
      variant: 'btn--primary',
      onClick: async () => {
        const apiKeyInput = document.getElementById('settings-api-key');
        const teacherPinInput = document.getElementById('settings-teacher-pin');
        const apiKey = apiKeyInput?.value.trim() || '';
        const teacherPin = teacherPinInput?.value.trim() || '';

        if (teacherPin && !/^\d{4}$/.test(teacherPin)) {
          showToast('Teacher PIN must stay 4 digits.', 'error');
          return false;
        }

        await setApiKeyAsync(apiKey);
        if (teacherPin) {
          await setTeacherPinAsync(teacherPin);
        }

        showToast('Settings saved', 'success');
        return true;
      }
    }
  ]);
}

async function showStudentDetailModal(studentId) {
  const students = dashboardSnapshot?.students || await getAllStudents();
  const results = dashboardSnapshot?.results || await getAllQuizResults();
  const progressRecords = dashboardSnapshot?.progressRecords || await getAllProgress();
  const diagnostics = dashboardSnapshot?.diagnostics || await getAllDiagnostics();

  const student = students.find((entry) => entry.id === studentId);
  const studentResults = results
    .filter((result) => result.studentId === studentId)
    .sort((left, right) => new Date(left.completedAt) - new Date(right.completedAt));
  const latestDiagnostic = diagnostics
    .filter((entry) => entry.studentId === studentId)
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt))[0] || null;
  const profile = buildStudentProfile({
    diagnostic: latestDiagnostic,
    results: studentResults,
    progressRecords: progressRecords.filter((record) => record.studentId === studentId)
  });
  const latest = studentResults.at(-1);
  const avgScore = studentResults.length > 0
    ? Math.round((studentResults.reduce((sum, result) => sum + (result.score / result.totalQuestions), 0) / studentResults.length) * 100)
    : 0;
  const lessonsCompleted = progressRecords.filter((record) => record.studentId === studentId).length;
  const attempts = studentResults
    .flatMap((result) => result.responses.map((response) => ({
      ...response,
      lessonId: result.lessonId,
      completedAt: result.completedAt
    })))
    .sort((left, right) => new Date(right.answeredAt || right.completedAt) - new Date(left.answeredAt || left.completedAt));

  if (!student) return;

  const initials = student.name.slice(0, 2).toUpperCase();
  const html = `
    <div class="student-detail">
      <div class="student-detail__header">
        <div class="student-detail__avatar">${initials}</div>
        <div>
          <div class="student-detail__name">${student.name}</div>
          <div class="dashboard-header__subtitle">Lessons completed: ${lessonsCompleted}/${lessons.length}</div>
        </div>
      </div>

      <div class="student-detail__stats">
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${studentResults.length}</div>
          <div class="student-detail__stat-label">Quizzes Taken</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${avgScore}%</div>
          <div class="student-detail__stat-label">Average Score</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${latest ? latest.level : '-'}</div>
          <div class="student-detail__stat-label">Current Level</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${latest ? formatDuration(latest.averageTimeMs) : '00:00'}</div>
          <div class="student-detail__stat-label">Avg Question Time</div>
        </div>
      </div>

      <div class="student-detail__panel" style="margin-bottom: var(--space-4);">
        <h4 class="student-detail__history-title">Personalization Snapshot</h4>
        <div class="student-detail__snapshot">
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${profile.readiness.tone}">${profile.readiness.label}</span>
            <div class="student-detail__snapshot-text">${latestDiagnostic ? `Diagnostic completed on ${new Date(latestDiagnostic.completedAt).toLocaleDateString()}` : 'Diagnostic not completed yet.'}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${profile.risk.badge}">Risk ${profile.risk.score}</span>
            <div class="student-detail__snapshot-text">${profile.risk.action}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--primary">Next Focus</span>
            <div class="student-detail__snapshot-text">${profile.recommendedNext?.title || 'Lesson 1'} - ${profile.recommendedNext?.recommendedFocus || 'Continue the learning path.'}</div>
          </div>
        </div>
      </div>

      <div class="student-detail__layout">
        <div class="student-detail__panel">
          <h4 class="student-detail__history-title">Theta Trajectory</h4>
          <div class="student-detail__chart-wrap">
            <canvas id="student-theta-chart"></canvas>
          </div>
        </div>

        <div class="student-detail__panel">
          <h4 class="student-detail__history-title">Quiz History</h4>
          <div class="student-detail__quiz-list">
            ${studentResults.length > 0 ? studentResults.slice().reverse().map((result) => `
              <div class="student-detail__quiz-entry">
                <div>
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">Lesson ${result.lessonId}: ${getLessonTitle(result.lessonId)}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${new Date(result.completedAt).toLocaleDateString()}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: var(--font-weight-bold); color: ${result.score / result.totalQuestions >= 0.7 ? 'var(--color-success-400)' : 'var(--color-warning-400)'};">${Math.round((result.score / result.totalQuestions) * 100)}%</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">theta ${result.theta.toFixed(2)}</div>
                </div>
              </div>
            `).join('') : '<div style="padding: var(--space-4); text-align: center; color: var(--text-muted); font-size: var(--font-size-sm);">No quizzes taken yet.</div>'}
          </div>
        </div>
      </div>

      <div class="student-detail__panel" style="margin-top: var(--space-6);">
        <h4 class="student-detail__history-title">Per-Question Performance</h4>
        <div class="student-detail__table-wrap">
          <table class="student-detail__table">
            <thead>
              <tr>
                <th>Lesson</th>
                <th>Question</th>
                <th>Result</th>
                <th>Time</th>
                <th>Theta After</th>
              </tr>
            </thead>
            <tbody>
              ${attempts.length > 0 ? attempts.slice(0, 18).map((attempt) => `
                <tr>
                  <td>${attempt.lessonId}</td>
                  <td>
                    <div class="student-detail__question">${attempt.stem}</div>
                    <div class="student-detail__question-sub">${attempt.options[attempt.selectedIndex]} ${attempt.correct ? '' : `-> ${attempt.options[attempt.correctIndex]}`}</div>
                  </td>
                  <td><span class="badge badge--${attempt.correct ? 'success' : 'danger'}">${attempt.correct ? 'Correct' : 'Review'}</span></td>
                  <td>${formatDuration(attempt.elapsedMs)}</td>
                  <td>${attempt.thetaAfter}</td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: var(--space-4);">No per-question data yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  showModal('Student Profile', html, [{ label: 'Close', variant: 'btn--ghost' }], { modalClass: 'modal--wide' });

  if (studentResults.length > 0) {
    setTimeout(() => {
      void renderStudentThetaChart(studentResults);
    }, 0);
  }
}

async function renderCharts() {
  if (!dashboardSnapshot) return;
  destroyCharts();

  const Chart = await ensureChartJS();
  Chart.defaults.color = '#94A3B8';
  Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.1)';

  const scoresCtx = document.getElementById('chart-scores');
  if (scoresCtx) {
    dashboardCharts.push(new Chart(scoresCtx, {
      type: 'bar',
      data: {
        labels: dashboardSnapshot.charts.lessonLabels,
        datasets: [{
          label: 'Average Score (%)',
          data: dashboardSnapshot.charts.lessonScoreData,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    }));
  }

  const levelsCtx = document.getElementById('chart-levels');
  if (levelsCtx) {
    dashboardCharts.push(new Chart(levelsCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(dashboardSnapshot.charts.levelCounts),
        datasets: [{
          data: Object.values(dashboardSnapshot.charts.levelCounts),
          backgroundColor: ['#34D399', '#818CF8', '#FBBF24', '#FB7185'],
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' }
        }
      }
    }));
  }

  const misconceptionsCtx = document.getElementById('chart-misconceptions');
  if (misconceptionsCtx) {
    const labels = dashboardSnapshot.charts.misconceptions.map((item) => item.stem);
    const counts = dashboardSnapshot.charts.misconceptions.map((item) => item.count);
    dashboardCharts.push(new Chart(misconceptionsCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Times missed',
          data: counts,
          backgroundColor: 'rgba(244, 63, 94, 0.75)',
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label(context) {
                const item = dashboardSnapshot.charts.misconceptions[context.dataIndex];
                return `${context.raw} misses - common wrong answer: ${item.answer}`;
              }
            }
          }
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } },
          y: {
            ticks: {
              callback(value, index) {
                return `Q${index + 1}`;
              }
            }
          }
        }
      }
    }));
  }
}

async function renderStudentThetaChart(studentResults) {
  const canvas = document.getElementById('student-theta-chart');
  if (!canvas) return;

  const Chart = await ensureChartJS();
  if (studentDetailChart) {
    studentDetailChart.destroy();
    studentDetailChart = null;
  }

  const labels = studentResults.map((result) => `L${result.lessonId}`);
  const thetaValues = studentResults.map((result) => result.theta);

  studentDetailChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Theta',
        data: thetaValues,
        borderColor: '#818CF8',
        backgroundColor: 'rgba(129, 140, 248, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: -3,
          max: 3
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}
