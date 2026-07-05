/**
 * ClassConnect — Lesson Viewer View
 * Renders lesson content and tracks progress.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderProgressBar } from '../components/progress-bar.js';
import { lessons, lessonIllustrations } from '../data/lessons.js';
import { getCurrentStudent, isLessonComplete, markLessonComplete, getProgressForStudent } from '../engine/storage.js';

export async function renderLessonList() {
  const student = getCurrentStudent();
  const progress = student ? await getProgressForStudent(student.id) : [];
  const completedIds = new Set(progress.map((entry) => entry.lessonId));

  return `
    ${renderNav({ title: 'Topics', showBack: true, studentName: student?.name })}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <h1 class="lesson-header__title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2);">Introduction to Computer Systems</h1>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-8);">Select a lesson to begin. Complete the lesson to unlock the adaptive quiz.</p>
      ${renderProgressBar(completedIds.size, lessons.length, 'Lessons completed')}

      <div class="lesson-list">
        ${lessons.map((lesson, index) => {
          const isComplete = completedIds.has(lesson.id);
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
        </div>
        <h1 class="lesson-header__title">${lesson.title}</h1>

        <div class="lesson-header__objectives">
          ${lesson.objectives.map((objective) => `
            <div class="lesson-header__objective">${objective}</div>
          `).join('')}
        </div>
      </div>

      <div class="lesson-content">
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
}
