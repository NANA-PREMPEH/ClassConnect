/**
 * ClassConnect — Quiz View
 * Runs the adaptive quiz engine and records timing per question.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderProgressBar } from '../components/progress-bar.js';
import { renderQuestionCard } from '../components/question-card.js';
import { renderFeedbackCard } from '../components/feedback-card.js';
import { createQuizSession } from '../engine/adaptive-quiz.js';
import { generateFeedback } from '../engine/ai-feedback.js';
import { saveQuizResult, getCurrentStudent } from '../engine/storage.js';

let activeSession = null;
let activeLessonId = null;
let currentQuestionData = null;
let currentFeedback = null;
let isProcessingAnswer = false;
let questionTimerId = null;

function formatDuration(ms = 0) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function stopQuestionTimer() {
  if (questionTimerId) {
    window.clearInterval(questionTimerId);
    questionTimerId = null;
  }
}

function updateQuestionTimer() {
  const timer = document.getElementById('question-timer');
  if (!timer || !activeSession) return;
  timer.textContent = formatDuration(activeSession.getCurrentElapsedMs());
}

function startQuestionTimer() {
  stopQuestionTimer();
  updateQuestionTimer();
  questionTimerId = window.setInterval(updateQuestionTimer, 1000);
}

export function initQuizSession(lessonId) {
  stopQuestionTimer();
  activeLessonId = Number.parseInt(lessonId, 10);
  activeSession = createQuizSession(activeLessonId);
  currentQuestionData = activeSession.next();
  currentFeedback = null;
  isProcessingAnswer = false;
}

export function ensureQuizSession(lessonId) {
  const normalizedLessonId = Number.parseInt(lessonId, 10);
  if (!activeSession || activeLessonId !== normalizedLessonId) {
    initQuizSession(normalizedLessonId);
  }
}

export function clearQuizSession() {
  stopQuestionTimer();
  activeSession = null;
  activeLessonId = null;
  currentQuestionData = null;
  currentFeedback = null;
  isProcessingAnswer = false;
}

export function renderQuiz() {
  if (!activeSession || !currentQuestionData) {
    return '<div class="container">Error initializing quiz.</div>';
  }

  const student = getCurrentStudent();
  const questionData = currentQuestionData;

  let content = '';

  if (currentFeedback) {
    content = `
      <div class="question-card">
        <div class="quiz-review-meta">
          <span class="badge badge--neutral">Time: ${formatDuration(currentFeedback.elapsedMs)}</span>
          <span class="badge badge--neutral">Ability: ${currentFeedback.thetaAfter.toFixed(2)}</span>
          <span class="badge badge--neutral">Level: ${currentFeedback.levelLabel}</span>
        </div>

        <h3 style="margin-bottom: var(--space-4);">Question Review</h3>
        <p style="margin-bottom: var(--space-6); font-size: var(--font-size-lg);">${currentFeedback.stem}</p>

        <div class="results-review">
          <div class="review-item ${currentFeedback.correct ? 'review-item--correct' : 'review-item--incorrect'}">
            <div class="review-item__answer">
              <div><strong>Your answer:</strong> <span class="${currentFeedback.correct ? 'review-item__correct-answer' : 'review-item__your-answer'}">${currentFeedback.studentAnswerText}</span></div>
            </div>
            ${!currentFeedback.correct ? `
              <div class="review-item__answer" style="margin-top: var(--space-2);">
                <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${currentFeedback.correctAnswerText}</span></div>
              </div>
            ` : ''}
          </div>
        </div>

        <div style="margin-top: var(--space-6);" id="feedback-container">
          ${currentFeedback.aiText
            ? renderFeedbackCard({ source: currentFeedback.source, text: currentFeedback.aiText }, currentFeedback.correct)
            : '<div class="shimmer" style="height: 100px; width: 100%;"></div>'
          }
        </div>

        <div style="margin-top: var(--space-8); text-align: right;">
          <button class="btn btn--primary btn--lg" id="btn-next-question">
            ${activeSession.isFinished() ? 'See Final Results' : 'Next Question'}
          </button>
        </div>
      </div>
    `;
  } else {
    content = `
      <div class="quiz-header">
        <div class="quiz-header__info">
          <span class="quiz-header__question-num">Question ${questionData.questionNumber} of ${questionData.totalQuestions}</span>
        </div>
        <div class="quiz-header__meta">
          <span class="badge badge--neutral quiz-header__timer" id="question-timer">00:00</span>
          <span class="badge badge--neutral quiz-header__difficulty">Level: ${questionData.difficulty}</span>
        </div>
      </div>

      ${renderProgressBar(questionData.questionNumber - 1, questionData.totalQuestions, 'Quiz progress')}

      <div id="question-container">
        ${renderQuestionCard(questionData.question)}
      </div>
    `;
  }

  return `
    ${renderNav({ title: 'Adaptive Quiz', showBack: true, studentName: student?.name })}
    <div class="container container--narrow view-enter quiz-page" style="padding-top: var(--space-4);">
      ${content}
    </div>
  `;
}

export function bindQuizEvents(navigate, renderCurrentView, lessonId) {
  bindNavEvents({ onBack: () => navigate(`/lesson/${lessonId}`) });

  if (currentFeedback) {
    stopQuestionTimer();
    const nextBtn = document.getElementById('btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', async () => {
        currentFeedback = null;

        if (activeSession.isFinished()) {
          await handleQuizComplete(navigate, lessonId);
          return;
        }

        const nextQuestionData = activeSession.next();
        if (!nextQuestionData) {
          await handleQuizComplete(navigate, lessonId);
          return;
        }

        currentQuestionData = nextQuestionData;
        renderCurrentView();
      });
    }

    if (!currentFeedback.aiText && !currentFeedback.correct) {
      generateFeedback(
        currentFeedback.questionId,
        currentFeedback.stem,
        currentFeedback.studentAnswerText,
        currentFeedback.correctAnswerText
      ).then((feedback) => {
        currentFeedback.aiText = feedback.text;
        currentFeedback.source = feedback.source;

        const container = document.getElementById('feedback-container');
        if (container) {
          container.innerHTML = renderFeedbackCard({ source: feedback.source, text: feedback.text }, false);
        }
      });
    }

    return;
  }

  startQuestionTimer();
  const options = document.querySelectorAll('.option-btn');
  options.forEach((button) => {
    button.addEventListener('click', (event) => {
      if (isProcessingAnswer) return;
      isProcessingAnswer = true;

      const selectedIndex = Number.parseInt(event.currentTarget.dataset.index, 10);
      handleAnswerSelection(selectedIndex, event.currentTarget, renderCurrentView);
    });
  });
}

function handleAnswerSelection(selectedIndex, selectedBtn, renderCurrentView) {
  const result = activeSession.answer(selectedIndex);
  const question = currentQuestionData.question;
  stopQuestionTimer();

  const options = document.querySelectorAll('.option-btn');
  options.forEach((button) => {
    button.classList.add('option-btn--disabled');
    button.disabled = true;
  });

  if (result.correct) {
    selectedBtn.classList.add('option-btn--correct');
  } else {
    selectedBtn.classList.add('option-btn--incorrect');
    const correctBtn = document.getElementById(`option-${result.correctIndex}`);
    if (correctBtn) correctBtn.classList.add('option-btn--highlight-correct');
  }

  currentFeedback = {
    questionId: question.id,
    stem: question.stem,
    correct: result.correct,
    studentAnswerText: question.options[selectedIndex],
    correctAnswerText: question.options[result.correctIndex],
    aiText: result.correct ? 'Great work — you understood this concept.' : null,
    source: result.correct ? 'system' : null,
    elapsedMs: result.elapsedMs,
    thetaAfter: result.thetaAfter,
    levelLabel: result.level.label
  };

  setTimeout(() => {
    isProcessingAnswer = false;
    renderCurrentView();
  }, 1000);
}

async function handleQuizComplete(navigate, lessonId) {
  const student = getCurrentStudent();
  const results = activeSession.getResults();

  if (!student) {
    navigate('/lessons');
    return;
  }

  const saved = await saveQuizResult({
    studentId: student.id,
    lessonId: Number.parseInt(lessonId, 10),
    ...results
  });

  navigate(`/quiz-results/${saved.id}`);
}
