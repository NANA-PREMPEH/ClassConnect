/**
 * ClassConnect — Teacher Dashboard View
 * Analytics dashboard showing student performance and misconceptions.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderStatCard } from '../components/stat-card.js';
import { showModal, showToast } from '../components/ui.js';
import {
  clearTeacherAuthenticated,
  downloadCSV,
  exportAllDataAsCSV,
  getAllProgress,
  getAllQuizResults,
  getAllStudents,
  getApiKey,
  getTeacherPin,
  setApiKeyAsync,
  setTeacherPinAsync
} from '../engine/storage.js';
import { lessons } from '../data/lessons.js';

let dashboardSnapshot = null;
let dashboardCharts = [];

function formatDuration(ms = 0) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
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

function buildDashboardSnapshot(students, results, progressRecords) {
  const latestResults = getLatestResults(results);
  const completionRate = students.length > 0
    ? Math.round((progressRecords.length / (students.length * lessons.length)) * 100)
    : 0;
  const averageScore = latestResults.length > 0
    ? Math.round((latestResults.reduce((sum, result) => sum + (result.score / result.totalQuestions), 0) / latestResults.length) * 100)
    : 0;
  const studentsAtRisk = latestResults.filter((result) => result.theta < -0.5).length;

  const scoresByLesson = {};
  const countsByLesson = {};
  for (const result of results) {
    scoresByLesson[result.lessonId] = (scoresByLesson[result.lessonId] || 0) + (result.score / result.totalQuestions);
    countsByLesson[result.lessonId] = (countsByLesson[result.lessonId] || 0) + 1;
  }

  const lessonScoreData = lessons.map((lesson) => (
    countsByLesson[lesson.id]
      ? Math.round((scoresByLesson[lesson.id] / countsByLesson[lesson.id]) * 100)
      : 0
  ));

  const levelCounts = { Advanced: 0, Proficient: 0, Developing: 0, Beginner: 0 };
  for (const result of latestResults) {
    if (levelCounts[result.level] !== undefined) {
      levelCounts[result.level] += 1;
    }
  }

  const misconceptionCounts = {};
  for (const result of results) {
    for (const response of result.responses) {
      if (response.correct) continue;
      const key = `${response.questionId}|${response.stem}|${response.options[response.selectedIndex]}`;
      misconceptionCounts[key] = (misconceptionCounts[key] || 0) + 1;
    }
  }

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

  return {
    students,
    results,
    progressRecords,
    latestResults,
    summary: {
      totalStudents: students.length,
      averageScore,
      completionRate,
      studentsAtRisk
    },
    charts: {
      lessonLabels: lessons.map((lesson) => `Lesson ${lesson.id}`),
      lessonScoreData,
      levelCounts,
      misconceptions
    }
  };
}

export async function renderDashboard() {
  const students = await getAllStudents();
  const results = await getAllQuizResults();
  const progressRecords = await getAllProgress();
  dashboardSnapshot = buildDashboardSnapshot(students, results, progressRecords);

  if (students.length === 0) {
    return `
      ${renderNav({ title: 'Teacher Dashboard', showBack: true, showSettings: true, showLogout: true })}
      <div class="container view-enter dashboard-page" style="padding-top: var(--space-8);">
        <div class="empty-state">
          <div class="empty-state__icon">Data</div>
          <h2 class="empty-state__title">No Data Yet</h2>
          <p class="empty-state__text">Students need to log in and take quizzes before analytics will appear here.</p>
        </div>
      </div>
    `;
  }

  const { summary } = dashboardSnapshot;

  return `
    ${renderNav({ title: 'Teacher Dashboard', showBack: true, showSettings: true, showLogout: true })}
    <div class="container view-enter dashboard-page" style="padding-top: var(--space-6);">
      <div class="dashboard-header">
        <h1 class="dashboard-header__title">Class Overview</h1>
        <p class="dashboard-header__subtitle">Analytics based on learning data stored on this device.</p>
      </div>

      <div class="stat-grid">
        ${renderStatCard('Students', summary.totalStudents, 'Total Students', 'primary', `${dashboardSnapshot.results.length} quizzes recorded`)}
        ${renderStatCard('Average', `${summary.averageScore}%`, 'Average Score', 'accent', 'Latest quiz per student')}
        ${renderStatCard('Progress', `${summary.completionRate}%`, 'Completion Rate', 'success', `${dashboardSnapshot.progressRecords.length} lesson completions logged`)}
        ${renderStatCard('Support', summary.studentsAtRisk, 'Students At Risk', summary.studentsAtRisk > 0 ? 'danger' : 'success', 'Theta below -0.5')}
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

      <div class="student-section">
        <div class="student-section__header">
          <div>
            <h3 class="student-section__title">Student Roster</h3>
            <p class="dashboard-header__subtitle">Tap a student row to open quiz history, theta trajectory, and per-question performance.</p>
          </div>
          <div class="export-area" style="margin-top: 0;">
            <button class="btn btn--ghost btn--sm" id="btn-export-csv">Export CSV</button>
          </div>
        </div>

        <div class="student-table-wrap">
          <table class="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Lessons Completed</th>
                <th>Quizzes Taken</th>
                <th>Latest Score</th>
                <th>Latest Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${students.map((student) => {
                const studentResults = results
                  .filter((result) => result.studentId === student.id)
                  .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
                const latest = studentResults[0];
                const lessonsCompleted = progressRecords.filter((record) => record.studentId === student.id).length;
                let status = 'No Data';
                let statusBadge = 'neutral';

                if (latest) {
                  if (latest.theta < -0.5) {
                    status = 'At Risk';
                    statusBadge = 'danger';
                  } else if (latest.theta < 0.5) {
                    status = 'Needs Help';
                    statusBadge = 'warning';
                  } else {
                    status = 'On Track';
                    statusBadge = 'success';
                  }
                }

                return `
                  <tr class="student-row" data-id="${student.id}">
                    <td class="student-table__name">${student.name}</td>
                    <td>${lessonsCompleted}/${lessons.length}</td>
                    <td>${studentResults.length}</td>
                    <td class="student-table__score">${latest ? `${Math.round((latest.score / latest.totalQuestions) * 100)}%` : '-'}</td>
                    <td>${latest ? latest.level : '-'}</td>
                    <td><span class="badge badge--${statusBadge}">${status}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function bindDashboardEvents(navigate) {
  bindNavEvents({
    onBack: () => navigate('/'),
    onSettings: showSettingsModal,
    onLogout: () => {
      clearTeacherAuthenticated();
      navigate('/');
    }
  });

  const exportBtn = document.getElementById('btn-export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      const csv = await exportAllDataAsCSV();
      downloadCSV(csv);
      showToast('Data exported successfully', 'success');
    });
  }

  if (window.Chart) {
    renderCharts();
  } else {
    const script = document.getElementById('chartjs-script');
    if (script) {
      script.addEventListener('load', renderCharts, { once: true });
    }
  }

  document.querySelectorAll('.student-row').forEach((row) => {
    row.addEventListener('click', (event) => {
      const id = Number.parseInt(event.currentTarget.dataset.id, 10);
      showStudentDetailModal(id);
    });
  });
}

function showSettingsModal() {
  const currentKey = getApiKey() || '';
  const currentPin = getTeacherPin() || '';
  const html = `
    <div class="input-group" style="margin-bottom: var(--space-4);">
      <label>Google Gemini API Key</label>
      <input type="password" id="settings-api-key" class="input" value="${currentKey}" placeholder="AIzaSy...">
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">Required for personalized AI feedback. You can update this any time.</p>
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

  const student = students.find((entry) => entry.id === studentId);
  const studentResults = results
    .filter((result) => result.studentId === studentId)
    .sort((left, right) => new Date(left.completedAt) - new Date(right.completedAt));
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
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">Lesson ${result.lessonId}: ${lessons.find((lesson) => lesson.id === result.lessonId)?.title || 'Unknown'}</div>
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
                    <div class="student-detail__question-sub">${attempt.options[attempt.selectedIndex]} ${attempt.correct ? '' : `→ ${attempt.options[attempt.correctIndex]}`}</div>
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

  if (window.Chart && studentResults.length > 0) {
    setTimeout(() => renderStudentThetaChart(studentResults), 0);
  }
}

function destroyCharts() {
  dashboardCharts.forEach((chart) => chart.destroy());
  dashboardCharts = [];
}

function renderCharts() {
  if (!window.Chart || !dashboardSnapshot) return;
  destroyCharts();

  const { Chart } = window;
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
                return `${context.raw} misses — common wrong answer: ${item.answer}`;
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

function renderStudentThetaChart(studentResults) {
  const canvas = document.getElementById('student-theta-chart');
  if (!canvas || !window.Chart) return;

  const { Chart } = window;
  const labels = studentResults.map((result) => `L${result.lessonId}`);
  const thetaValues = studentResults.map((result) => result.theta);

  new Chart(canvas, {
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
