/**
 * ClassConnect — Lesson Viewer View
 * Renders lesson content and tracks progress.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderProgressBar } from '../components/progress-bar.js';
import { lessons, lessonIllustrations } from '../data/lessons.js';
import {
  getCurrentStudent,
  getLatestDiagnosticForStudent,
  getProgressForStudent,
  getQuizResultsForStudent,
  isLessonComplete,
  markLessonComplete
} from '../engine/storage.js';
import { buildStudentProfile } from '../engine/personalization.js';

function renderLearningHub(profile, hasDiagnostic) {
  return `
    <div class="card card--glass learning-hub">
      <div class="learning-hub__header">
        <div>
          <div class="learning-hub__eyebrow">Personalized learning path</div>
          <h2 class="learning-hub__title">${profile.readiness.label}</h2>
          <p class="learning-hub__text">${profile.readiness.description}</p>
        </div>
        <div class="learning-hub__badges">
          <span class="badge badge--${profile.readiness.tone}">${profile.completionRate}% complete</span>
          <span class="badge badge--${hasDiagnostic ? 'primary' : 'warning'}">${hasDiagnostic ? 'Diagnostic complete' : 'Diagnostic recommended'}</span>
          <span class="badge badge--neutral">Risk: ${profile.risk.label}</span>
        </div>
      </div>

      <div class="learning-hub__grid">
        <div class="learning-hub__panel">
          <div class="learning-hub__panel-label">Recommended next lesson</div>
          <div class="learning-hub__panel-value">${profile.recommendedNext?.title || 'Lesson 1'}</div>
          <div class="learning-hub__panel-meta">${profile.recommendedNext?.recommendedFocus || 'Start with the first lesson to build your path.'}</div>
        </div>

        <div class="learning-hub__panel">
          <div class="learning-hub__panel-label">Top focus area</div>
          <div class="learning-hub__panel-value">${profile.knowledgeGaps[0]?.title || 'Keep building across all lessons'}</div>
          <div class="learning-hub__panel-meta">${profile.revisionQueue[0]?.reason || 'Your current evidence is looking steady.'}</div>
        </div>
      </div>

      <div class="learning-hub__actions">
        <button class="btn btn--primary" id="btn-open-path">Start Recommended Lesson</button>
        <button class="btn btn--accent" id="btn-open-assessments">Assessment Center</button>
        <button class="btn btn--accent" id="btn-open-tutor">Ask AI Tutor</button>
        <button class="btn btn--ghost" id="btn-open-diagnostic">${hasDiagnostic ? 'Retake Diagnostic' : 'Take Diagnostic'}</button>
      </div>
    </div>
  `;
}

function renderRevisionQueue(profile) {
  if (!profile.revisionQueue.length) return '';

  return `
    <div class="card revision-queue">
      <div class="revision-queue__header">
        <div>
          <h3 class="revision-queue__title">Smart Revision Queue</h3>
          <p class="revision-queue__subtitle">These are the best topics to review next based on your diagnostic and quiz history.</p>
        </div>
      </div>

      <div class="revision-queue__list">
        ${profile.revisionQueue.map((item) => `
          <button class="revision-queue__item" data-lesson-id="${item.lessonId}">
            <div class="revision-queue__title-row">
              <span class="revision-queue__item-title">${item.title}</span>
              <span class="badge badge--warning">Priority ${item.priority}</span>
            </div>
            <div class="revision-queue__reason">${item.reason}</div>
            <div class="revision-queue__action">${item.action}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAdaptivePreview(profile) {
  return `
    <div class="card adaptive-preview">
      <div class="revision-queue__header">
        <div>
          <h3 class="revision-queue__title">Adaptive Content Path</h3>
          <p class="revision-queue__subtitle">Lesson sequencing updates as your evidence changes.</p>
        </div>
      </div>

      <div class="adaptive-preview__list">
        ${profile.recommendedSequence.slice(0, 4).map((entry, index) => `
          <button class="adaptive-preview__item" data-lesson-id="${entry.lessonId}">
            <div class="adaptive-preview__step">${index + 1}</div>
            <div class="adaptive-preview__body">
              <div class="adaptive-preview__title">${entry.title}</div>
              <div class="adaptive-preview__meta">${entry.masteryPercent}% mastery | ${entry.recommendedFocus}</div>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

export async function renderLessonList() {
  const student = getCurrentStudent();
  const progress = student ? await getProgressForStudent(student.id) : [];
  const completedIds = new Set(progress.map((entry) => entry.lessonId));
  const quizResults = student ? await getQuizResultsForStudent(student.id) : [];
  const diagnostic = student ? await getLatestDiagnosticForStudent(student.id) : null;
  const profile = buildStudentProfile({
    diagnostic,
    results: quizResults,
    progressRecords: progress
  });

  return `
    ${renderNav({ title: 'Topics', showBack: true, studentName: student?.name })}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <h1 class="lesson-header__title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2);">Introduction to Computer Systems</h1>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-8);">Select a lesson to begin. Complete the lesson to unlock the adaptive quiz.</p>
      ${renderLearningHub(profile, !!diagnostic)}
      ${renderRevisionQueue(profile)}
      ${renderAdaptivePreview(profile)}
      ${renderProgressBar(completedIds.size, lessons.length, 'Lessons completed')}

      <div class="lesson-list">
        ${lessons.map((lesson, index) => {
          const isComplete = completedIds.has(lesson.id);
          const lessonProfile = profile.lessonProfiles.find((entry) => entry.lessonId === lesson.id);
          const isRecommended = profile.recommendedNext?.lessonId === lesson.id;
          const isFocus = profile.knowledgeGaps.some((entry) => entry.lessonId === lesson.id);
          return `
            <div class="card card--interactive lesson-card" data-id="${lesson.id}">
              <div class="lesson-card__number ${isComplete ? 'lesson-card__number--completed' : ''}">
                ${isComplete ? 'Done' : index + 1}
              </div>
              <div class="lesson-card__info">
                <div class="lesson-card__title">${lesson.title}</div>
                <div class="lesson-card__meta">
                  <span>${lesson.duration}</span>
                  <span>${lesson.objectives.length} objectives</span>
                  <span>${lessonProfile?.masteryPercent || 0}% mastery</span>
                </div>
                <div class="lesson-card__badges">
                  ${isRecommended ? '<span class="badge badge--primary">Recommended next</span>' : ''}
                  ${isFocus ? '<span class="badge badge--warning">Focus</span>' : ''}
                </div>
              </div>
              <div class="lesson-card__status">
                ${isComplete ? '<span class="badge badge--success">Completed</span>' : '<span class="badge badge--neutral">Start</span>'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindLessonListEvents(navigate) {
  bindNavEvents({ onBack: () => navigate('/') });

  const openPathBtn = document.getElementById('btn-open-path');
  if (openPathBtn) {
    openPathBtn.addEventListener('click', async () => {
      const student = getCurrentStudent();
      const progress = student ? await getProgressForStudent(student.id) : [];
      const diagnostic = student ? await getLatestDiagnosticForStudent(student.id) : null;
      const results = student ? await getQuizResultsForStudent(student.id) : [];
      const profile = buildStudentProfile({
        diagnostic,
        results,
        progressRecords: progress
      });
      navigate(`/lesson/${profile.recommendedNext?.lessonId || 1}`);
    });
  }

  const openTutorBtn = document.getElementById('btn-open-tutor');
  if (openTutorBtn) {
    openTutorBtn.addEventListener('click', () => navigate('/tutor'));
  }

  const openAssessmentsBtn = document.getElementById('btn-open-assessments');
  if (openAssessmentsBtn) {
    openAssessmentsBtn.addEventListener('click', () => navigate('/assessments'));
  }

  const openDiagnosticBtn = document.getElementById('btn-open-diagnostic');
  if (openDiagnosticBtn) {
    openDiagnosticBtn.addEventListener('click', () => navigate('/diagnostic'));
  }

  document.querySelectorAll('.revision-queue__item, .adaptive-preview__item').forEach((item) => {
    item.addEventListener('click', (event) => {
      const id = Number.parseInt(event.currentTarget.dataset.lessonId, 10);
      navigate(`/lesson/${id}`);
    });
  });

  document.querySelectorAll('.lesson-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      const id = Number.parseInt(event.currentTarget.dataset.id, 10);
      navigate(`/lesson/${id}`);
    });
  });
}

export async function renderLessonDetail(lessonId) {
  const student = getCurrentStudent();
  const lesson = lessons.find((entry) => entry.id === lessonId);

  if (!lesson) {
    return '<div class="container" style="padding: 2rem;">Lesson not found.</div>';
  }

  const lessonIndex = lessons.indexOf(lesson);
  const isComplete = student ? await isLessonComplete(student.id, lessonId) : false;
  const illustration = lessonIllustrations[lessonId];
  const progress = student ? await getProgressForStudent(student.id) : [];
  const results = student ? await getQuizResultsForStudent(student.id) : [];
  const diagnostic = student ? await getLatestDiagnosticForStudent(student.id) : null;
  const profile = buildStudentProfile({
    diagnostic,
    results,
    progressRecords: progress
  });
  const lessonProfile = profile.lessonProfiles.find((entry) => entry.lessonId === lessonId);

  return `
    ${renderNav({ title: 'Lesson', showBack: true, studentName: student?.name })}

    <div class="container container--narrow view-enter lesson-page">
      ${renderProgressBar(lessonIndex + 1, lessons.length, `Lesson ${lessonIndex + 1} of ${lessons.length}`)}
      <div class="lesson-progress-strip">
        ${lessons.map((entry, index) => `
          <div class="lesson-progress-pip ${index === lessonIndex ? 'lesson-progress-pip--current' : ''} ${index < lessonIndex ? 'lesson-progress-pip--completed' : ''}"></div>
        `).join('')}
      </div>

      <div class="lesson-header">
        <div class="lesson-header__meta">
          <span class="lesson-header__number">Lesson ${lessonIndex + 1}</span>
          <span class="badge badge--neutral">${lesson.duration}</span>
          <span class="badge badge--${lessonProfile?.status === 'mastered' ? 'success' : lessonProfile?.status === 'growing' ? 'accent' : 'warning'}">${lessonProfile?.masteryPercent || 0}% mastery</span>
        </div>
        <h1 class="lesson-header__title">${lesson.title}</h1>

        <div class="lesson-header__objectives">
          ${lesson.objectives.map((objective) => `
            <div class="lesson-header__objective">${objective}</div>
          `).join('')}
        </div>
      </div>

      <div class="lesson-content">
        <div class="lesson-support card card--glass">
          <div>
            <div class="lesson-support__title">Need help with this lesson?</div>
            <div class="lesson-support__text">${lessonProfile?.recommendedFocus || 'Use the AI Tutor for an explanation before you take the quiz.'}</div>
          </div>
          <button class="btn btn--accent btn--sm" id="btn-ask-tutor">Ask AI Tutor</button>
        </div>

        ${illustration ? `
          <figure class="lesson-image">
            <img src="${illustration.src}" alt="${illustration.alt}" loading="lazy">
            <figcaption class="lesson-image__caption">${illustration.caption}</figcaption>
          </figure>
        ` : ''}
        ${lesson.content}

        ${lesson.keyTerms?.length ? `
          <div class="key-terms">
            <div class="key-terms__title">Key Terms to Remember</div>
            <div class="key-terms__list">
              ${lesson.keyTerms.map((term) => `
                <div class="key-term">
                  <div class="key-term__word">${term.word}</div>
                  <div class="key-term__def">${term.definition}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="lesson-actions">
        <div class="lesson-actions__nav">
          ${lessonIndex > 0 ? '<button class="btn btn--ghost" id="btn-prev-lesson">Previous Lesson</button>' : '<div></div>'}
        </div>

        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: flex-end;">
          ${!isComplete ? `
            <button class="btn btn--primary" id="btn-mark-complete">Mark as Complete</button>
          ` : `
            <span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
              Completed
            </span>
          `}

          <button class="btn btn--accent" id="btn-take-quiz" ${!isComplete ? 'disabled title="Complete lesson first"' : ''}>
            Take Adaptive Quiz
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindLessonDetailEvents(navigate, lessonId) {
  bindNavEvents({ onBack: () => navigate('/lessons') });

  const student = getCurrentStudent();
  const lesson = lessons.find((entry) => entry.id === lessonId);
  const lessonIndex = lessons.indexOf(lesson);
  const completeBtn = document.getElementById('btn-mark-complete');
  const quizBtn = document.getElementById('btn-take-quiz');
  const prevBtn = document.getElementById('btn-prev-lesson');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      navigate(`/lesson/${lessons[lessonIndex - 1].id}`);
    });
  }

  if (completeBtn && student) {
    completeBtn.addEventListener('click', async () => {
      await markLessonComplete(student.id, lessonId);
      completeBtn.outerHTML = '<span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">Completed</span>';
      if (quizBtn) {
        quizBtn.removeAttribute('disabled');
        quizBtn.removeAttribute('title');
      }

      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  if (quizBtn) {
    quizBtn.addEventListener('click', () => {
      navigate(`/quiz/${lessonId}`);
    });
  }

  const tutorBtn = document.getElementById('btn-ask-tutor');
  if (tutorBtn) {
    tutorBtn.addEventListener('click', () => {
      navigate('/tutor');
    });
  }
}
