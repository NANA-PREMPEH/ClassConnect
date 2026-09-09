/**
 * ClassConnect - Teacher Dashboard View
 * Live analytics dashboard backed by IndexedDB with auto-refresh and activity feed.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderStaffShell, bindStaffShell } from '../components/staff-shell.js';
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
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  updateStudent,
  updateStudentPin,
  bulkCreateStudents,
  downloadFullSchoolBackup,
  restoreFullSchoolBackup,
  getApiKey,
  getTeacherPin,
  setApiKeyAsync,
  setTeacherPinAsync,
  subscribeToDataChanges,
  getCurrentTeacher,
  getAccessibleClassIds,
  getStaffClassContext,
  setStaffClassContext,
  getAllUsers,
  saveAssessmentSubmission,
  saveQuizResult,
  getAuditLog,
  createUser,
  USER_ROLES,
  ROLE_LABELS,
  hasPermission
} from '../engine/storage.js';
import { lessons } from '../data/lessons.js';
import { buildStudentProfile } from '../engine/personalization.js';
import { ensureChartJS } from '../engine/chart-loader.js';
import { parseRosterCSV, downloadSampleRosterCSV } from '../engine/roster-importer.js';
import { openSubmissionToken } from '../engine/submission-token.js';

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
let selectedClassId = 'all';
let rosterSearchQuery = '';
let dashboardWorkspace = 'overview';
let learnerFilters = { status: 'all', gender: 'all', risk: 'all', participation: 'all' };

function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

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
    allClasses,
    allStudents,
    results,
    progressRecords,
    diagnostics,
    assessments,
    assessmentSubmissions
  ] = await Promise.all([
    getAllClasses(),
    getAllStudents(),
    getAllQuizResults(),
    getAllProgress(),
    getAllDiagnostics(),
    getAllAssessments(),
    getAllAssessmentSubmissions()
  ]);

  const accessibleClassIds = getAccessibleClassIds();
  const visibleClasses = accessibleClassIds === null ? allClasses : allClasses.filter((entry) => accessibleClassIds.includes(Number(entry.id)));
  const classContext = getStaffClassContext();
  if (selectedClassId === 'all' && classContext.selectedClassId !== 'all') selectedClassId = classContext.selectedClassId;
  if (selectedClassId !== 'all' && !visibleClasses.some((entry) => String(entry.id) === String(selectedClassId))) selectedClassId = 'all';
  const classesWithCounts = visibleClasses.map((c) => ({
    ...c,
    studentCount: allStudents.filter((s) => s.classId === c.id).length
  }));

  // Filter students based on selectedClassId
  const scopedStudents = accessibleClassIds === null ? allStudents : allStudents.filter((entry) => accessibleClassIds.includes(Number(entry.classId)));
  const students = selectedClassId === 'all'
    ? scopedStudents
    : scopedStudents.filter((s) => String(s.classId) === String(selectedClassId));

  const filteredStudentIds = new Set(students.map((s) => s.id));

  const filteredResults = selectedClassId === 'all'
    ? results
    : results.filter((r) => filteredStudentIds.has(r.studentId));

  const filteredProgress = selectedClassId === 'all'
    ? progressRecords
    : progressRecords.filter((p) => filteredStudentIds.has(p.studentId));

  const filteredDiagnostics = selectedClassId === 'all'
    ? diagnostics
    : diagnostics.filter((d) => filteredStudentIds.has(d.studentId));

  const filteredSubmissions = selectedClassId === 'all'
    ? assessmentSubmissions
    : assessmentSubmissions.filter((s) => filteredStudentIds.has(s.studentId));

  dashboardSnapshot = buildDashboardSnapshot(
    students,
    filteredResults,
    filteredProgress,
    filteredDiagnostics,
    assessments,
    filteredSubmissions
  );

  dashboardSnapshot.classes = classesWithCounts;
  dashboardSnapshot.auditEntries = (await getAuditLog()).slice(0, 8);
  setStaffClassContext(visibleClasses, selectedClassId);
  dashboardSnapshot.allStudents = allStudents;
  dashboardSnapshot.selectedClassId = selectedClassId;
  dashboardSnapshot.currentTeacher = getCurrentTeacher();
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
        <h2 class="empty-state__title">No Students in Selected View</h2>
        <p class="empty-state__text">Import a CSV roster or change your class filter to display student learning records.</p>
      </div>
    `;
  }

  const query = rosterSearchQuery.trim().toLowerCase();
  const filteredStudents = query
    ? snapshot.students.filter((s) =>
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.indexNumber && s.indexNumber.toLowerCase().includes(query))
      )
    : snapshot.students;
  const filteredByAttributes = filteredStudents.filter((student) => {
    const profile = snapshot.studentProfiles.find((entry) => entry.student.id === student.id)?.profile;
    const attempts = snapshot.results.filter((entry) => entry.studentId === student.id).length;
    return (learnerFilters.status === 'all' || (student.status || 'active') === learnerFilters.status)
      && (learnerFilters.gender === 'all' || (student.gender || 'unspecified') === learnerFilters.gender)
      && (learnerFilters.risk === 'all' || profile?.risk?.badge === learnerFilters.risk)
      && (learnerFilters.participation === 'all' || (learnerFilters.participation === 'started' ? attempts > 0 : attempts === 0));
  });

  if (!filteredByAttributes.length) {
    return `
      <div class="empty-state dashboard-empty">
        <h3 class="empty-state__title">No Matching Learners</h3>
        <p class="empty-state__text">No students matched "${escapeHTML(rosterSearchQuery)}". Try searching for another name or index number.</p>
      </div>
    `;
  }

  return `
    <div class="student-table-wrap">
      <table class="student-table">
        <thead>
          <tr>
            <th><input type="checkbox" id="select-all-learners" aria-label="Select all visible learners"></th>
            <th>Index #</th>
            <th>Name</th>
            <th>Class / Stream</th>
            <th>Gender</th>
            <th>Lessons</th>
            <th>Quizzes</th>
            <th>Latest Score</th>
            <th>Risk</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filteredByAttributes.map((student) => {
            const studentResults = snapshot.results
              .filter((result) => result.studentId === student.id)
              .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
            const latest = studentResults[0];
            const lessonsCompleted = snapshot.progressRecords.filter((record) => record.studentId === student.id).length;
            const studentProfileEntry = snapshot.studentProfiles.find((entry) => entry.student.id === student.id);
            const risk = studentProfileEntry?.profile.risk;
            const className = snapshot.classes.find((c) => c.id === student.classId)?.name || 'General';

            return `
              <tr class="student-row" data-id="${student.id}">
                <td><input type="checkbox" class="learner-select" value="${student.id}" aria-label="Select ${escapeHTML(student.name)}"></td>
                <td><code style="font-size: var(--font-size-xs);">${escapeHTML(student.indexNumber || `GES-B7-${student.id}`)}</code></td>
                <td class="student-table__name">${escapeHTML(student.name)}</td>
                <td><span class="badge badge--neutral">${escapeHTML(className)}</span></td>
                <td>${escapeHTML(student.gender || 'Unspecified')}</td>
                <td>${lessonsCompleted}/${lessons.length}</td>
                <td>${studentResults.length}</td>
                <td class="student-table__score">${latest ? `${Math.round((latest.score / latest.totalQuestions) * 100)}%` : '-'}</td>
                <td><span class="badge badge--${risk?.badge || 'neutral'}">${risk?.label || 'No Data'}</span></td>
                <td style="text-align: right; white-space: nowrap;" onclick="event.stopPropagation();">
                  <button class="btn btn--ghost btn--xs btn-quick-profile" data-id="${student.id}" title="Open learner profile">Profile</button>
                  <button class="btn btn--ghost btn--xs btn-quick-report-card" data-id="${student.id}" title="View Terminal Report Card">Report Card</button>
                  <button class="btn btn--ghost btn--xs btn-quick-reset-pin" data-id="${student.id}" title="Reset 4-digit PIN">Reset PIN</button>
                  <button class="btn btn--ghost btn--xs btn-quick-edit-student" data-id="${student.id}" title="Edit or transfer learner">Edit</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderDashboardBody(snapshot) {
  return dashboardWorkspace === 'learners' ? renderLearnersBody(snapshot) : renderOverviewBody(snapshot);
  /* Legacy full-page dashboard retained below as a reference while its
     capabilities are delivered through separate staff workspaces. */
  const { summary } = snapshot;
  const can = (permission) => hasPermission(permission, snapshot.currentTeacher);

  return `
    <div class="dashboard-header">
      <div class="dashboard-header__top">
        <div>
          <h1 class="dashboard-header__title">Class Overview</h1>
          <p class="dashboard-header__subtitle">Analytics based on learning data stored on this device.</p>
        </div>
        <div class="dashboard-header__actions">
          <div class="class-selector-box" style="display: flex; align-items: center; gap: var(--space-2);">
            <select id="class-filter-select" class="select-class" title="Filter by Class">
              <option value="all" ${snapshot.selectedClassId === 'all' ? 'selected' : ''}>All Classes (${snapshot.classes.length})</option>
              ${snapshot.classes.map((c) => `
                <option value="${c.id}" ${String(snapshot.selectedClassId) === String(c.id) ? 'selected' : ''}>
                  ${escapeHTML(c.name)} (${c.studentCount})
                </option>
              `).join('')}
            </select>
            ${can('classes.manage') ? '<button class="btn btn--secondary btn--sm" id="btn-manage-classes">Classes</button>' : ''}
          </div>
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
          <p class="dashboard-header__subtitle">Manage learners, view continuous assessment broadsheets, print report cards, or reset PINs.</p>
        </div>
        <div class="export-area" style="margin-top: 0; display: flex; gap: var(--space-2); flex-wrap: wrap;">
          ${can('roster.manage') ? '<button class="btn btn--secondary btn--sm" id="btn-import-roster">Import Roster (CSV)</button><button class="btn btn--secondary btn--sm" id="btn-print-slips">Print Login Slips</button><button class="btn btn--secondary btn--sm" id="btn-collect-submissions">Collect USB Submissions</button>' : ''}
          <button class="btn btn--primary btn--sm" id="btn-open-gradebook">📊 Broadsheet Gradebook</button>
          ${can('assessment.manage') ? '<button class="btn btn--secondary btn--sm" id="btn-open-assessment-lab">Assessment Lab</button>' : ''}
          ${can('lab.monitor') ? '<button class="btn btn--primary btn--sm" id="btn-open-lab-monitor">Live Lab Monitor</button>' : ''}
          ${can('cms.manage') ? '<button class="btn btn--secondary btn--sm" id="btn-open-lesson-editor">Lesson CMS</button><button class="btn btn--secondary btn--sm" id="btn-open-question-editor">Question Bank</button>' : ''}
          ${can('data.export') ? '<button class="btn btn--ghost btn--sm" id="btn-export-csv">Export CSV</button>' : ''}
          ${can('users.manage') ? '<button class="btn btn--secondary btn--sm" id="btn-manage-users">Staff accounts</button>' : ''}
          ${can('audit.view') ? '<button class="btn btn--ghost btn--sm" id="btn-view-audit-log">Audit log</button>' : ''}
        </div>
      </div>

      <div class="roster-filter-bar">
        <input type="search" id="roster-search-input" class="input input--sm roster-search-input" placeholder="Search roster by name or index #..." value="${escapeHTML(rosterSearchQuery)}">
      </div>

      <div id="roster-table-container">
        ${renderStudentRoster(snapshot)}
      </div>
    </div>
  `;
}

function renderOverviewBody(snapshot) {
  const { summary } = snapshot;
  const can = (permission) => hasPermission(permission, snapshot.currentTeacher);
  const actions = [
    can('roster.manage') && ['Classes & Learners', 'Find learners, manage rosters, issue PINs.', '/students'],
    can('assessment.manage') && ['Assessments', 'Create, publish, and review assessment activity.', '/assessment-lab'],
    can('gradebook') && ['Gradebook & Reports', 'Review terminal marks and report cards.', '/gradebook'],
    can('cms.manage') && ['Curriculum', 'Author lessons and maintain the question bank.', '/lesson-editor'],
    can('lab.monitor') && ['Lab Monitor', 'Monitor active assessment sessions.', '/lab-monitor'],
    can('users.manage') && ['Administration', 'Staff, classes, backups, and audit records.', '/admin']
  ].filter(Boolean);
  return `<div class="dashboard-header"><div class="dashboard-header__top"><div><h2 class="dashboard-header__title">School overview</h2><p class="dashboard-header__subtitle">The most important learning signals and next actions for your current access scope.</p></div><div class="dashboard-header__actions"><select id="overview-period" class="input input--sm" aria-label="Overview time period"><option value="term">This term</option><option value="today">Today</option></select><button class="btn btn--ghost btn--sm" id="btn-refresh-dashboard">Refresh</button></div></div><div class="dashboard-live-bar"><div class="dashboard-live-bar__item"><strong>Last updated:</strong> <span id="dashboard-live-updated">${formatTimeStamp(dashboardLastUpdatedAt)}</span></div><div class="dashboard-live-bar__item" id="dashboard-live-status-text"><strong>Live sync:</strong> Local school data is up to date.</div></div></div>
    <div class="stat-grid">${renderStatCard('Students', summary.totalStudents, 'Learners in scope', 'primary', `${snapshot.results.length} quiz records`)}${renderStatCard('Average', `${summary.averageScore}%`, 'Average score', 'accent', 'Latest quiz per learner')}${renderStatCard('Support', summary.studentsAtRisk, 'Needs attention', summary.studentsAtRisk ? 'danger' : 'success', 'Risk score 60+')}${renderStatCard('Assess', summary.totalAssessments, 'Published assessments', 'primary', `${summary.totalAssessmentSubmissions} submissions`)}</div>
    <section><div class="staff-section-heading"><div><h2>Quick actions</h2><p>Open a focused workspace instead of managing everything here.</p></div></div><div class="workspace-card-grid">${actions.map(([title, description, route]) => `<button class="workspace-action-card" data-workspace-route="${route}"><strong>${title}</strong><span>${description}</span></button>`).join('')}</div></section>
    <div class="dashboard-panels"><div class="card dashboard-panel"><h3 class="chart-card__title">Needs attention</h3><p class="chart-card__subtitle">Learners who would benefit most from a timely follow-up.</p><div class="intervention-list">${snapshot.interventionQueue.slice(0, 5).map((entry) => `<button class="intervention-item intervention-item--button" data-learner-profile="${entry.student.id}"><div><div class="intervention-item__name">${escapeHTML(entry.student.name)}</div><div class="intervention-item__meta">${escapeHTML(entry.profile.risk.reasons.join(' · '))}</div></div><span class="badge badge--${entry.profile.risk.badge}">Risk ${entry.profile.risk.score}</span></button>`).join('') || '<div class="insight-empty">No learners are currently flagged.</div>'}</div></div>${renderRecentActivityFeed(snapshot)}</div><details class="card learning-insights"><summary>Learning insights <span>Expand charts and misconception patterns</span></summary><div class="charts-section"><div class="card chart-card"><h3 class="chart-card__title">Average score by lesson</h3><div class="chart-card__canvas-wrap"><canvas id="chart-scores"></canvas></div></div><div class="card chart-card"><h3 class="chart-card__title">Ability level distribution</h3><div class="chart-card__canvas-wrap"><canvas id="chart-levels"></canvas></div></div></div><div class="card chart-card"><h3 class="chart-card__title">Most commonly missed questions</h3><div class="chart-card__canvas-wrap chart-card__canvas-wrap--tall"><canvas id="chart-misconceptions"></canvas></div></div></details><section class="card dashboard-panel"><h3 class="chart-card__title">Recent changes</h3><div class="activity-feed">${snapshot.auditEntries.map((entry) => `<div class="activity-item"><div class="activity-item__top"><span class="badge badge--neutral">${escapeHTML(entry.action)}</span><span class="activity-item__time">${formatTimeStamp(entry.createdAt)}</span></div><div class="activity-item__meta">${escapeHTML(entry.actor || 'system')}</div></div>`).join('') || '<div class="insight-empty">No recent administrative changes.</div>'}</div></section>`;
}

function renderLearnersBody(snapshot) {
  const canExport = hasPermission('data.export', snapshot.currentTeacher);
  return `<div class="dashboard-header"><div class="dashboard-header__top"><div><h2 class="dashboard-header__title">Classes & learners</h2><p class="dashboard-header__subtitle">Search, support, and manage learners in your permitted classes.</p></div><div class="dashboard-header__actions"><select id="class-filter-select" class="select-class" aria-label="Filter learners by class"><option value="all">All permitted classes (${snapshot.classes.length})</option>${snapshot.classes.map((entry) => `<option value="${entry.id}" ${String(snapshot.selectedClassId) === String(entry.id) ? 'selected' : ''}>${escapeHTML(entry.name)} (${entry.studentCount})</option>`).join('')}</select><button class="btn btn--ghost btn--sm" id="btn-refresh-dashboard">Refresh</button></div></div></div><section class="class-directory"><h3>My classes</h3><div class="class-directory__grid">${snapshot.classes.map((entry) => `<button class="class-directory__card" data-class-directory-id="${entry.id}"><strong>${escapeHTML(entry.name)}</strong><span>${entry.studentCount} learners · ${escapeHTML(entry.term || 'Current term')}</span></button>`).join('') || '<p class="insight-empty">No class assignments are available.</p>'}</div></section><section class="student-section"><div class="student-section__header"><div><h3 class="student-section__title">Learner roster</h3><p class="dashboard-header__subtitle">Open a learner to view their history, reset access, transfer them, or issue a report card.</p></div><div class="export-area"><button class="btn btn--secondary btn--sm" id="btn-import-roster">Import roster</button><button class="btn btn--secondary btn--sm" id="btn-print-slips">Print login slips</button>${canExport ? '<button class="btn btn--ghost btn--sm" id="btn-export-csv">Export data</button>' : ''}</div></div><div class="roster-filter-bar"><input type="search" id="roster-search-input" class="input input--sm roster-search-input" placeholder="Search by learner name or index number" value="${escapeHTML(rosterSearchQuery)}"><div class="learner-filter-chips"><select class="input input--sm" data-learner-filter="status"><option value="all">All statuses</option><option value="active" ${learnerFilters.status === 'active' ? 'selected' : ''}>Active</option><option value="transferred" ${learnerFilters.status === 'transferred' ? 'selected' : ''}>Transferred</option></select><select class="input input--sm" data-learner-filter="gender"><option value="all">All genders</option><option value="male">Male</option><option value="female">Female</option></select><select class="input input--sm" data-learner-filter="risk"><option value="all">All risk levels</option><option value="danger">High risk</option><option value="warning">Watch</option><option value="success">On track</option></select><select class="input input--sm" data-learner-filter="participation"><option value="all">Any participation</option><option value="started">Started work</option><option value="not-started">Not started</option></select></div></div><div id="roster-table-container">${renderStudentRoster(snapshot)}</div></section>`;
}

function isDashboardMounted() {
  return !!document.getElementById('dashboard-live-root');
}

function destroyCharts() {
  dashboardCharts.forEach((chart) => chart.destroy());
  dashboardCharts = [];
}

async function collectSubmissionFiles(files) {
  const students = await getAllStudents();
  const existingQuiz = await getAllQuizResults();
  const existingAssessments = await getAllAssessmentSubmissions();
  let imported = 0;
  const failures = [];
  for (const file of [...files].filter((entry) => entry.name.toLowerCase().endsWith('.ccsub'))) {
    try {
      const { student, payload } = await openSubmissionToken(file, students);
      const record = payload.submission?.record;
      if (!record) throw new Error('No submission record found.');
      if (payload.submission.kind === 'quiz') {
        if (existingQuiz.some((entry) => entry.studentId === student.id && entry.lessonId === record.lessonId && entry.completedAt === record.completedAt)) continue;
        const { id, studentId, ...clean } = record;
        await saveQuizResult({ ...clean, studentId: student.id, completedAt: record.completedAt });
      } else if (payload.submission.kind === 'assessment') {
        if (existingAssessments.some((entry) => entry.studentId === student.id && entry.assessmentId === record.assessmentId && entry.completedAt === record.completedAt)) continue;
        const { id, studentId, ...clean } = record;
        await saveAssessmentSubmission({ ...clean, studentId: student.id, completedAt: record.completedAt });
      } else throw new Error('Unsupported submission type.');
      imported += 1;
    } catch (error) { failures.push(`${file.name}: ${error.message}`); }
  }
  showToast(`${imported} USB submission${imported === 1 ? '' : 's'} imported${failures.length ? `; ${failures.length} rejected` : ''}.`, failures.length ? 'warning' : 'success');
}

function openSubmissionCollector() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.ccsub,application/json';
  input.multiple = true;
  input.addEventListener('change', async () => { if (input.files?.length) await collectSubmissionFiles(input.files); });
  input.click();
}

function bindDashboardActionHandlers(navigate) {
  const exportBtn = document.getElementById('btn-export-csv');
  const assessmentLabBtn = document.getElementById('btn-open-assessment-lab');
  const labMonitorBtn = document.getElementById('btn-open-lab-monitor');
  const lessonEditorBtn = document.getElementById('btn-open-lesson-editor');
  const questionEditorBtn = document.getElementById('btn-open-question-editor');
  const refreshBtn = document.getElementById('btn-refresh-dashboard');
  const classFilterSelect = document.getElementById('class-filter-select');
  const manageClassesBtn = document.getElementById('btn-manage-classes');
  const importRosterBtn = document.getElementById('btn-import-roster');
  const printSlipsBtn = document.getElementById('btn-print-slips');
  const searchInput = document.getElementById('roster-search-input');
  const manageUsersBtn = document.getElementById('btn-manage-users');
  const auditLogBtn = document.getElementById('btn-view-audit-log');
  const collectSubmissionsBtn = document.getElementById('btn-collect-submissions');

  document.querySelectorAll('[data-workspace-route]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.workspaceRoute)));

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
  if (labMonitorBtn) labMonitorBtn.addEventListener('click', () => navigate('/lab-monitor'));
  if (collectSubmissionsBtn) collectSubmissionsBtn.addEventListener('click', () => openSubmissionCollector());
  if (lessonEditorBtn) lessonEditorBtn.addEventListener('click', () => navigate('/lesson-editor'));
  if (questionEditorBtn) questionEditorBtn.addEventListener('click', () => navigate('/question-editor'));

  const gradebookBtn = document.getElementById('btn-open-gradebook');
  if (gradebookBtn) {
    gradebookBtn.addEventListener('click', () => {
      navigate('/gradebook');
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      void refreshDashboardView('manual');
    });
  }

  document.getElementById('overview-period')?.addEventListener('change', (event) => {
    const text = document.getElementById('dashboard-live-status-text');
    if (text) text.innerHTML = `<strong>View:</strong> ${event.currentTarget.value === 'today' ? 'Today’s available local activity.' : 'This term’s available local activity.'}`;
  });

  if (classFilterSelect) {
    classFilterSelect.addEventListener('change', (e) => {
      selectedClassId = e.target.value;
      setStaffClassContext(dashboardSnapshot?.classes || [], selectedClassId);
      void refreshDashboardView('manual');
    });
  }

  if (manageClassesBtn) {
    manageClassesBtn.addEventListener('click', () => {
      void showManageClassesModal();
    });
  }

  if (importRosterBtn) {
    importRosterBtn.addEventListener('click', () => {
      void showImportRosterModal();
    });
  }

  if (printSlipsBtn) {
    printSlipsBtn.addEventListener('click', () => {
      void showPrintLoginSlipsModal();
    });
  }
  if (manageUsersBtn) manageUsersBtn.addEventListener('click', () => void showUserManagementModal());
  if (auditLogBtn) auditLogBtn.addEventListener('click', () => void showAuditLogModal());

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      rosterSearchQuery = e.target.value;
      const container = document.getElementById('roster-table-container');
      if (container && dashboardSnapshot) {
        container.innerHTML = renderStudentRoster(dashboardSnapshot);
        bindRosterInteractiveEvents();
      }
    });
  }

  document.querySelectorAll('[data-learner-filter]').forEach((control) => control.addEventListener('change', (event) => {
    learnerFilters[event.currentTarget.dataset.learnerFilter] = event.currentTarget.value;
    const container = document.getElementById('roster-table-container');
    if (container && dashboardSnapshot) { container.innerHTML = renderStudentRoster(dashboardSnapshot); bindRosterInteractiveEvents(); }
  }));
  document.querySelectorAll('[data-class-directory-id]').forEach((button) => button.addEventListener('click', (event) => {
    selectedClassId = event.currentTarget.dataset.classDirectoryId;
    void refreshDashboardView('manual');
  }));
  document.querySelectorAll('[data-learner-profile]').forEach((button) => button.addEventListener('click', () => void showStudentDetailModal(Number(button.dataset.learnerProfile))));

  bindRosterInteractiveEvents();
}

function bindRosterInteractiveEvents() {
  document.querySelectorAll('.student-row').forEach((row) => {
    row.addEventListener('click', (event) => {
      const id = Number.parseInt(event.currentTarget.dataset.id, 10);
      showStudentDetailModal(id);
    });
  });

  document.querySelectorAll('.btn-quick-reset-pin').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = Number.parseInt(event.currentTarget.dataset.id, 10);
      void handleResetStudentPin(id);
    });
  });

  document.querySelectorAll('.btn-quick-profile').forEach((btn) => {
    btn.addEventListener('click', (event) => { event.stopPropagation(); void showStudentDetailModal(Number.parseInt(event.currentTarget.dataset.id, 10)); });
  });

  document.querySelectorAll('.btn-quick-report-card').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = Number.parseInt(event.currentTarget.dataset.id, 10);
      if (activeDashboardNavigate) {
        activeDashboardNavigate(`/report-card/${id}`);
      }
    });
  });

  document.querySelectorAll('.btn-quick-edit-student').forEach((btn) => {
    btn.addEventListener('click', (event) => { event.stopPropagation(); void handleEditStudent(Number.parseInt(event.currentTarget.dataset.id, 10)); });
  });
  document.getElementById('select-all-learners')?.addEventListener('change', (event) => document.querySelectorAll('.learner-select').forEach((input) => { input.checked = event.currentTarget.checked; }));
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
  dashboardWorkspace = 'overview';
  await loadDashboardSnapshot();
  return renderStaffShell({ title: 'Overview', subtitle: 'A focused view of learning, priorities, and the next staff action.', activePath: '/dashboard', content: `<div id="dashboard-live-root">${renderDashboardBody(dashboardSnapshot)}</div>` });
}

export async function renderLearnersWorkspace() {
  dashboardWorkspace = 'learners';
  await loadDashboardSnapshot();
  return renderStaffShell({ title: 'Classes & Learners', subtitle: 'Roster, access, and learner support for your assigned classes.', activePath: '/students', content: `<div id="dashboard-live-root">${renderDashboardBody(dashboardSnapshot)}</div>` });
}

export function bindDashboardEvents(navigate) {
  teardownDashboardLiveUpdates();
  activeDashboardNavigate = navigate;

  bindStaffShell(navigate, { onLogout: () => {
      clearTeacherAuthenticated();
      navigate('/');
  } });

  bindDashboardActionHandlers(navigate);
  void renderCharts();
  startDashboardLiveUpdates();
}

export function bindLearnersWorkspaceEvents(navigate) { bindDashboardEvents(navigate); }

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

    <div class="divider" style="margin: var(--space-5) 0;"></div>

    <div>
      <h4 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-2); color: var(--text-primary);">School Backup & Disaster Recovery</h4>
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-bottom: var(--space-3);">
        Export a full snapshot of classes, rosters, quiz histories, and assessments. You can restore this JSON file on any computer.
      </p>
      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
        <button type="button" class="btn btn--secondary btn--sm" id="btn-backup-download">Download Full Backup (.json)</button>
        <button type="button" class="btn btn--ghost btn--sm" id="btn-backup-restore">Restore from Backup File</button>
        <input type="file" id="backup-restore-file" accept=".json" style="display: none;">
      </div>
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

  document.getElementById('btn-backup-download')?.addEventListener('click', async () => {
    await downloadFullSchoolBackup();
    showToast('School database backup downloaded.', 'success');
  });

  const restoreBtn = document.getElementById('btn-backup-restore');
  const fileInput = document.getElementById('backup-restore-file');

  if (restoreBtn && fileInput) {
    restoreBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target.result);
          if (confirm('Are you sure you want to restore data from this backup? Any new records will be merged.')) {
            await restoreFullSchoolBackup(json, 'merge');
            showToast('School database restored successfully!', 'success');
            void refreshDashboardView('manual');
          }
        } catch (err) {
          console.error(err);
          showToast('Failed to restore backup: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    });
  }
}

async function showUserManagementModal() {
  const [users, classes] = await Promise.all([getAllUsers(), getAllClasses()]);
  const html = `
    <div class="dashboard-panel" style="margin-bottom:var(--space-5);">
      <h4 class="chart-card__title">Current staff accounts</h4>
      ${users.map((user) => `<div style="padding:var(--space-2) 0; border-bottom:1px solid var(--color-slate-700);"><strong>${escapeHTML(user.name || user.username)}</strong> <span class="badge badge--primary">${escapeHTML(ROLE_LABELS[user.role] || user.role)}</span><br><small>@${escapeHTML(user.username)}${user.role === USER_ROLES.TEACHER ? ` · ${user.classIds?.length ? `${user.classIds.length} assigned class(es)` : 'No classes assigned'}` : ''}</small></div>`).join('')}
    </div>
    <form id="staff-account-form" style="display:grid;gap:var(--space-3);">
      <h4 class="chart-card__title">Add staff account</h4>
      <input class="input" id="staff-account-name" required placeholder="Full name">
      <input class="input" id="staff-account-username" required pattern="[A-Za-z0-9._-]{3,40}" placeholder="Username">
      <input class="input input--pin" id="staff-account-pin" required pattern="[0-9]{4,8}" maxlength="8" inputmode="numeric" placeholder="4–8 digit PIN">
      <select class="input" id="staff-account-role">${Object.entries(ROLE_LABELS).map(([role, label]) => `<option value="${role}">${escapeHTML(label)}</option>`).join('')}</select>
      <label style="font-size:var(--font-size-sm);">Assigned classes (Subject Teachers only)<select class="input" id="staff-account-classes" multiple size="${Math.min(Math.max(classes.length, 2), 5)}">${classes.map((entry) => `<option value="${entry.id}">${escapeHTML(entry.name)}</option>`).join('')}</select></label>
      <button class="btn btn--primary" type="submit">Create staff account</button>
    </form>`;
  showModal('Staff accounts & role access', html, [{ label: 'Close', variant: 'btn--ghost' }], { modalClass: 'modal--wide' });
  document.getElementById('staff-account-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const selected = [...document.getElementById('staff-account-classes').selectedOptions].map((option) => Number(option.value));
      await createUser({ name: document.getElementById('staff-account-name').value.trim(), username: document.getElementById('staff-account-username').value.trim(), pin: document.getElementById('staff-account-pin').value.trim(), role: document.getElementById('staff-account-role').value, classIds: selected });
      showToast('Staff account created.', 'success');
      document.querySelector('.modal-backdrop')?.remove();
      void refreshDashboardView('manual');
    } catch (error) { showToast(error.message || 'Could not create staff account.', 'error'); }
  });
}

async function showAuditLogModal() {
  const entries = await getAuditLog();
  const html = entries.length ? `<div style="max-height:60vh;overflow:auto;">${entries.map((entry) => `<div style="padding:var(--space-3) 0;border-bottom:1px solid var(--color-slate-700);"><strong>${escapeHTML(entry.action)}</strong><br><small>${new Date(entry.createdAt).toLocaleString()} · ${escapeHTML(entry.actor || 'system')}</small><br><small>${escapeHTML(JSON.stringify(entry.detail || {}))}</small></div>`).join('')}</div>` : '<p class="insight-empty">No audited actions yet.</p>';
  showModal('System audit log', html, [{ label: 'Close', variant: 'btn--ghost' }], { modalClass: 'modal--wide' });
}

async function handleResetStudentPin(studentId) {
  const students = dashboardSnapshot?.students || await getAllStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  const randomPin = String(Math.floor(1000 + Math.random() * 9000));
  const html = `
    <p style="margin-bottom: var(--space-4);">
      Reset the secret 4-digit PIN for <strong>${escapeHTML(student.name)}</strong> (Index: <code>${escapeHTML(student.indexNumber || '')}</code>).
    </p>
    <div class="input-group">
      <label for="reset-pin-input">New 4-Digit PIN</label>
      <input type="password" id="reset-pin-input" class="input input--pin" value="${randomPin}" maxlength="4" pattern="[0-9]{4}" inputmode="numeric" required>
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-1);">A random 4-digit PIN has been suggested, or you can enter a custom one.</p>
    </div>
  `;

  showModal(`Reset PIN: ${student.name}`, html, [
    { label: 'Cancel', variant: 'btn--ghost' },
    {
      label: 'Save PIN',
      variant: 'btn--primary',
      onClick: async () => {
        const pinVal = document.getElementById('reset-pin-input')?.value.trim();
        if (!pinVal || !/^\d{4}$/.test(pinVal)) {
          showToast('PIN must be exactly 4 digits.', 'error');
          return false;
        }

        await updateStudentPin(studentId, pinVal);
        showToast(`PIN for ${student.name} updated to ${pinVal}`, 'success');
        void refreshDashboardView('manual');
        return true;
      }
    }
  ]);
}

async function handleEditStudent(studentId) {
  const students = dashboardSnapshot?.students || await getAllStudents();
  const classes = dashboardSnapshot?.classes || await getAllClasses();
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  const html = `
    <form id="form-edit-student" style="display: flex; flex-direction: column; gap: var(--space-3);">
      <div class="input-group">
        <label for="edit-student-name">Full Name</label>
        <input type="text" id="edit-student-name" class="input" value="${escapeHTML(student.name)}" required>
      </div>
      <div class="input-group">
        <label for="edit-student-index">Index / Admission Number</label>
        <input type="text" id="edit-student-index" class="input" value="${escapeHTML(student.indexNumber || '')}" placeholder="e.g., GES-B7-0101">
      </div>
      <div class="input-group">
        <label for="edit-student-class">Assigned Class</label>
        <select id="edit-student-class" class="input">
          ${classes.map((c) => `
            <option value="${c.id}" ${c.id === student.classId ? 'selected' : ''}>${escapeHTML(c.name)}</option>
          `).join('')}
        </select>
      </div>
      <div class="input-group">
        <label for="edit-student-gender">Gender</label>
        <select id="edit-student-gender" class="input">
          <option value="Male" ${student.gender === 'Male' ? 'selected' : ''}>Male</option>
          <option value="Female" ${student.gender === 'Female' ? 'selected' : ''}>Female</option>
          <option value="Unspecified" ${student.gender === 'Unspecified' || !student.gender ? 'selected' : ''}>Unspecified</option>
        </select>
      </div>
      <div class="input-group">
        <label for="edit-student-status">Enrollment Status</label>
        <select id="edit-student-status" class="input">
          <option value="active" ${student.status === 'active' || !student.status ? 'selected' : ''}>Active</option>
          <option value="transferred" ${student.status === 'transferred' ? 'selected' : ''}>Transferred</option>
          <option value="graduated" ${student.status === 'graduated' ? 'selected' : ''}>Graduated</option>
        </select>
      </div>
    </form>
  `;

  showModal(`Edit Student: ${student.name}`, html, [
    { label: 'Cancel', variant: 'btn--ghost' },
    {
      label: 'Save Changes',
      variant: 'btn--primary',
      onClick: async () => {
        const name = document.getElementById('edit-student-name')?.value.trim();
        const indexNumber = document.getElementById('edit-student-index')?.value.trim();
        const classId = Number.parseInt(document.getElementById('edit-student-class')?.value, 10);
        const gender = document.getElementById('edit-student-gender')?.value;
        const status = document.getElementById('edit-student-status')?.value;

        if (!name) {
          showToast('Student name is required.', 'error');
          return false;
        }

        await updateStudent(studentId, {
          name,
          indexNumber: indexNumber || null,
          classId: classId || student.classId,
          gender,
          status
        });

        showToast('Student information updated.', 'success');
        void refreshDashboardView('manual');
        return true;
      }
    }
  ]);
}

async function showManageClassesModal() {
  const classes = await getAllClasses();
  const students = await getAllStudents();

  const classListHtml = classes.map((c) => {
    const count = students.filter((s) => s.classId === c.id).length;
    return `
      <div class="class-manage-item">
        <div class="class-manage-item__info">
          <div class="class-manage-item__title">${escapeHTML(c.name)}</div>
          <div class="class-manage-item__meta">${c.gradeLevel || 'B7'} · ${c.academicYear || '2026/2027'} · ${c.term || 'Term 1'} · Teacher: ${escapeHTML(c.teacherName || 'Not set')}</div>
        </div>
        <div>
          <span class="badge badge--primary">${count} learners</span>
        </div>
      </div>
    `;
  }).join('');

  const html = `
    <div style="margin-bottom: var(--space-4);">
      <h4 style="font-size: var(--font-size-sm); margin-bottom: var(--space-2); color: var(--text-secondary);">Active Classes</h4>
      <div class="class-manage-list">
        ${classListHtml || '<div class="insight-empty">No classes registered yet.</div>'}
      </div>
    </div>

    <div class="divider"></div>

    <form id="form-create-class" style="margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
      <h4 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary);">Create New Class</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
        <div class="input-group">
          <label for="new-class-grade">Grade Level</label>
          <select id="new-class-grade" class="input">
            <option value="B7">Basic 7 (JHS 1)</option>
            <option value="B8">Basic 8 (JHS 2)</option>
            <option value="B9">Basic 9 (JHS 3)</option>
          </select>
        </div>
        <div class="input-group">
          <label for="new-class-stream">Stream / Section</label>
          <input type="text" id="new-class-stream" class="input" placeholder="e.g., 1A or Gold" required>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
        <div class="input-group">
          <label for="new-class-year">Academic Year</label>
          <input type="text" id="new-class-year" class="input" value="2026/2027">
        </div>
        <div class="input-group">
          <label for="new-class-term">Term</label>
          <select id="new-class-term" class="input">
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>
      </div>
      <div class="input-group">
        <label for="new-class-teacher">Class Teacher Name</label>
        <input type="text" id="new-class-teacher" class="input" placeholder="e.g., Mr. Osei Prempeh">
      </div>
      <button type="submit" class="btn btn--primary" style="align-self: flex-start; margin-top: var(--space-2);">Create Class</button>
    </form>
  `;

  showModal('Manage School Classes', html, [{ label: 'Close', variant: 'btn--ghost' }]);

  const form = document.getElementById('form-create-class');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const grade = document.getElementById('new-class-grade')?.value || 'B7';
      const stream = document.getElementById('new-class-stream')?.value.trim() || 'A';
      const year = document.getElementById('new-class-year')?.value.trim() || '2026/2027';
      const term = document.getElementById('new-class-term')?.value || 'Term 1';
      const teacher = document.getElementById('new-class-teacher')?.value.trim() || 'Class Teacher';

      const newClass = await createClass({
        name: `${grade} — JHS ${stream}`,
        gradeLevel: grade,
        stream,
        academicYear: year,
        term,
        teacherName: teacher
      });

      showToast(`Class "${newClass.name}" created successfully!`, 'success');
      void refreshDashboardView('manual');
    });
  }
}

async function showImportRosterModal() {
  const classes = await getAllClasses();
  const students = await getAllStudents();

  const classOptions = classes.map((c) => `
    <option value="${c.id}">${escapeHTML(c.name)}</option>
  `).join('');

  const html = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-2);">
        <p class="dashboard-header__subtitle" style="margin: 0;">Upload a CSV file to bulk import multiple students in seconds.</p>
        <button type="button" class="btn btn--ghost btn--xs" id="btn-download-sample-csv">Download Sample CSV</button>
      </div>

      <div class="input-group" style="margin-bottom: var(--space-4);">
        <label for="import-default-class">Assign to Class (if unspecified in CSV)</label>
        <select id="import-default-class" class="input">
          ${classOptions}
        </select>
      </div>

      <div class="import-dropzone" id="import-dropzone">
        <div class="import-dropzone__icon">📄</div>
        <div class="import-dropzone__title">Click or drag & drop student CSV roster here</div>
        <div class="import-dropzone__subtitle">Supports UTF-8 CSV with Index Number, Full Name, Class, Gender, PIN</div>
        <input type="file" id="import-file-input" accept=".csv,.txt" style="display: none;">
      </div>

      <div id="import-preview-area" style="display: none;">
        <div class="import-summary-bar" id="import-summary-bar"></div>
        <div class="import-preview-wrap">
          <table class="student-table" style="font-size: var(--font-size-xs);">
            <thead>
              <tr>
                <th>Row</th>
                <th>Index #</th>
                <th>Full Name</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Assigned PIN</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="import-preview-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  let parsedResult = null;

  showModal('Bulk Import Student Roster', html, [
    { label: 'Cancel', variant: 'btn--ghost' },
    {
      label: 'Commit & Import Roster',
      variant: 'btn--primary',
      onClick: async () => {
        if (!parsedResult || !parsedResult.validRecords.length) {
          showToast('Please choose a valid CSV file first.', 'error');
          return false;
        }

        const commitResult = await bulkCreateStudents(parsedResult.validRecords);
        showToast(
          `Import complete! Created ${commitResult.created.length} new student(s) and updated ${commitResult.updated.length}.`,
          'success'
        );
        void refreshDashboardView('manual');
        return true;
      }
    }
  ], { modalClass: 'modal--wide' });

  document.getElementById('btn-download-sample-csv')?.addEventListener('click', () => {
    downloadSampleRosterCSV();
    showToast('Sample roster CSV downloaded.', 'info');
  });

  const dropzone = document.getElementById('import-dropzone');
  const fileInput = document.getElementById('import-file-input');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('import-dropzone--active');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('import-dropzone--active'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('import-dropzone--active');
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    });
  }

  function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;

      const targetClassId = Number.parseInt(document.getElementById('import-default-class')?.value, 10) || null;
      parsedResult = parseRosterCSV(text, classes, students, targetClassId);
      renderPreview(parsedResult);
    };
    reader.readAsText(file);
  }

  function renderPreview(result) {
    const previewArea = document.getElementById('import-preview-area');
    const summaryBar = document.getElementById('import-summary-bar');
    const tbody = document.getElementById('import-preview-body');

    if (!result.success) {
      showToast(result.error || 'Unable to parse CSV file.', 'error');
      return;
    }

    previewArea.style.display = 'block';
    summaryBar.innerHTML = `
      <div><strong>Total rows:</strong> ${result.summary.totalRows}</div>
      <div style="color: var(--color-success-400);"><strong>New learners:</strong> ${result.summary.newCount}</div>
      <div style="color: var(--color-accent-400);"><strong>Updates:</strong> ${result.summary.updateCount}</div>
      <div style="color: var(--color-warning-400);"><strong>Auto-PINs:</strong> ${result.summary.autoPinsGenerated}</div>
      ${result.summary.errorCount ? `<div style="color: var(--color-danger-400);"><strong>Errors skipped:</strong> ${result.summary.errorCount}</div>` : ''}
    `;

    tbody.innerHTML = result.validRecords.map((r) => `
      <tr>
        <td>${r.rowNumber}</td>
        <td><code>${escapeHTML(r.indexNumber || 'Auto')}</code></td>
        <td style="font-weight: var(--font-weight-semibold);">${escapeHTML(r.name)}</td>
        <td>${escapeHTML(r.className)}</td>
        <td>${r.gender}</td>
        <td><span style="font-family: monospace; font-weight: bold;">${r.pin}</span> ${r.pinGenerated ? '<small style="color: var(--color-warning-400);">(auto)</small>' : ''}</td>
        <td><span class="badge badge--${r.isUpdate ? 'warning' : 'success'}">${r.isUpdate ? 'Update' : 'Create'}</span></td>
      </tr>
    `).join('');
  }
}

async function showPrintLoginSlipsModal() {
  const classes = await getAllClasses();
  const students = await getAllStudents();
  const initialClassId = selectedClassId !== 'all' ? Number.parseInt(selectedClassId, 10) : classes[0]?.id;

  const html = `
    <div class="no-print" style="margin-bottom: var(--space-4);">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <label for="print-class-select" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);">Filter Class:</label>
          <select id="print-class-select" class="input input--sm">
            <option value="all">All Classes (${students.length} students)</option>
            ${classes.map((c) => `
              <option value="${c.id}" ${c.id === initialClassId ? 'selected' : ''}>
                ${escapeHTML(c.name)} (${students.filter((s) => s.classId === c.id).length} students)
              </option>
            `).join('')}
          </select>
        </div>
        <button type="button" class="btn btn--primary btn--sm" id="btn-trigger-print">🖨️ Print All Cards</button>
      </div>
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">
        Formatted for standard A4 printing (8 cards per page). Cut and distribute to learners for secure lab logins.
      </p>
    </div>

    <div class="print-slips-modal-content">
      <div class="print-slips-container" id="slips-container">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  showModal('Print Student Login Slips', html, [{ label: 'Close', variant: 'btn--ghost' }], { modalClass: 'modal--wide' });

  const container = document.getElementById('slips-container');
  const classSelect = document.getElementById('print-class-select');
  const printBtn = document.getElementById('btn-trigger-print');

  function renderSlips(targetId) {
    const list = targetId === 'all'
      ? students
      : students.filter((s) => String(s.classId) === String(targetId));

    if (!list.length) {
      container.innerHTML = '<div class="insight-empty no-print">No students found in this class.</div>';
      return;
    }

    container.innerHTML = list.map((student) => {
      const cls = classes.find((c) => c.id === student.classId);
      const className = cls ? cls.name : 'JHS Computing';
      return `
        <div class="slip-card">
          <div class="slip-card__header">
            <div class="slip-card__school">ClassConnect — Lab Pass</div>
            <div class="slip-card__app">GES CCP B7</div>
          </div>
          <div class="slip-card__name">${escapeHTML(student.name)}</div>
          <div class="slip-card__meta">
            <span><strong>Index:</strong> ${escapeHTML(student.indexNumber || `GES-B7-${student.id}`)}</span>
            <span><strong>Class:</strong> ${escapeHTML(className)}</span>
          </div>
          <div class="slip-card__pin-box">
            <span class="slip-card__pin-label">Your 4-Digit Login PIN:</span>
            <span class="slip-card__pin-value">${student.pin}</span>
          </div>
          <div class="slip-card__footer">
            Keep this PIN secret. Login at http://localhost:5173/student-login
          </div>
        </div>
      `;
    }).join('');
  }

  renderSlips(initialClassId);

  classSelect?.addEventListener('change', (e) => {
    renderSlips(e.target.value);
  });

  printBtn?.addEventListener('click', () => {
    window.print();
  });
}

async function showStudentDetailModal(studentId) {
  const students = dashboardSnapshot?.students || await getAllStudents();
  const classes = dashboardSnapshot?.classes || await getAllClasses();
  const results = dashboardSnapshot?.results || await getAllQuizResults();
  const progressRecords = dashboardSnapshot?.progressRecords || await getAllProgress();
  const diagnostics = dashboardSnapshot?.diagnostics || await getAllDiagnostics();

  const student = students.find((entry) => entry.id === studentId);
  if (!student) return;

  const studentClass = classes.find((c) => c.id === student.classId);
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

  const initials = student.name.slice(0, 2).toUpperCase();
  const html = `
    <div class="student-detail">
      <div class="student-detail__header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3);">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <div class="student-detail__avatar">${initials}</div>
          <div>
            <div class="student-detail__name">${escapeHTML(student.name)}</div>
            <div class="dashboard-header__subtitle">
              Index: <code>${escapeHTML(student.indexNumber || `GES-B7-${student.id}`)}</code> · Class: <strong>${escapeHTML(studentClass ? studentClass.name : 'General')}</strong> · Gender: ${escapeHTML(student.gender || 'Unspecified')}
            </div>
            <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
              <button class="btn btn--primary btn--xs" id="btn-modal-report-card">Terminal Report Card</button>
              <button class="btn btn--secondary btn--xs" id="btn-modal-reset-pin">Reset PIN</button>
              <button class="btn btn--ghost btn--xs" id="btn-modal-edit-student">Edit / Transfer</button>
            </div>
          </div>
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
        <h4 class="student-detail__history-title">Question Breakdown (Latest Quiz)</h4>
        <div class="student-detail__table-wrap">
          <table class="student-detail__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Concept</th>
                <th>Result</th>
                <th>Time</th>
                <th>Ability (theta)</th>
              </tr>
            </thead>
            <tbody>
              ${latest && latest.responses ? latest.responses.map((attempt, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${escapeHTML(attempt.concept || 'General')}</td>
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

  document.getElementById('btn-modal-report-card')?.addEventListener('click', () => {
    document.querySelector('.modal-backdrop')?.remove();
    if (activeDashboardNavigate) {
      activeDashboardNavigate(`/report-card/${studentId}`);
    }
  });

  document.getElementById('btn-modal-reset-pin')?.addEventListener('click', () => {
    void handleResetStudentPin(studentId);
  });

  document.getElementById('btn-modal-edit-student')?.addEventListener('click', () => {
    void handleEditStudent(studentId);
  });

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
