/**
 * ClassConnect - Assessment Session View
 * Runs browser-proctored mixed-format assessments and saves responses for grading.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderProgressBar } from '../components/progress-bar.js';
import { showToast } from '../components/ui.js';
import { createProctorSession } from '../engine/proctoring.js';
import { gradeAssessmentSubmission } from '../engine/assessment-grading.js';
import { analyzeAssessmentIntegrity } from '../engine/submission-analysis.js';
import {
  getAssessment,
  getAssessmentSubmissionsForStudent,
  getCurrentStudent,
  saveAssessmentSubmission
} from '../engine/storage.js';

let activeAssessment = null;
let activeAssessmentId = null;
let answerMap = new Map();
let assessmentStarted = false;
let proctorSession = null;
let timerId = null;
let remainingSeconds = 0;
let isSubmitting = false;

function formatDuration(totalSeconds = 0) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function escapeHTML(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildDefaultAnswer(question) {
  return question.type === 'mcq'
    ? { questionId: question.id, type: question.type, selectedIndex: null }
    : { questionId: question.id, type: question.type, responseText: question.type === 'code' ? (question.starterCode || '') : '' };
}

function isMeaningfulResponse(question, answer) {
  if (!answer) return false;

  if (question.type === 'mcq') {
    return Number.isInteger(answer.selectedIndex);
  }

  const normalized = (answer.responseText || '').trim();
  if (!normalized) return false;

  if (question.type === 'code' && normalized === (question.starterCode || '').trim()) {
    return false;
  }

  return true;
}

function renderAssessmentQuestion(question, index, answer) {
  if (question.type === 'mcq') {
    return `
      <div class="assessment-question card">
        <div class="assessment-question__header">
          <span class="badge badge--primary">Question ${index + 1}</span>
          <span class="badge badge--neutral">MCQ</span>
          <span class="badge badge--neutral">${question.maxScore} point${question.maxScore === 1 ? '' : 's'}</span>
        </div>
        <h3 class="assessment-question__prompt">${question.prompt}</h3>
        <div class="question-options">
          ${question.options.map((option, optionIndex) => `
            <button class="option-btn assessment-option ${answer?.selectedIndex === optionIndex ? 'option-btn--selected' : ''}" type="button" data-question-id="${question.id}" data-option-index="${optionIndex}">
              <span class="option-btn__letter">${String.fromCharCode(65 + optionIndex)}</span>
              <span class="option-btn__text">${option}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="assessment-question card">
      <div class="assessment-question__header">
        <span class="badge badge--${question.type === 'code' ? 'warning' : 'accent'}">Question ${index + 1}</span>
        <span class="badge badge--neutral">${question.type === 'code' ? 'Coding' : 'Short Answer'}</span>
        <span class="badge badge--neutral">${question.maxScore} points</span>
      </div>
      <h3 class="assessment-question__prompt">${question.prompt}</h3>
      ${question.type === 'code' && question.starterCode ? `
        <div class="assessment-question__starter">
          <div class="assessment-question__starter-label">Starter code</div>
          <pre>${escapeHTML(question.starterCode)}</pre>
        </div>
      ` : ''}
      <textarea
        class="input assessment-response ${question.type === 'code' ? 'assessment-response--code' : ''}"
        data-question-id="${question.id}"
        rows="${question.type === 'code' ? 10 : 5}"
        placeholder="${question.type === 'code' ? 'Write your code here...' : 'Write your response here...'}"
      >${escapeHTML(answer?.responseText || '')}</textarea>
    </div>
  `;
}

function currentAnswerList() {
  return activeAssessment?.questions.map((question) => answerMap.get(question.id) || buildDefaultAnswer(question)) || [];
}

function updateTimerDisplay() {
  const timer = document.getElementById('assessment-session-timer');
  if (timer) {
    timer.textContent = formatDuration(remainingSeconds);
  }
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

export async function ensureAssessmentSession(assessmentId) {
  const normalizedId = Number.parseInt(assessmentId, 10);
  if (activeAssessment && activeAssessmentId === normalizedId) {
    return;
  }

  activeAssessment = await getAssessment(normalizedId);
  activeAssessmentId = normalizedId;
  answerMap = new Map((activeAssessment?.questions || []).map((question) => [question.id, buildDefaultAnswer(question)]));
  assessmentStarted = false;
  proctorSession = null;
  remainingSeconds = (activeAssessment?.durationMinutes || 20) * 60;
  stopTimer();
  isSubmitting = false;
}

export function clearAssessmentSession() {
  stopTimer();
  if (proctorSession) {
    void proctorSession.stop();
  }

  activeAssessment = null;
  activeAssessmentId = null;
  answerMap = new Map();
  assessmentStarted = false;
  proctorSession = null;
  remainingSeconds = 0;
  isSubmitting = false;
}

async function beginAssessment(renderCurrentView) {
  if (!activeAssessment || assessmentStarted) return;

  proctorSession = createProctorSession();
  await proctorSession.start();
  assessmentStarted = true;
  remainingSeconds = (activeAssessment.durationMinutes || 20) * 60;
  await renderCurrentView();
}

async function submitAssessment(navigate) {
  if (!activeAssessment || isSubmitting) return;
  isSubmitting = true;
  stopTimer();

  const student = getCurrentStudent();
  if (!student) {
    isSubmitting = false;
    navigate('/student-login');
    return;
  }

  try {
    const answers = currentAnswerList().map((answer) => {
      const question = activeAssessment.questions.find((entry) => entry.id === answer.questionId);
      if (!question || question.type === 'mcq') {
        return answer;
      }

      return {
        ...answer,
        responseText: isMeaningfulResponse(question, answer) ? answer.responseText : ''
      };
    });
    const priorSubmissions = await getAssessmentSubmissionsForStudent(student.id);
    const grading = await gradeAssessmentSubmission({
      assessment: activeAssessment,
      answers
    });
    const integrity = analyzeAssessmentIntegrity({
      answers,
      priorSubmissions
    });
    const proctorSummary = proctorSession
      ? await proctorSession.stop()
      : {
        anomalyScore: 0,
        label: 'Low',
        counts: {},
        events: []
      };

    const saved = await saveAssessmentSubmission({
      assessmentId: activeAssessment.id,
      studentId: student.id,
      answers,
      grading,
      integrity,
      proctor: proctorSummary
    });

    activeAssessment = null;
    activeAssessmentId = null;
    answerMap = new Map();
    assessmentStarted = false;
    proctorSession = null;
    remainingSeconds = 0;
    isSubmitting = false;

    navigate(`/assessment-results/${saved.id}`);
  } catch (error) {
    console.error(error);
    showToast('Unable to submit the assessment right now.', 'error');
    isSubmitting = false;
  }
}

function ensureTimer(navigate) {
  if (!assessmentStarted || timerId || !activeAssessment) return;

  updateTimerDisplay();
  timerId = window.setInterval(async () => {
    remainingSeconds = Math.max(0, remainingSeconds - 1);
    updateTimerDisplay();

    if (remainingSeconds === 0) {
      stopTimer();
      showToast('Time is up. Submitting your assessment now.', 'info');
      await submitAssessment(navigate);
    }
  }, 1000);
}

function getProgressValue() {
  const answers = currentAnswerList();
  const completed = answers.filter((answer) => {
    const question = activeAssessment?.questions.find((entry) => entry.id === answer.questionId);
    return question ? isMeaningfulResponse(question, answer) : false;
  }).length;

  return {
    completed,
    total: activeAssessment?.questions.length || 0
  };
}

export function renderAssessmentSession() {
  const student = getCurrentStudent();
  if (!activeAssessment) {
    return '<div class="container" style="padding: 2rem;">Assessment not found.</div>';
  }

  const progress = getProgressValue();
  const proctorSnapshot = proctorSession?.summarize?.();

  if (!assessmentStarted) {
    return `
      ${renderNav({ title: 'Assessment Session', showBack: true, studentName: student?.name })}
      <div class="container container--narrow view-enter assessment-session-page">
        <div class="card card--glass assessment-start-card">
          <div class="assessment-hero__eyebrow">Proctored assessment</div>
          <h1 class="assessment-hero__title">${activeAssessment.title}</h1>
          <p class="assessment-hero__text">This assessment uses browser-based proctoring, open-response grading, item analysis, and integrity review.</p>

          <div class="assessment-start-card__grid">
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${activeAssessment.durationMinutes}</span>
              <span class="assessment-start-card__label">Minutes</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${activeAssessment.questions.length}</span>
              <span class="assessment-start-card__label">Questions</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${activeAssessment.objectiveCoverage.length}</span>
              <span class="assessment-start-card__label">Objectives</span>
            </div>
          </div>

          <div class="assessment-start-card__rules">
            <div class="assessment-start-card__rule">Secure mode will request fullscreen and log tab switches, blur events, copy/paste attempts, and suspicious typing bursts.</div>
            <div class="assessment-start-card__rule">Open-ended answers are graded with rubric alignment, then checked for style consistency and AI-writing risk.</div>
            <div class="assessment-start-card__rule">Coding questions use a safe static review instead of executing submitted code.</div>
          </div>

          <button class="btn btn--primary btn--lg" id="btn-begin-assessment">Begin Secure Assessment</button>
        </div>
      </div>
    `;
  }

  return `
    ${renderNav({ title: 'Assessment Session', showBack: true, studentName: student?.name })}
    <div class="container container--narrow view-enter assessment-session-page">
      <div class="card card--glass assessment-session-topbar">
        <div>
          <div class="assessment-hero__eyebrow">Assessment in progress</div>
          <h1 class="assessment-session-topbar__title">${activeAssessment.title}</h1>
        </div>
        <div class="assessment-session-topbar__meta">
          <span class="badge badge--warning" id="assessment-session-timer">${formatDuration(remainingSeconds)}</span>
          <span class="badge badge--neutral">${progress.completed}/${progress.total} answered</span>
          <span class="badge badge--${proctorSnapshot?.label === 'High' ? 'danger' : proctorSnapshot?.label === 'Moderate' ? 'warning' : 'success'}">Proctor ${proctorSnapshot?.label || 'Low'}</span>
        </div>
      </div>

      ${renderProgressBar(progress.completed, progress.total, 'Assessment completion')}

      <form id="assessment-session-form" class="assessment-session-form">
        ${activeAssessment.questions.map((question, index) => renderAssessmentQuestion(question, index, answerMap.get(question.id))).join('')}

        <div class="assessment-session-submit">
          <button class="btn btn--primary btn--lg" id="btn-submit-assessment" type="submit">Submit Assessment</button>
        </div>
      </form>
    </div>
  `;
}

export function bindAssessmentSessionEvents(navigate, renderCurrentView, assessmentId) {
  bindNavEvents({
    onBack: () => navigate('/assessments')
  });

  if (!assessmentStarted) {
    const beginButton = document.getElementById('btn-begin-assessment');
    if (beginButton) {
      beginButton.addEventListener('click', async () => {
        await beginAssessment(renderCurrentView);
      });
    }
    return;
  }

  ensureTimer(navigate);

  document.querySelectorAll('.assessment-option').forEach((button) => {
    button.addEventListener('click', (event) => {
      const questionId = event.currentTarget.dataset.questionId;
      const optionIndex = Number.parseInt(event.currentTarget.dataset.optionIndex, 10);
      const current = answerMap.get(questionId) || { questionId, type: 'mcq', selectedIndex: null };
      answerMap.set(questionId, {
        ...current,
        selectedIndex: optionIndex
      });

      document.querySelectorAll(`.assessment-option[data-question-id="${questionId}"]`).forEach((optionButton) => {
        optionButton.classList.toggle('option-btn--selected', Number.parseInt(optionButton.dataset.optionIndex, 10) === optionIndex);
      });
    });
  });

  document.querySelectorAll('.assessment-response').forEach((field) => {
    field.addEventListener('input', (event) => {
      const questionId = event.currentTarget.dataset.questionId;
      const question = activeAssessment.questions.find((entry) => entry.id === questionId);
      if (!question) return;

      answerMap.set(questionId, {
        questionId,
        type: question.type,
        responseText: event.currentTarget.value
      });

      proctorSession?.trackTextEntry(questionId, event.currentTarget.value);
    });
  });

  const form = document.getElementById('assessment-session-form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitAssessment(navigate, assessmentId);
    });
  }
}
