/**
 * ClassConnect - Diagnostic Assessment View
 * Runs the pre-assessment used to identify learner knowledge gaps.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderProgressBar } from '../components/progress-bar.js';
import { renderQuestionCard } from '../components/question-card.js';
import { createDiagnosticSession } from '../engine/diagnostic.js';
import { getCurrentStudent, saveDiagnosticResult } from '../engine/storage.js';

let activeDiagnosticSession = null;
let currentQuestionData = null;
let isProcessingAnswer = false;

export function initDiagnosticSession() {
  activeDiagnosticSession = createDiagnosticSession();
  currentQuestionData = activeDiagnosticSession.next();
  isProcessingAnswer = false;
}

export function ensureDiagnosticSession() {
  if (!activeDiagnosticSession || !currentQuestionData) {
    initDiagnosticSession();
  }
}

export function clearDiagnosticSession() {
  activeDiagnosticSession = null;
  currentQuestionData = null;
  isProcessingAnswer = false;
}

export function renderDiagnostic() {
  if (!activeDiagnosticSession || !currentQuestionData) {
    return '<div class="container">Error loading diagnostic assessment.</div>';
  }

  const student = getCurrentStudent();

  return `
    ${renderNav({ title: 'Diagnostic Assessment', showBack: true, studentName: student?.name })}
    <div class="container container--narrow view-enter diagnostic-page" style="padding-top: var(--space-6);">
      <div class="card card--glass diagnostic-hero">
        <div class="diagnostic-hero__eyebrow">AI-guided readiness check</div>
        <h1 class="diagnostic-hero__title">Let us map your starting point</h1>
        <p class="diagnostic-hero__text">This short pre-assessment samples all five lessons, then follows up on the topics that need the most attention.</p>
        <div class="diagnostic-hero__meta">
          <span class="badge badge--neutral">8 questions max</span>
          <span class="badge badge--accent">${currentQuestionData.phase === 'coverage' ? 'Checking broad coverage' : 'Following up on weak areas'}</span>
          <span class="badge badge--primary">${currentQuestionData.lessonTitle}</span>
        </div>
      </div>

      <div class="diagnostic-stage">
        <div class="diagnostic-stage__header">
          <div>
            <div class="diagnostic-stage__label">Question ${currentQuestionData.questionNumber}</div>
            <h2 class="diagnostic-stage__title">${currentQuestionData.lessonTitle}</h2>
          </div>
          <span class="badge badge--neutral">${currentQuestionData.phase === 'coverage' ? 'Coverage pass' : 'Adaptive follow-up'}</span>
        </div>

        ${renderProgressBar(currentQuestionData.questionNumber - 1, currentQuestionData.totalQuestions, 'Diagnostic progress')}

        <div id="diagnostic-question-wrap">
          ${renderQuestionCard(currentQuestionData.question)}
        </div>
      </div>
    </div>
  `;
}

export function bindDiagnosticEvents(navigate, renderCurrentView) {
  bindNavEvents({ onBack: () => navigate('/lessons') });

  document.querySelectorAll('.option-btn').forEach((button) => {
    button.addEventListener('click', async (event) => {
      if (isProcessingAnswer) return;
      isProcessingAnswer = true;

      const selectedIndex = Number.parseInt(event.currentTarget.dataset.index, 10);
      await handleDiagnosticAnswer(selectedIndex, event.currentTarget, navigate, renderCurrentView);
    });
  });
}

async function handleDiagnosticAnswer(selectedIndex, selectedButton, navigate, renderCurrentView) {
  const result = activeDiagnosticSession.answer(selectedIndex);
  const options = document.querySelectorAll('.option-btn');
  options.forEach((button) => {
    button.classList.add('option-btn--disabled');
    button.disabled = true;
  });

  if (result.correct) {
    selectedButton.classList.add('option-btn--correct');
  } else {
    selectedButton.classList.add('option-btn--incorrect');
    const correctButton = document.getElementById(`option-${result.correctIndex}`);
    if (correctButton) {
      correctButton.classList.add('option-btn--highlight-correct');
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const nextQuestion = activeDiagnosticSession.next();
  if (!nextQuestion) {
    await completeDiagnostic(navigate);
    return;
  }

  currentQuestionData = nextQuestion;
  isProcessingAnswer = false;
  await renderCurrentView();
}

async function completeDiagnostic(navigate) {
  const student = getCurrentStudent();
  const results = activeDiagnosticSession.getResults();

  if (!student) {
    navigate('/student-login');
    return;
  }

  const saved = await saveDiagnosticResult({
    studentId: student.id,
    ...results
  });

  clearDiagnosticSession();
  navigate(`/diagnostic-results/${saved.id}`);
}
