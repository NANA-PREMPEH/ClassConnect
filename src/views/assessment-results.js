/**
 * ClassConnect - Assessment Results View
 * Shows grading, integrity review, proctoring summary, and remediation guidance.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderScoreRing } from '../components/ui.js';
import {
  getAllAssessments,
  getAllAssessmentSubmissions,
  getCurrentStudent
} from '../engine/storage.js';

function escapeHTML(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function renderAssessmentResults(submissionId) {
  const student = getCurrentStudent();
  const submissions = await getAllAssessmentSubmissions();
  const assessments = await getAllAssessments();
  const submission = submissions.find((entry) => entry.id === Number.parseInt(submissionId, 10));
  const assessment = assessments.find((entry) => entry.id === submission?.assessmentId);

  if (!submission || !assessment) {
    return '<div class="container" style="padding: 2rem;">Assessment result not found.</div>';
  }

  return `
    ${renderNav({ title: 'Assessment Results', showBack: true, studentName: student?.name, backLabel: 'Back to Assessments' })}
    <div class="container container--narrow view-enter assessment-results-page">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <div class="assessment-hero__eyebrow">Assessment complete</div>
        <h1 class="assessment-hero__title">${assessment.title}</h1>
        <p class="assessment-hero__text">Your open responses were graded against rubrics, then reviewed for integrity and browser behavior.</p>
      </div>

      ${renderScoreRing(submission.grading.totalScore, submission.grading.maxScore)}

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Percentage</span>
          <span class="quiz-result-metric__value">${submission.grading.percentage}%</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">AI / Style Risk</span>
          <span class="quiz-result-metric__value">${submission.integrity.label} (${submission.integrity.score})</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Proctoring</span>
          <span class="quiz-result-metric__value">${submission.proctor.label} (${submission.proctor.anomalyScore})</span>
        </div>
      </div>

      <div class="card card--glass results-next-step">
        <div class="results-next-step__eyebrow">Advanced feature: auto remediation plan</div>
        <h3 class="results-next-step__title">What to improve next</h3>
        <div class="assessment-remediation-list">
          ${submission.grading.remediationPlan.length > 0 ? submission.grading.remediationPlan.map((item) => `
            <div class="assessment-remediation-item">
              <div class="assessment-remediation-item__title">Lesson ${item.lessonId}</div>
              <div class="assessment-remediation-item__objective">${escapeHTML(item.objective)}</div>
              <div class="assessment-remediation-item__action">${escapeHTML(item.action)}</div>
            </div>
          `).join('') : '<div class="insight-empty">No urgent remediation tasks were created for this submission.</div>'}
        </div>
      </div>

      <div class="assessment-results-grid">
        <div class="card">
          <h3 class="diagnostic-section__title">Integrity Review</h3>
          <p class="diagnostic-section__subtitle">${submission.integrity.reasons.join(' | ')}</p>
          <div class="assessment-integrity-metrics">
            <span class="badge badge--neutral">Lexical diversity ${submission.integrity.metrics.lexicalDiversity}</span>
            <span class="badge badge--neutral">Perplexity proxy ${submission.integrity.metrics.perplexityProxy}</span>
            <span class="badge badge--neutral">Similarity ${submission.integrity.metrics.internalSimilarity}</span>
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Proctoring Summary</h3>
          <p class="diagnostic-section__subtitle">Browser events logged during this attempt.</p>
          <div class="assessment-integrity-metrics">
            <span class="badge badge--neutral">Hidden tabs ${submission.proctor.counts['tab-hidden'] || 0}</span>
            <span class="badge badge--neutral">Fullscreen exits ${submission.proctor.counts['fullscreen-exit'] || 0}</span>
            <span class="badge badge--neutral">Paste attempts ${submission.proctor.counts['paste-attempt'] || 0}</span>
            <span class="badge badge--neutral">Blocked shortcuts ${submission.proctor.counts['blocked-shortcut'] || 0}</span>
          </div>
        </div>
      </div>

      <div class="results-review">
        <h3 class="results-review__title">Question Feedback</h3>
        ${submission.grading.questionScores.map((entry, index) => `
          <div class="review-item ${entry.normalizedScore >= 0.6 ? 'review-item--correct' : 'review-item--incorrect'}">
            <div class="review-item__question">${index + 1}. ${escapeHTML(entry.prompt)}</div>
            <div class="review-item__meta">
              <span>${entry.type}</span>
              <span>${entry.score}/${entry.maxScore} points</span>
              <span>${entry.gradingSource === 'ai' ? 'AI graded' : entry.gradingSource === 'fallback' ? 'Rubric fallback' : 'Auto graded'}</span>
            </div>
            <div class="review-item__answer">
              <div>${escapeHTML(entry.feedback)}</div>
            </div>
            ${entry.rubricBreakdown?.length ? `
              <div class="assessment-rubric-breakdown">
                ${entry.rubricBreakdown.map((criterion) => `
                  <div class="assessment-rubric-breakdown__item">
                    <strong>${escapeHTML(criterion.criterion)}:</strong> ${criterion.score}/${criterion.maxScore} - ${escapeHTML(criterion.evidence || '')}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <div class="quiz-results__actions">
        <button class="btn btn--primary btn--lg" id="btn-back-to-center">Back to Assessment Center</button>
        <button class="btn btn--ghost" id="btn-retake-assessment">Retake Assessment</button>
      </div>
    </div>
  `;
}

export function bindAssessmentResultsEvents(navigate, submissionId) {
  bindNavEvents({ onBack: () => navigate('/assessments') });

  const backButton = document.getElementById('btn-back-to-center');
  const retakeButton = document.getElementById('btn-retake-assessment');

  getAllAssessmentSubmissions().then((submissions) => {
    const submission = submissions.find((entry) => entry.id === Number.parseInt(submissionId, 10));
    if (!submission) return;

    if (backButton) {
      backButton.addEventListener('click', () => navigate('/assessments'));
    }

    if (retakeButton) {
      retakeButton.addEventListener('click', () => navigate(`/assessment/${submission.assessmentId}`));
    }
  });
}
