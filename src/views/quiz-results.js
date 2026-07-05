/**
 * ClassConnect — Quiz Results View
 * Displays final score, level, timing, and per-question review.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderScoreRing } from '../components/ui.js';
import { renderFeedbackCard } from '../components/feedback-card.js';
import {
  getAllQuizResults,
  getCurrentStudent,
  getLatestDiagnosticForStudent,
  getProgressForStudent
} from '../engine/storage.js';
import { generateAllFeedback } from '../engine/ai-feedback.js';
import { buildStudentProfile } from '../engine/personalization.js';

function formatDuration(ms = 0) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export async function renderQuizResults(resultId) {
  const student = getCurrentStudent();
  const allResults = await getAllQuizResults();
  const result = allResults.find((entry) => entry.id === Number.parseInt(resultId, 10));

  if (!result) {
    return '<div class="container">Result not found.</div>';
  }

  const studentResults = student ? allResults.filter((entry) => entry.studentId === student.id) : [];
  const diagnostic = student ? await getLatestDiagnosticForStudent(student.id) : null;
  const progressRecords = student ? await getProgressForStudent(student.id) : [];
  const profile = buildStudentProfile({
    diagnostic,
    results: studentResults,
    progressRecords
  });

  return `
    ${renderNav({ title: 'Quiz Results', showBack: true, studentName: student?.name, backLabel: 'Back to Lessons' })}
    <div class="container container--narrow view-enter quiz-results">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-extrabold); margin-bottom: var(--space-2);">Quiz Complete!</h1>
        <p style="color: var(--text-secondary);">Here is how you did.</p>
      </div>

      ${renderScoreRing(result.score, result.totalQuestions)}

      <div class="quiz-results__level">
        <div class="quiz-results__level-label" style="color: ${result.levelColor};">
          Level: ${result.level}
        </div>
        <p class="quiz-results__level-desc">${result.levelDescription}</p>
      </div>

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Total time</span>
          <span class="quiz-result-metric__value">${formatDuration(result.totalTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Average / question</span>
          <span class="quiz-result-metric__value">${formatDuration(result.averageTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Standard error</span>
          <span class="quiz-result-metric__value">${result.standardError}</span>
        </div>
      </div>

      <div class="card card--glass results-next-step">
        <div class="results-next-step__eyebrow">Adaptive content path</div>
        <h3 class="results-next-step__title">Recommended next: ${profile.recommendedNext?.title || 'Return to lessons'}</h3>
        <p class="results-next-step__text">${profile.recommendedNext?.recommendedFocus || 'Keep following your personalized path.'}</p>
        <div class="results-next-step__chips">
          <span class="badge badge--${profile.risk.badge}">Risk: ${profile.risk.label}</span>
          <span class="badge badge--neutral">${profile.revisionQueue[0]?.title || 'Revision queue updated'}</span>
        </div>
      </div>

      <div class="results-review">
        <h3 class="results-review__title">Question Review</h3>
        <div id="review-list">
          <div class="shimmer" style="height: 100px; margin-bottom: var(--space-3);"></div>
          <div class="shimmer" style="height: 100px; margin-bottom: var(--space-3);"></div>
        </div>
      </div>

      <div class="quiz-results__actions">
        <button class="btn btn--primary btn--lg" id="btn-next-lesson">Continue Personalized Path</button>
        <button class="btn btn--accent" id="btn-open-tutor">Ask AI Tutor</button>
        <button class="btn btn--ghost" id="btn-retry-quiz">Retry Quiz</button>
      </div>
    </div>
  `;
}

export function bindQuizResultsEvents(navigate, resultId) {
  bindNavEvents({ onBack: () => navigate('/lessons') });

  const nextBtn = document.getElementById('btn-next-lesson');
  const tutorBtn = document.getElementById('btn-open-tutor');
  const retryBtn = document.getElementById('btn-retry-quiz');

  getAllQuizResults().then(async (results) => {
    const result = results.find((entry) => entry.id === Number.parseInt(resultId, 10));
    if (!result) return;

    const student = getCurrentStudent();
    const studentResults = student ? results.filter((entry) => entry.studentId === student.id) : [];
    const diagnostic = student ? await getLatestDiagnosticForStudent(student.id) : null;
    const progressRecords = student ? await getProgressForStudent(student.id) : [];
    const profile = buildStudentProfile({
      diagnostic,
      results: studentResults,
      progressRecords
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextId = profile.recommendedNext?.lessonId;
        navigate(nextId ? `/lesson/${nextId}` : '/lessons');
      });
    }

    if (tutorBtn) {
      tutorBtn.addEventListener('click', () => {
        navigate('/tutor');
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        navigate(`/quiz/${result.lessonId}`);
      });
    }

    renderReviewList(result.responses);
  });
}

async function renderReviewList(responses) {
  const container = document.getElementById('review-list');
  if (!container) return;

  container.innerHTML = responses.map((response) => renderReviewItem(response, null)).join('');
  const feedbacks = await generateAllFeedback(responses);

  container.innerHTML = responses.map((response) => {
    if (response.correct) {
      return renderReviewItem(response, { text: 'Correct! You handled this concept well.', source: 'system' });
    }

    return renderReviewItem(response, feedbacks[response.questionId]);
  }).join('');
}

function renderReviewItem(response, feedback) {
  const studentAnswer = response.options[response.selectedIndex];
  const correctAnswer = response.options[response.correctIndex];

  let feedbackHtml = '';
  if (feedback) {
    if (!response.correct) {
      feedbackHtml = `
        <div class="review-item__feedback">
          ${renderFeedbackCard(feedback, false)}
        </div>
      `;
    }
  } else if (!response.correct) {
    feedbackHtml = '<div class="shimmer" style="height: 116px; margin-top: var(--space-3);"></div>';
  }

  return `
    <div class="review-item ${response.correct ? 'review-item--correct' : 'review-item--incorrect'}">
      <div class="review-item__question">${response.questionNumber}. ${response.stem}</div>
      <div class="review-item__meta">
        <span>Time: ${formatDuration(response.elapsedMs)}</span>
        <span>Theta after: ${response.thetaAfter}</span>
      </div>
      <div class="review-item__answer">
        <div><strong>Your answer:</strong> <span class="${response.correct ? 'review-item__correct-answer' : 'review-item__your-answer'}">${studentAnswer}</span></div>
      </div>
      ${!response.correct ? `
        <div class="review-item__answer" style="margin-top: var(--space-1);">
          <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${correctAnswer}</span></div>
        </div>
      ` : ''}
      ${feedbackHtml}
    </div>
  `;
}
