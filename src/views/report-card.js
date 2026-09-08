/**
 * ClassConnect - Printable Terminal Report Card View
 * Official Ghana Education Service (GES) format terminal report card with
 * continuous assessment (SBA), BECE 9-point scale, and single-page A4 print optimization.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import {
  getAllClasses,
  getAllStudents,
  getAllQuizResults,
  getAllProgress,
  getAllDiagnostics,
  getAllAssessmentSubmissions
} from '../engine/storage.js';
import { buildStudentReportCardData } from '../engine/gradebook.js';

let activeStudentId = null;

function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function renderReportCard(paramStudentId = null) {
  const [classes, students, results, progress, diagnostics, submissions] = await Promise.all([
    getAllClasses(),
    getAllStudents(),
    getAllQuizResults(),
    getAllProgress(),
    getAllDiagnostics(),
    getAllAssessmentSubmissions()
  ]);

  activeStudentId = paramStudentId ? Number.parseInt(paramStudentId, 10) : students[0]?.id;
  const targetStudent = students.find((s) => s.id === activeStudentId) || students[0];

  if (!targetStudent) {
    return `
      ${renderNav({ title: 'Terminal Report Card', showBack: true })}
      <div class="container view-enter" style="padding-top: var(--space-12); text-align: center;">
        <h2>No Student Learning Records Found</h2>
        <p class="text-secondary">Please add students or record quiz completions first.</p>
      </div>
    `;
  }

  const reportData = buildStudentReportCardData(targetStudent.id, {
    classes,
    students,
    results,
    progress,
    diagnostics,
    submissions
  });

  if (!reportData) {
    return `
      ${renderNav({ title: 'Terminal Report Card', showBack: true })}
      <div class="container view-enter" style="padding-top: var(--space-12); text-align: center;">
        <h2>Unable to Generate Report Card</h2>
        <p class="text-secondary">Could not assemble academic data for this learner.</p>
      </div>
    `;
  }

  const {
    student,
    studentClass,
    studentData,
    classTotalStudents,
    classAverage,
    strands,
    attendance,
    conduct,
    headmasterRemark
  } = reportData;

  return `
    ${renderNav({ title: 'Student Terminal Report', showBack: true })}
    <div class="container view-enter report-card-page" style="padding-top: var(--space-6);">

      <!-- Top Action Bar (hidden on print) -->
      <div class="report-card-nav-bar no-print">
        <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
          <label for="report-student-select" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);">Select Student:</label>
          <select id="report-student-select" class="select-class">
            ${students.map((s) => `
              <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>
                ${escapeHTML(s.name)} (${escapeHTML(s.indexNumber || `GES-B7-${s.id}`)})
              </option>
            `).join('')}
          </select>
        </div>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn btn--secondary btn--sm" id="btn-back-gradebook">Back to Broadsheet</button>
          <button class="btn btn--primary btn--sm" id="btn-print-report-card">🖨️ Print Terminal Report</button>
        </div>
      </div>

      <!-- Printable Report Document Sheet -->
      <div class="report-card-print-area">
        <div class="report-sheet">
          
          <!-- Header -->
          <div class="report-header">
            <div class="report-header__flag-strip"></div>
            <div class="report-header__republic">Republic of Ghana · Ministry of Education · GES</div>
            <h1 class="report-header__title">ClassConnect Demonstration JHS</h1>
            <div class="report-header__subtitle">Basic Education Certificate Continuous Assessment Terminal Report</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
              Academic Year: <strong>${escapeHTML(studentClass.academicYear || '2026/2027')}</strong> · Term: <strong>${escapeHTML(studentClass.term || 'Term 1')}</strong>
            </div>
          </div>

          <!-- Student Profile Grid -->
          <div class="report-meta-grid">
            <div class="report-meta-item">
              <span class="report-meta-label">Pupil Name</span>
              <span class="report-meta-value">${escapeHTML(student.name)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Student Index No.</span>
              <span class="report-meta-value">${escapeHTML(student.indexNumber || `GES-B7-${student.id}`)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class & Stream</span>
              <span class="report-meta-value">${escapeHTML(studentClass.name)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Terminal Attendance</span>
              <span class="report-meta-value">${attendance.daysPresent} / ${attendance.totalDays} Days</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class Position / Rank</span>
              <span class="report-meta-value" style="color: #4338ca;">${studentData.rankOrdinal} of ${classTotalStudents}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class Average Score</span>
              <span class="report-meta-value">${classAverage}%</span>
            </div>
          </div>

          <!-- Academic Performance Table -->
          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">#</th>
                <th>Curriculum Strand / Subject Module</th>
                <th style="width: 85px; text-align: center;">Quiz Score</th>
                <th style="width: 85px; text-align: center;">Exam Mark</th>
                <th style="width: 90px; text-align: center;">Weighted %</th>
                <th>Teacher Competency Assessment</th>
              </tr>
            </thead>
            <tbody>
              ${strands.map((strand) => {
                const quizScore = strand.score !== null ? `${strand.score}%` : 'Pending';
                const examScore = studentData.examRaw !== null ? `${studentData.examRaw}%` : 'Pending';
                const weighted = strand.score !== null
                  ? `${Math.round(strand.score * 0.4 + (studentData.examRaw || 0) * 0.6)}%`
                  : '—';

                return `
                  <tr>
                    <td style="text-align: center; font-weight: bold;">${strand.id}</td>
                    <td>
                      <strong>${escapeHTML(strand.title)}</strong>
                      <div style="font-size: 10px; color: #64748b;">${escapeHTML(strand.strand)}</div>
                    </td>
                    <td style="text-align: center; font-weight: 600;">${quizScore}</td>
                    <td style="text-align: center; font-weight: 600;">${examScore}</td>
                    <td style="text-align: center; font-weight: 700; color: #1e1b4b;">${weighted}</td>
                    <td style="font-size: 11px; color: #334155;">${escapeHTML(strand.remark)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <!-- Summary Score Ribbon -->
          <div class="report-summary-ribbon">
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Continuous SBA (30%)</span>
              <span class="report-summary-ribbon__value">${studentData.weightedSBA}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Terminal Exam (50%)</span>
              <span class="report-summary-ribbon__value">${studentData.weightedExam}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Overall Composite %</span>
              <span class="report-summary-ribbon__value" style="color: #15803d;">${studentData.totalPercentage}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Official BECE Grade</span>
              <span class="report-summary-ribbon__value" style="color: #4338ca;">
                ${studentData.bece.label} (${studentData.bece.letter})
              </span>
            </div>
          </div>

          <!-- Remarks & Recommendations -->
          <div class="report-remarks-box">
            <div class="report-remarks-title">Class Teacher's Appraisal & General Conduct</div>
            <div style="font-size: 12px; color: #1e293b; margin-bottom: 8px;">
              ${escapeHTML(conduct)} ${escapeHTML(studentData.bece.remark)}
            </div>
          </div>

          <div class="report-remarks-box">
            <div class="report-remarks-title">Headmaster / Principal's Terminal Remark</div>
            <div style="font-size: 12px; color: #1e293b;">
              ${escapeHTML(headmasterRemark)}
            </div>
          </div>

          <!-- Signature Blocks -->
          <div class="report-signatures-grid">
            <div>
              <div class="report-sig-line">
                <strong>${escapeHTML(studentClass.teacherName || 'Class Teacher')}</strong><br>
                Class Teacher Signature & Date
              </div>
            </div>
            <div>
              <div class="report-sig-line">
                <strong>Headmaster / School Authority</strong><br>
                Official School Stamp & Signature
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
}

export function bindReportCardEvents(navigate, studentId) {
  bindNavEvents({
    onBack: () => navigate('/gradebook')
  });

  const selectStudent = document.getElementById('report-student-select');
  if (selectStudent) {
    selectStudent.addEventListener('change', (e) => {
      navigate(`/report-card/${e.target.value}`);
    });
  }

  const btnBack = document.getElementById('btn-back-gradebook');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      navigate('/gradebook');
    });
  }

  const btnPrint = document.getElementById('btn-print-report-card');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }
}
