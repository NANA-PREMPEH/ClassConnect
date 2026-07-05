/**
 * ClassConnect - Student Assessment Center
 * Lists published assessments and access to prior results.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import {
  getAllAssessments,
  getAssessmentSubmissionsForStudent,
  getCurrentStudent
} from '../engine/storage.js';

export async function renderAssessmentCenter() {
  const student = getCurrentStudent();
  const assessments = (await getAllAssessments())
    .filter((assessment) => assessment.published !== false)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  const submissions = student ? await getAssessmentSubmissionsForStudent(student.id) : [];

  return `
    ${renderNav({ title: 'Assessment Center', showBack: true, studentName: student?.name })}
    <div class="container container--narrow view-enter assessment-center-page" style="padding-top: var(--space-6);">
      <div class="card card--glass assessment-hero">
        <div class="assessment-hero__eyebrow">Secure assessment workspace</div>
        <h1 class="assessment-hero__title">Take published assessments and review your feedback</h1>
        <p class="assessment-hero__text">Open-ended responses are graded against rubrics, browser anomalies are logged locally, and every submission gets an integrity review plus a remediation plan.</p>
      </div>

      <div class="assessment-student-list">
        ${assessments.length > 0 ? assessments.map((assessment) => {
          const latestSubmission = submissions
            .filter((submission) => submission.assessmentId === assessment.id)
            .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt))[0];
          const questionCount = assessment.questions.length;

          return `
            <div class="card assessment-student-card">
              <div class="assessment-student-card__header">
                <div>
                  <div class="assessment-admin-card__eyebrow">${assessment.generatedBy === 'ai' ? 'AI blueprint' : 'Objective blueprint'}</div>
                  <h2 class="assessment-student-card__title">${assessment.title}</h2>
                  <p class="assessment-student-card__meta">${assessment.durationMinutes} min | ${questionCount} questions | ${assessment.objectiveCoverage.length} objectives</p>
                </div>
                ${latestSubmission
                  ? `<span class="badge badge--${latestSubmission.integrity?.label === 'High' ? 'warning' : 'success'}">${latestSubmission.grading?.percentage || 0}% latest</span>`
                  : '<span class="badge badge--neutral">Not taken yet</span>'}
              </div>

              <div class="assessment-student-card__actions">
                <button class="btn btn--primary btn--sm btn-start-assessment" data-assessment-id="${assessment.id}">
                  ${latestSubmission ? 'Retake Assessment' : 'Start Assessment'}
                </button>
                ${latestSubmission ? `
                  <button class="btn btn--ghost btn--sm btn-view-assessment-result" data-submission-id="${latestSubmission.id}">
                    Review Latest Result
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('') : `
          <div class="empty-state">
            <div class="empty-state__icon">Assess</div>
            <h2 class="empty-state__title">No Published Assessments</h2>
            <p class="empty-state__text">Your teacher has not published an assessment on this device yet.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

export function bindAssessmentCenterEvents(navigate) {
  bindNavEvents({ onBack: () => navigate('/lessons') });

  document.querySelectorAll('.btn-start-assessment').forEach((button) => {
    button.addEventListener('click', (event) => {
      const assessmentId = Number.parseInt(event.currentTarget.dataset.assessmentId, 10);
      navigate(`/assessment/${assessmentId}`);
    });
  });

  document.querySelectorAll('.btn-view-assessment-result').forEach((button) => {
    button.addEventListener('click', (event) => {
      const submissionId = Number.parseInt(event.currentTarget.dataset.submissionId, 10);
      navigate(`/assessment-results/${submissionId}`);
    });
  });
}
