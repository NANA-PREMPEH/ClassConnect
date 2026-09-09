/**
 * ClassConnect - Master Broadsheet Gradebook View
 * Visualizes continuous assessment, exam weighting, BECE 9-point grades,
 * and class rankings in a comprehensive tabular grid.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderStaffShell, bindStaffShell } from '../components/staff-shell.js';
import {
  getAllClasses,
  getAllStudents,
  getAllQuizResults,
  getAllProgress,
  getAllDiagnostics,
  getAllAssessmentSubmissions,
  downloadCSV,
  getStaffClassContext,
  setStaffClassContext
} from '../engine/storage.js';
import {
  buildClassBroadsheet,
  exportBroadsheetAsCSV,
  DEFAULT_GRADEBOOK_WEIGHTS
} from '../engine/gradebook.js';
import { showModal, showToast } from '../components/ui.js';

let currentClassId = 'all';
let currentWeights = { ...DEFAULT_GRADEBOOK_WEIGHTS };
let cachedBroadsheet = null;

function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function renderGradebook() {
  const [classes, students, results, progress, diagnostics, submissions] = await Promise.all([
    getAllClasses(),
    getAllStudents(),
    getAllQuizResults(),
    getAllProgress(),
    getAllDiagnostics(),
    getAllAssessmentSubmissions()
  ]);
  const context = getStaffClassContext();
  if (currentClassId === 'all' && context.selectedClassId !== 'all') currentClassId = context.selectedClassId;

  cachedBroadsheet = buildClassBroadsheet(currentClassId, {
    classes,
    students,
    results,
    progress,
    diagnostics,
    submissions,
    weights: currentWeights
  });

  const { classInfo, statistics, weights, lessons: lessonList, students: rankedStudents } = cachedBroadsheet;

  const content = `
    <div class="gradebook-page">
      
      <div class="gradebook-header">
        <div>
          <h1 class="gradebook-header__title">${escapeHTML(classInfo.name)} — Continuous Assessment</h1>
          <p class="dashboard-header__subtitle">
            GES Standard 9-Point Grading & Weighted Terminal Broadsheet · Academic Year ${escapeHTML(classInfo.academicYear || '2026/2027')}
          </p>
        </div>
        <div class="gradebook-header__actions">
          <select id="gradebook-class-select" class="select-class">
            <option value="all" ${currentClassId === 'all' ? 'selected' : ''}>All Classes (${students.length} students)</option>
            ${classes.map((c) => `
              <option value="${c.id}" ${String(currentClassId) === String(c.id) ? 'selected' : ''}>
                ${escapeHTML(c.name)} (${students.filter((s) => s.classId === c.id).length})
              </option>
            `).join('')}
          </select>
          <select id="gradebook-term-select" class="input input--sm" aria-label="Academic term"><option>Current term</option><option>Term 1</option><option>Term 2</option><option>Term 3</option></select>
          <select id="gradebook-subject-select" class="input input--sm" aria-label="Subject"><option>Computing</option></select>
          <button class="btn btn--ghost btn--sm" id="btn-configure-weights">Weighting</button>
          <button class="btn btn--ghost btn--sm" id="btn-print-gradebook">Print</button>
          <button class="btn btn--secondary btn--sm" id="btn-export-broadsheet-csv">📥 Export Broadsheet (CSV)</button>
        </div>
      </div>

      <!-- Weights Configuration Panel -->
      <div class="weights-panel">
        <div>
          <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); margin-bottom: 2px;">
            Assessment Weighting Scheme
          </div>
          <div style="font-size: var(--font-size-xs); color: var(--text-muted);">
            Formula: SBA Quizzes + Diagnostic Baseline + Terminal Examination = 100%
          </div>
        </div>
        <div class="weights-form">
          <div class="weight-input-group">
            <label for="weight-sba">SBA (Quizzes):</label>
            <input type="number" id="weight-sba" class="input input--sm weight-input" value="${weights.sbaPercent}" min="0" max="100">%
          </div>
          <div class="weight-input-group">
            <label for="weight-diag">Diagnostic:</label>
            <input type="number" id="weight-diag" class="input input--sm weight-input" value="${weights.diagnosticPercent}" min="0" max="100">%
          </div>
          <div class="weight-input-group">
            <label for="weight-exam">Exam:</label>
            <input type="number" id="weight-exam" class="input input--sm weight-input" value="${weights.examPercent}" min="0" max="100">%
          </div>
          <button class="btn btn--ghost btn--xs" id="btn-apply-weights">Apply Weights</button>
        </div>
      </div>

      <!-- Broadsheet Summary Bar -->
      <div class="broadsheet-stats-bar">
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value">${statistics.totalStudents}</div>
          <div class="broadsheet-stat-card__label">Enrolled Learners</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value">${statistics.classAverage}%</div>
          <div class="broadsheet-stat-card__label">Class Average</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value" style="color: var(--color-success-400);">${statistics.highestScore}%</div>
          <div class="broadsheet-stat-card__label">Highest Mark</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value" style="color: var(--color-accent-400);">${statistics.gradeDistribution[1] + statistics.gradeDistribution[2]}</div>
          <div class="broadsheet-stat-card__label">Grade 1 & 2 Passes</div>
        </div>
      </div>

      <!-- Master Broadsheet Grid -->
      <div class="broadsheet-table-wrap">
        <table class="broadsheet-table">
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">Rank</th>
              <th>Index #</th>
              <th>Student Name</th>
              ${lessonList.map((l) => `<th style="text-align: center;">L${l.id}<br><small style="font-weight: normal; opacity: 0.7;">Quiz</small></th>`).join('')}
              <th style="text-align: center; background: rgba(99, 102, 241, 0.08);">SBA Raw<br><small style="opacity: 0.8;">(${weights.sbaPercent}%)</small></th>
              <th style="text-align: center; background: rgba(56, 189, 248, 0.08);">Diag<br><small style="opacity: 0.8;">(${weights.diagnosticPercent}%)</small></th>
              <th style="text-align: center; background: rgba(245, 158, 11, 0.08);">Exam<br><small style="opacity: 0.8;">(${weights.examPercent}%)</small></th>
              <th style="text-align: center; background: rgba(16, 185, 129, 0.1);">Total Mark<br><small style="opacity: 0.8;">(100%)</small></th>
              <th style="text-align: center;">BECE Grade</th>
              <th style="text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rankedStudents.length > 0 ? rankedStudents.map((s) => {
              let medalClass = 'rank-badge--other';
              if (s.rankNumber === 1) medalClass = 'rank-badge--1';
              else if (s.rankNumber === 2) medalClass = 'rank-badge--2';
              else if (s.rankNumber === 3) medalClass = 'rank-badge--3';

              return `
                <tr>
                  <td style="text-align: center;">
                    <span class="rank-badge ${medalClass}">${s.rankNumber}</span>
                  </td>
                  <td><code>${escapeHTML(s.student.indexNumber || `GES-B7-${s.student.id}`)}</code></td>
                  <td style="font-weight: var(--font-weight-semibold);">${escapeHTML(s.student.name)}</td>
                  ${lessonList.map((l) => {
                    const score = s.lessonScores[l.id];
                    return `<td style="text-align: center; color: ${score !== null ? 'var(--text-primary)' : 'var(--text-muted)'};">${score !== null ? `${score}%` : '—'}</td>`;
                  }).join('')}
                  <td style="text-align: center; font-weight: bold; background: rgba(99, 102, 241, 0.04);">${s.sbaRaw}%</td>
                  <td style="text-align: center; background: rgba(56, 189, 248, 0.04);">${s.diagnosticRaw}%</td>
                  <td style="text-align: center; font-weight: bold; background: rgba(245, 158, 11, 0.04);">${s.examRaw}%</td>
                  <td style="text-align: center; font-weight: var(--font-weight-extrabold); font-size: var(--font-size-sm); color: var(--color-success-400); background: rgba(16, 185, 129, 0.06);">${s.totalPercentage}%</td>
                  <td style="text-align: center;">
                    <span class="badge badge--${s.bece.tone}">${s.bece.label} (${s.bece.letter})</span>
                  </td>
                  <td style="text-align: center;">
                    <button class="btn btn--ghost btn--xs btn-view-report-card" data-student-id="${s.student.id}">
                      Report Card
                    </button>
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="${lessonList.length + 8}" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
                  No student records available for this class view.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

    </div>`;
  return renderStaffShell({ title: 'Gradebook & Reports', subtitle: 'GES-aligned terminal performance, weighting, ranking, exports, and report cards.', activePath: '/gradebook', content });
}

export function bindGradebookEvents(navigate) {
  bindStaffShell(navigate);

  const classSelect = document.getElementById('gradebook-class-select');
  if (classSelect) {
    classSelect.addEventListener('change', async (e) => {
      currentClassId = e.target.value;
      setStaffClassContext((await getAllClasses()), currentClassId);
      const html = await renderGradebook();
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = html;
        bindGradebookEvents(navigate);
      }
    });
  }

  const btnApplyWeights = document.getElementById('btn-apply-weights');
  if (btnApplyWeights) {
    btnApplyWeights.addEventListener('click', async () => {
      const sba = Number.parseInt(document.getElementById('weight-sba')?.value, 10) || 0;
      const diag = Number.parseInt(document.getElementById('weight-diag')?.value, 10) || 0;
      const exam = Number.parseInt(document.getElementById('weight-exam')?.value, 10) || 0;

      if (sba + diag + exam !== 100) {
        showToast(`Weights must sum to 100% (currently ${sba + diag + exam}%).`, 'error');
        return;
      }

      currentWeights = { sbaPercent: sba, diagnosticPercent: diag, examPercent: exam };
      showToast('Gradebook weighting updated.', 'success');

      const html = await renderGradebook();
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = html;
        bindGradebookEvents(navigate);
      }
    });
  }

  const btnExport = document.getElementById('btn-export-broadsheet-csv');
  document.getElementById('btn-print-gradebook')?.addEventListener('click', () => window.print());
  document.getElementById('btn-configure-weights')?.addEventListener('click', () => {
    showModal('Assessment weighting', `<div class="weights-form"><div class="weight-input-group"><label>SBA (Quizzes)</label><input type="number" id="modal-weight-sba" class="input" value="${currentWeights.sbaPercent}" min="0" max="100">%</div><div class="weight-input-group"><label>Diagnostic</label><input type="number" id="modal-weight-diagnostic" class="input" value="${currentWeights.diagnosticPercent}" min="0" max="100">%</div><div class="weight-input-group"><label>Terminal exam</label><input type="number" id="modal-weight-exam" class="input" value="${currentWeights.examPercent}" min="0" max="100">%</div></div>`, [{ label: 'Cancel', variant: 'btn--ghost' }, { label: 'Apply', variant: 'btn--primary', onClick: async () => { const sba = Number(document.getElementById('modal-weight-sba').value); const diagnostic = Number(document.getElementById('modal-weight-diagnostic').value); const exam = Number(document.getElementById('modal-weight-exam').value); if (sba + diagnostic + exam !== 100) { showToast('Weights must total 100%.', 'error'); return false; } currentWeights = { sbaPercent: sba, diagnosticPercent: diagnostic, examPercent: exam }; const html = await renderGradebook(); document.getElementById('app').innerHTML = html; bindGradebookEvents(navigate); return true; } }]);
  });
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      if (!cachedBroadsheet) return;
      const csv = exportBroadsheetAsCSV(cachedBroadsheet);
      const filename = `broadsheet_${cachedBroadsheet.classInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`;
      downloadCSV(csv, filename);
      showToast('Broadsheet exported successfully.', 'success');
    });
  }

  document.querySelectorAll('.btn-view-report-card').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.dataset.studentId;
      navigate(`/report-card/${studentId}`);
    });
  });
}
