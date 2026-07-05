/**
 * ClassConnect - Diagnostic Results View
 * Summarizes readiness, knowledge gaps, and the personalized path.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { getCurrentStudent, getDiagnosticResult, getLatestDiagnosticForStudent, getProgressForStudent, getQuizResultsForStudent } from '../engine/storage.js';
import { buildStudentProfile } from '../engine/personalization.js';
import { generateDiagnosticInsight } from '../engine/ai-tutor.js';

function renderBreakdownItems(items, emptyText, variant) {
  if (!items.length) {
    return `<div class="insight-empty">${emptyText}</div>`;
  }

  return items.map((item) => `
    <div class="insight-pill insight-pill--${variant}">
      <div class="insight-pill__title">${item.lessonTitle || item.title}</div>
      <div class="insight-pill__meta">${item.accuracy !== undefined ? `${Math.round(item.accuracy * 100)}% diagnostic accuracy` : item.recommendedFocus || 'Ready for the next step'}</div>
    </div>
  `).join('');
}

export async function renderDiagnosticResults(resultId) {
  const student = getCurrentStudent();
  const diagnostic = await getDiagnosticResult(Number.parseInt(resultId, 10));

  if (!student || !diagnostic || diagnostic.studentId !== student.id) {
    return '<div class="container" style="padding: 2rem;">Diagnostic result not found.</div>';
  }

  const latestDiagnostic = await getLatestDiagnosticForStudent(student.id);
  const progressRecords = await getProgressForStudent(student.id);
  const quizResults = await getQuizResultsForStudent(student.id);
  const profile = buildStudentProfile({
    diagnostic: latestDiagnostic,
    results: quizResults,
    progressRecords
  });
  const scorePercent = diagnostic.totalQuestions > 0
    ? Math.round((diagnostic.score / diagnostic.totalQuestions) * 100)
    : 0;

  return `
    ${renderNav({ title: 'Diagnostic Results', showBack: true, studentName: student.name })}
    <div class="container container--narrow view-enter diagnostic-results-page">
      <div class="card card--glass diagnostic-summary">
        <div class="diagnostic-summary__eyebrow">Personalized readiness snapshot</div>
        <h1 class="diagnostic-summary__title">${diagnostic.readiness}</h1>
        <p class="diagnostic-summary__text">Your pre-assessment is complete. We can now personalize lesson order, revision, and tutor support.</p>

        <div class="diagnostic-metrics">
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${scorePercent}%</div>
            <div class="diagnostic-metric__label">Diagnostic score</div>
          </div>
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${diagnostic.knowledgeGaps.length}</div>
            <div class="diagnostic-metric__label">Knowledge gaps</div>
          </div>
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${profile.recommendedNext?.lessonId || 1}</div>
            <div class="diagnostic-metric__label">Recommended start</div>
          </div>
        </div>
      </div>

      <div class="card diagnostic-coach-card">
        <div class="diagnostic-coach-card__header">
          <div>
            <h2 class="diagnostic-coach-card__title">AI Coach Summary</h2>
            <p class="diagnostic-coach-card__subtitle">A personalized explanation based on your readiness profile.</p>
          </div>
          <span class="badge badge--neutral" id="diagnostic-insight-source">Preparing insight...</span>
        </div>
        <div id="diagnostic-insight" class="diagnostic-coach-card__body">
          <div class="shimmer" style="height: 84px;"></div>
        </div>
      </div>

      <div class="diagnostic-grid">
        <div class="card">
          <h3 class="diagnostic-section__title">Focus First</h3>
          <div class="insight-pill-list">
            ${renderBreakdownItems(diagnostic.knowledgeGaps, 'No urgent gaps were detected in the diagnostic.', 'warning')}
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Current Strengths</h3>
          <div class="insight-pill-list">
            ${renderBreakdownItems(diagnostic.strengths, 'Your strengths will appear here as you build more evidence.', 'success')}
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="diagnostic-section__title">Adaptive Content Path</h3>
        <p class="diagnostic-section__subtitle">These lessons are now prioritized using your diagnostic, lesson completion, and quiz evidence.</p>
        <div class="path-preview">
          ${profile.recommendedSequence.slice(0, 4).map((entry, index) => `
            <button class="path-preview__item" data-lesson-id="${entry.lessonId}">
              <div class="path-preview__index">${index + 1}</div>
              <div class="path-preview__body">
                <div class="path-preview__title">${entry.title}</div>
                <div class="path-preview__meta">${entry.masteryPercent}% mastery | ${entry.recommendedFocus}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="diagnostic-actions">
        <button class="btn btn--primary btn--lg" id="btn-open-path">Open Personalized Path</button>
        <button class="btn btn--accent" id="btn-open-tutor">Ask AI Tutor</button>
        <button class="btn btn--ghost" id="btn-retake-diagnostic">Retake Diagnostic</button>
      </div>
    </div>
  `;
}

export function bindDiagnosticResultsEvents(navigate, resultId) {
  bindNavEvents({ onBack: () => navigate('/lessons') });

  const openPathBtn = document.getElementById('btn-open-path');
  const openTutorBtn = document.getElementById('btn-open-tutor');
  const retakeBtn = document.getElementById('btn-retake-diagnostic');

  getDiagnosticResult(Number.parseInt(resultId, 10)).then(async (diagnostic) => {
    const student = getCurrentStudent();
    if (!student || !diagnostic) return;

    const latestDiagnostic = await getLatestDiagnosticForStudent(student.id);
    const progressRecords = await getProgressForStudent(student.id);
    const quizResults = await getQuizResultsForStudent(student.id);
    const profile = buildStudentProfile({
      diagnostic: latestDiagnostic,
      results: quizResults,
      progressRecords
    });

    if (openPathBtn) {
      openPathBtn.addEventListener('click', () => {
        navigate(`/lesson/${profile.recommendedNext?.lessonId || 1}`);
      });
    }

    if (openTutorBtn) {
      openTutorBtn.addEventListener('click', () => {
        navigate('/tutor');
      });
    }

    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        navigate('/diagnostic');
      });
    }

    document.querySelectorAll('.path-preview__item').forEach((item) => {
      item.addEventListener('click', (event) => {
        const lessonId = Number.parseInt(event.currentTarget.dataset.lessonId, 10);
        navigate(`/lesson/${lessonId}`);
      });
    });

    const insight = await generateDiagnosticInsight(student, diagnostic, profile);
    const insightContainer = document.getElementById('diagnostic-insight');
    const sourceBadge = document.getElementById('diagnostic-insight-source');

    if (insightContainer) {
      insightContainer.textContent = insight.text;
    }

    if (sourceBadge) {
      sourceBadge.textContent = insight.source === 'ai' ? 'AI generated' : 'Offline-ready insight';
      sourceBadge.className = `badge ${insight.source === 'ai' ? 'badge--primary' : 'badge--neutral'}`;
    }
  });
}
