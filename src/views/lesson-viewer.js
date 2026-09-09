/**
 * ClassConnect — Lesson Viewer View
 * Renders lesson content and tracks progress.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderProgressBar } from '../components/progress-bar.js';
import { lessons, lessonIllustrations } from '../data/lessons.js';
import {
  getCurrentStudent,
  getAllCustomLessons,
  getLatestDiagnosticForStudent,
  getProgressForStudent,
  getQuizResultsForStudent,
  isLessonComplete,
  markLessonComplete,
  clearCurrentStudent
} from '../engine/storage.js';
import { buildStudentProfile } from '../engine/personalization.js';
import { bindReadAloudControls, speak, stopSpeaking } from '../engine/speech.js';

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const CORE_UNIT = 'Introduction to Computer Systems';

function getLessonOutline(content = '') {
  const documentFragment = new DOMParser().parseFromString(String(content), 'text/html');
  return [...documentFragment.querySelectorAll('h2, h3')].map((heading, index) => ({
    id: `lesson-section-${index + 1}`,
    level: heading.tagName.toLowerCase(),
    title: heading.textContent.trim()
  }));
}

function renderCustomLessonContent(content = '') {
  const permittedTags = new Set(['H2', 'H3', 'P', 'STRONG', 'EM', 'B', 'I', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'BR', 'DIV', 'SPAN', 'PRE', 'CODE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD']);
  const documentFragment = new DOMParser().parseFromString(String(content), 'text/html');
  documentFragment.body.querySelectorAll('*').forEach((element) => {
    if (!permittedTags.has(element.tagName)) {
      element.replaceWith(documentFragment.createTextNode(element.textContent || ''));
      return;
    }
    [...element.attributes].forEach((attribute) => {
      if (attribute.name !== 'class') element.removeAttribute(attribute.name);
    });
  });
  return documentFragment.body.innerHTML;
}

function isSafeIllustrationSource(src) {
  return typeof src === 'string' && (/^\/images\/[\w./-]+\.png$/i.test(src) || /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(src));
}

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

async function getLearningWorkspace() {
  const student = getCurrentStudent();
  const [customLessons, progress, quizResults, diagnostic] = await Promise.all([
    getAllCustomLessons(),
    student ? getProgressForStudent(student.id) : [],
    student ? getQuizResultsForStudent(student.id) : [],
    student ? getLatestDiagnosticForStudent(student.id) : null
  ]);
  const profile = buildStudentProfile({ diagnostic, results: quizResults, progressRecords: progress });
  return { student, customLessons, progress, quizResults, diagnostic, profile, completedIds: new Set(progress.map((entry) => entry.lessonId)) };
}

function renderLessonsSubnav(active) {
  const items = [
    ['dashboard', '/lessons', 'My learning'],
    ['library', '/lessons/library', 'Library'],
    ['progress', '/lessons/progress', 'Progress'],
    ['review', '/lessons/review', 'Review']
  ];
  return `<nav class="lessons-subnav" aria-label="Lessons navigation">${items.map(([id, href, label]) => `<a class="lessons-subnav__link ${active === id ? 'lessons-subnav__link--active' : ''}" href="${href}" data-lessons-route="${href}" ${active === id ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
}

function bindStudentLessonsNav(navigate, onBack) {
  bindNavEvents({
    onBack,
    onLogout: () => {
      clearCurrentStudent();
      navigate('/', false);
    }
  });
}

function renderLessonCard(lesson, options = {}) {
  const { complete = false, mastery = null, recommended = false, focus = false, custom = false, index = null } = options;
  const id = custom ? `custom-${lesson.id}` : lesson.id;
  const action = complete ? 'Review' : recommended ? 'Continue' : 'Start';
  return `<article class="card card--interactive lesson-card" data-id="${id}" data-title="${esc(lesson.title).toLowerCase()}" data-complete="${complete}" data-custom="${custom}" data-recommended="${recommended}">
    <div class="lesson-card__number ${complete ? 'lesson-card__number--completed' : ''}">${complete ? 'Done' : custom ? 'School' : index + 1}</div>
    <div class="lesson-card__info"><div class="lesson-card__title">${custom ? esc(lesson.title) : lesson.title}</div>
      <div class="lesson-card__meta"><span>${custom ? esc(lesson.subject || 'Computing') : lesson.duration}</span><span>${custom ? esc(lesson.strand || 'School lesson') : `${lesson.objectives.length} objectives`}</span>${mastery !== null ? `<span>${mastery}% mastery</span>` : ''}</div>
      <div class="lesson-card__badges">${recommended ? '<span class="badge badge--primary">Recommended</span>' : ''}${focus ? '<span class="badge badge--warning">Review topic</span>' : ''}${custom ? '<span class="badge badge--accent">School lesson</span>' : ''}</div>
    </div><div class="lesson-card__status"><span class="badge badge--${complete ? 'success' : 'neutral'}">${complete ? 'Completed' : action}</span></div>
  </article>`;
}

export async function renderLessonList() {
  const { student, progress, diagnostic, profile, completedIds } = await getLearningWorkspace();
  const nextLesson = profile.recommendedNext || lessons[0];
  const nextProfile = profile.lessonProfiles.find((entry) => entry.lessonId === nextLesson?.id);
  const focusItems = profile.revisionQueue.slice(0, 2);

  return `
    ${renderNav({ title: 'My learning', showBack: true, studentName: student?.name })}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <header class="lessons-page-header"><h1>My learning</h1><p>Pick up where you left off, then explore your learning path when you are ready.</p></header>
      ${renderLessonsSubnav('dashboard')}
      <section class="learning-next card card--glass" aria-labelledby="next-lesson-title"><div class="learning-next__layout" style="width: 100%; padding: 1.5rem;"><div class="learning-next__content"><span class="learning-next__eyebrow">Your next lesson</span><h2 id="next-lesson-title">${nextLesson?.title || 'Your first lesson'}</h2><p>${nextProfile?.recommendedFocus || 'Build your computer systems knowledge one lesson at a time.'}</p><div class="lesson-card__meta"><span>${nextLesson?.duration || 'Ready to start'}</span><span>${nextLesson?.objectives?.length || 0} objectives</span></div></div><button class="btn btn--primary learning-next__action" id="btn-open-path">${completedIds.has(nextLesson?.id) ? 'Review lesson' : 'Continue learning'}</button></div></section>
      <section class="learning-summary" aria-label="Learning summary"><div class="card learning-summary__card"><span>Lessons completed</span><strong>${completedIds.size} of ${lessons.length}</strong></div><div class="card learning-summary__card"><span>Current mastery</span><strong>${profile.completionRate}%</strong></div><div class="card learning-summary__card"><span>Next focus</span><strong>${profile.knowledgeGaps[0]?.title || 'Keep learning'}</strong></div></section>
      ${!diagnostic ? `<section class="learning-callout card"><div><h2>Personalise your learning</h2><p>Take a short diagnostic so ClassConnect can suggest the best next topic.</p></div><button class="btn btn--secondary" id="btn-open-diagnostic">Take diagnostic</button></section>` : ''}
      <section class="learning-section" aria-labelledby="review-preview-title"><div class="learning-section__heading"><div><h2 id="review-preview-title">Recommended review</h2><p>Topics selected from your recent learning evidence.</p></div><a href="/lessons/review" data-lessons-route="/lessons/review">See all review topics</a></div>${focusItems.length ? `<div class="lesson-list">${focusItems.map((item) => `<button class="revision-queue__item" data-lesson-id="${item.lessonId}"><div class="revision-queue__title-row"><span class="revision-queue__item-title">${item.title}</span><span class="badge badge--warning">Priority ${item.priority}</span></div><div class="revision-queue__reason">${item.reason}</div></button>`).join('')}</div>` : '<div class="card empty-state">You are on track. Keep going with your next lesson.</div>'}</section>
      <a class="learning-library-link card" href="/lessons/library" data-lessons-route="/lessons/library"><span><strong>Browse the lesson library</strong><small>View all lessons, including school lessons from your teacher.</small></span><span aria-hidden="true">→</span></a>
    </div>
  `;
}

export async function renderLessonLibrary() {
  const { student, customLessons, profile, completedIds } = await getLearningWorkspace();
  const cards = lessons.map((lesson, index) => renderLessonCard(lesson, { index, complete: completedIds.has(lesson.id), mastery: profile.lessonProfiles.find((item) => item.lessonId === lesson.id)?.masteryPercent || 0, recommended: profile.recommendedNext?.lessonId === lesson.id, focus: profile.knowledgeGaps.some((item) => item.lessonId === lesson.id) }));
  const customCards = customLessons.map((lesson) => renderLessonCard(lesson, { custom: true, complete: completedIds.has(`custom-${lesson.id}`) }));
  return `${renderNav({ title: 'Lesson library', showBack: true, studentName: student?.name })}<div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);"><header class="lessons-page-header"><h1>Lesson library</h1><p>Choose a topic to start, continue, or review.</p></header>${renderLessonsSubnav('library')}<div class="library-toolbar"><label class="sr-only" for="lesson-search">Search lessons</label><input id="lesson-search" class="input" type="search" placeholder="Search lessons"><select id="lesson-status-filter" class="input" aria-label="Filter lessons"><option value="all">All lessons</option><option value="incomplete">To start</option><option value="completed">Completed</option><option value="school">School lessons</option></select><select id="lesson-sort" class="input" aria-label="Sort lessons"><option value="curriculum">Curriculum order</option><option value="recommended">Recommended first</option><option value="completed">Completed first</option><option value="school">School lessons first</option></select></div><section aria-labelledby="core-unit-title"><h2 class="lesson-library__heading" id="core-unit-title">${CORE_UNIT}</h2><div class="lesson-list lesson-library-list" id="lesson-library-list">${cards}</div></section>${customCards.length ? `<section class="custom-curriculum" aria-labelledby="school-lessons-title"><div class="custom-curriculum__header"><div><h2 id="school-lessons-title">School lessons</h2><p>Lessons published by your teacher.</p></div></div><div class="lesson-list lesson-library-list" id="school-lesson-library-list">${customCards}</div></section>` : ''}<div class="card empty-state lesson-library-empty" hidden>No lessons match those filters.</div></div>`;
}

export async function renderLessonsProgress() {
  const { student, progress, quizResults, profile, completedIds } = await getLearningWorkspace();
  return `${renderNav({ title: 'My progress', showBack: true, studentName: student?.name })}<div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);"><header class="lessons-page-header"><h1>My progress</h1><p>See how your learning is building over time.</p></header>${renderLessonsSubnav('progress')}<section class="progress-overview card card--glass"><h2>${profile.completionRate}% complete</h2>${renderProgressBar(completedIds.size, lessons.length, 'Core lessons completed')}<p>${completedIds.size ? 'You are making progress. Keep working through the next recommended lesson.' : 'Start your first lesson to begin tracking your progress.'}</p></section><section class="learning-section"><h2>Progress by unit</h2><div class="card unit-progress"><div><strong>${CORE_UNIT}</strong><span>${completedIds.size} completed · ${Math.max(lessons.length - completedIds.size, 0)} remaining</span></div>${renderProgressBar(completedIds.size, lessons.length, 'Progress in Introduction to Computer Systems')}</div><p class="mastery-explainer"><strong>Mastery</strong> shows how confidently your quiz and diagnostic results suggest you understand a lesson. It improves as you practise.</p></section><section class="learning-section"><h2>Lessons</h2><div class="lesson-list">${lessons.map((lesson, index) => renderLessonCard(lesson, { index, complete: completedIds.has(lesson.id), mastery: profile.lessonProfiles.find((item) => item.lessonId === lesson.id)?.masteryPercent || 0 })).join('')}</div></section><section class="learning-section"><h2>Recent quiz results</h2>${quizResults.length ? `<div class="results-list">${quizResults.slice(0, 5).map((result) => `<a class="card results-list__item" href="/quiz-results/${result.id}" data-lessons-route="/quiz-results/${result.id}"><strong>${result.score ?? 0}/${result.totalQuestions ?? 0}</strong><span>${result.completedAt ? new Date(result.completedAt).toLocaleDateString() : 'Completed quiz'}</span></a>`).join('')}</div>` : '<div class="card empty-state">Complete a lesson and take its quiz to see results here.</div>'}</section></div>`;
}

export async function renderLessonsReview() {
  const { student, profile } = await getLearningWorkspace();
  return `${renderNav({ title: 'Review', showBack: true, studentName: student?.name })}<div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);"><header class="lessons-page-header"><h1>Recommended review</h1><p>These topics can help you strengthen your understanding.</p></header>${renderLessonsSubnav('review')}<section class="learning-section">${profile.revisionQueue.length ? `<div class="lesson-list">${profile.revisionQueue.map((item) => `<button class="revision-queue__item" data-lesson-id="${item.lessonId}"><div class="revision-queue__title-row"><span class="revision-queue__item-title">${item.title}</span><span class="badge badge--warning">Priority ${item.priority}</span></div><div class="revision-queue__reason">${item.reason}</div><div class="revision-queue__action">${item.action}</div></button>`).join('')}</div>` : '<div class="card empty-state">You are on track. Continue with your next lesson to keep building your skills.</div>'}</section><section class="learning-section"><h2>Your learning path</h2><div class="adaptive-preview__list">${profile.recommendedSequence.map((entry, index) => `<button class="adaptive-preview__item" data-lesson-id="${entry.lessonId}"><div class="adaptive-preview__step">${index + 1}</div><div class="adaptive-preview__body"><div class="adaptive-preview__title">${entry.title}</div><div class="adaptive-preview__meta">${entry.masteryPercent}% mastery · ${entry.recommendedFocus}</div></div></button>`).join('')}</div></section></div>`;
}

export function bindLessonListEvents(navigate) {
  bindStudentLessonsNav(navigate, () => navigate('/'));

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

  const openDiagnosticBtn = document.getElementById('btn-open-diagnostic');
  if (openDiagnosticBtn) {
    openDiagnosticBtn.addEventListener('click', () => navigate('/diagnostic'));
  }

  document.querySelectorAll('[data-lessons-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(event.currentTarget.dataset.lessonsRoute);
    });
  });

  document.querySelectorAll('.revision-queue__item, .adaptive-preview__item').forEach((item) => {
    item.addEventListener('click', (event) => {
      const id = event.currentTarget.dataset.lessonId;
      navigate(`/lesson/${id}`);
    });
  });

  document.querySelectorAll('.lesson-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      const id = event.currentTarget.dataset.id;
      navigate(`/lesson/${id}`);
    });
  });
}

export function bindLessonLibraryEvents(navigate) {
  bindLessonListEvents(navigate);
  const search = document.getElementById('lesson-search');
  const filter = document.getElementById('lesson-status-filter');
  const applyFilters = () => {
    const query = search?.value.trim().toLowerCase() || '';
    const status = filter?.value || 'all';
    let visible = 0;
    document.querySelectorAll('.lesson-library-list .lesson-card').forEach((card) => {
      const isComplete = card.dataset.complete === 'true';
      const isSchool = card.dataset.custom === 'true';
      const matches = card.dataset.title.includes(query) && (status === 'all' || (status === 'completed' && isComplete) || (status === 'incomplete' && !isComplete) || (status === 'school' && isSchool));
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    const empty = document.querySelector('.lesson-library-empty');
    if (empty) empty.hidden = visible > 0;
  };
  const sort = document.getElementById('lesson-sort');
  const applySort = () => {
    const value = sort?.value || 'curriculum';
    document.querySelectorAll('.lesson-library-list').forEach((list) => {
      [...list.querySelectorAll('.lesson-card')].sort((a, b) => {
        if (value === 'recommended') return Number(b.dataset.recommended === 'true') - Number(a.dataset.recommended === 'true');
        if (value === 'completed') return Number(b.dataset.complete === 'true') - Number(a.dataset.complete === 'true');
        if (value === 'school') return Number(b.dataset.custom === 'true') - Number(a.dataset.custom === 'true');
        return 0;
      }).forEach((card) => list.append(card));
    });
  };
  search?.addEventListener('input', applyFilters);
  filter?.addEventListener('change', applyFilters);
  sort?.addEventListener('change', applySort);
}

export function bindLessonsProgressEvents(navigate) { bindLessonListEvents(navigate); }
export function bindLessonsReviewEvents(navigate) { bindLessonListEvents(navigate); }

export async function renderLessonDetail(lessonId) {
  const student = getCurrentStudent();
  const customLessonId = typeof lessonId === 'string' && lessonId.startsWith('custom-') ? Number.parseInt(lessonId.slice(7), 10) : null;
  const customLesson = customLessonId ? (await getAllCustomLessons()).find((entry) => entry.id === customLessonId) : null;
  const isCustomLesson = !!customLesson;
  const lesson = customLesson || lessons.find((entry) => entry.id === lessonId);

  if (!lesson) {
    return '<div class="container" style="padding: 2rem;">Lesson not found.</div>';
  }

  const lessonIndex = lessons.indexOf(lesson);
  const isComplete = student ? await isLessonComplete(student.id, lessonId) : false;
  const illustration = isCustomLesson && !isSafeIllustrationSource(lesson.illustration?.src) ? null : (isCustomLesson ? lesson.illustration : lessonIllustrations[lessonId]);
  const progress = student ? await getProgressForStudent(student.id) : [];
  const results = student ? await getQuizResultsForStudent(student.id) : [];
  const diagnostic = student ? await getLatestDiagnosticForStudent(student.id) : null;
  const profile = buildStudentProfile({
    diagnostic,
    results,
    progressRecords: progress
  });
  const lessonProfile = profile.lessonProfiles.find((entry) => entry.lessonId === lessonId);
  const customKeyTerms = (lesson.keyTerms || []).map((term) => {
    if (typeof term !== 'string') return term;
    const [word, ...definition] = term.split(/\s[-–—]\s/);
    return { word, definition: definition.join(' - ') };
  });
  const lessonContent = isCustomLesson ? renderCustomLessonContent(lesson.content) : lesson.content;
  const outline = getLessonOutline(lessonContent);

  return `
    ${renderNav({ title: 'Lesson', showBack: true, backLabel: 'My learning', studentName: student?.name })}

    <div class="container container--narrow view-enter lesson-page">
       ${isCustomLesson ? '<div class="custom-lesson-banner">Teacher-created curriculum lesson</div>' : renderProgressBar(lessonIndex + 1, lessons.length, `Lesson ${lessonIndex + 1} of ${lessons.length}`)}
       ${!isCustomLesson ? `<div class="lesson-progress-strip">
        ${lessons.map((entry, index) => `
          <div class="lesson-progress-pip ${index === lessonIndex ? 'lesson-progress-pip--current' : ''} ${index < lessonIndex ? 'lesson-progress-pip--completed' : ''}"></div>
        `).join('')}
       </div>` : ''}

       <div class="lesson-header">
         <nav class="lesson-breadcrumb" aria-label="Breadcrumb"><a href="/lessons" data-lessons-route="/lessons">My learning</a><span aria-hidden="true">/</span><a href="/lessons/library" data-lessons-route="/lessons/library">${isCustomLesson ? 'School lessons' : CORE_UNIT}</a><span aria-hidden="true">/</span><span aria-current="page">${isCustomLesson ? esc(lesson.title) : lesson.title}</span></nav>
        <div class="lesson-header__meta">
           <span class="lesson-header__number">${isCustomLesson ? esc(lesson.subject || 'Custom lesson') : `Lesson ${lessonIndex + 1}`}</span>
           ${lesson.duration ? `<span class="badge badge--neutral">${lesson.duration}</span>` : ''}
           ${!isCustomLesson ? `<span class="badge badge--${lessonProfile?.status === 'mastered' ? 'success' : lessonProfile?.status === 'growing' ? 'accent' : 'warning'}">${lessonProfile?.masteryPercent || 0}% mastery</span>` : ''}
        </div>
         <h1 class="lesson-header__title">${isCustomLesson ? esc(lesson.title) : lesson.title}</h1>

        <div class="lesson-header__objectives">
           ${(lesson.objectives || []).map((objective) => `
             <div class="lesson-header__objective">${isCustomLesson ? esc(objective) : objective}</div>
          `).join('')}
        </div>
        <button class="btn btn--secondary btn--sm" id="btn-read-lesson">Listen to lesson</button>
      </div>

       <div class="lesson-content">
         ${outline.length ? `<details class="lesson-outline"><summary>Lesson outline</summary><ol>${outline.map((item) => `<li class="lesson-outline__item lesson-outline__item--${item.level}"><a href="#${item.id}" data-outline-target="${item.id}">${esc(item.title)}</a></li>`).join('')}</ol></details>` : ''}
        <div class="lesson-support card card--glass">
          <div>
            <div class="lesson-support__title">Need help with this lesson?</div>
             <div class="lesson-support__text">${isCustomLesson ? 'Use the AI Tutor for help understanding this classroom lesson.' : lessonProfile?.recommendedFocus || 'Use the AI Tutor for an explanation before you take the quiz.'}</div>
          </div>
          <button class="btn btn--accent btn--sm" id="btn-ask-tutor">Ask AI Tutor</button>
        </div>

        ${illustration ? `
          <figure class="lesson-image">
            <img src="${illustration.src}" alt="${esc(illustration.alt)}" loading="lazy">
            <figcaption class="lesson-image__caption">${esc(illustration.caption)}</figcaption>
          </figure>
        ` : ''}
          <div id="lesson-body">${lessonContent}</div>

        ${lesson.keyTerms?.length ? `
          <div class="key-terms">
            <div class="key-terms__title">Key Terms to Remember</div>
            <div class="key-terms__list">
           ${customKeyTerms.map((term) => `
                <div class="key-term">
                   <div class="key-term__word">${isCustomLesson ? esc(term.word) : term.word}</div>
                   <div class="key-term__def">${isCustomLesson ? esc(term.definition) : term.definition}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="lesson-actions">
        <div class="lesson-actions__nav">
           ${!isCustomLesson && lessonIndex > 0 ? '<button class="btn btn--ghost" id="btn-prev-lesson">Previous lesson</button>' : '<a class="btn btn--ghost" href="/lessons" data-lessons-route="/lessons">Back to My learning</a>'}
        </div>

        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: flex-end;">
          ${!isComplete ? `
            <button class="btn btn--primary" id="btn-mark-complete">Mark as Complete</button>
          ` : `
            <span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
              Completed
            </span>
          `}

           ${!isCustomLesson ? `<button class="btn btn--accent" id="btn-take-quiz" ${!isComplete ? 'disabled title="Complete lesson first"' : ''}>Take Adaptive Quiz</button>` : ''}
           ${!isCustomLesson && lessonIndex < lessons.length - 1 ? `<button class="btn btn--secondary" id="btn-next-lesson">Next lesson</button>` : ''}
        </div>
      </div>
      <p class="sr-only" id="lesson-completion-status" role="status" aria-live="polite"></p>
    </div>
  `;
}

export function bindLessonDetailEvents(navigate, lessonId) {
  bindStudentLessonsNav(navigate, () => navigate('/lessons'));

  const student = getCurrentStudent();
  const lesson = lessons.find((entry) => entry.id === lessonId);
  const lessonIndex = lessons.indexOf(lesson);
  const completeBtn = document.getElementById('btn-mark-complete');
  const quizBtn = document.getElementById('btn-take-quiz');
  const prevBtn = document.getElementById('btn-prev-lesson');
  const nextBtn = document.getElementById('btn-next-lesson');

  document.querySelectorAll('[data-lessons-route]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    navigate(event.currentTarget.dataset.lessonsRoute);
  }));
  document.querySelectorAll('#lesson-body h2, #lesson-body h3').forEach((heading, index) => { heading.id = `lesson-section-${index + 1}`; });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      navigate(`/lesson/${lessons[lessonIndex - 1].id}`);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigate(`/lesson/${lessons[lessonIndex + 1].id}`));
  }

  if (completeBtn && student) {
    completeBtn.addEventListener('click', async () => {
      await markLessonComplete(student.id, lessonId);
      completeBtn.outerHTML = '<span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">Completed</span>';
      const completionStatus = document.getElementById('lesson-completion-status');
      if (completionStatus) completionStatus.textContent = 'Lesson completed. Your adaptive quiz is now available.';
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
  document.querySelectorAll('.lesson-content p, .key-term').forEach((target, index) => {
    target.id = `lesson-read-aloud-${index + 1}`;
    const label = target.classList.contains('key-term') ? 'Read key term aloud' : 'Read paragraph aloud';
    target.insertAdjacentHTML('beforeend', `<button class="read-aloud-button" type="button" data-read-aloud-target="${target.id}" aria-label="${label}" aria-pressed="false">Listen</button>`);
  });
  bindReadAloudControls(document.querySelector('.lesson-page'));
  const readBtn = document.getElementById('btn-read-lesson');
  if (readBtn) {
    readBtn.addEventListener('click', () => {
      if (readBtn.dataset.reading === 'true') { stopSpeaking(); readBtn.dataset.reading = 'false'; readBtn.textContent = 'Listen to lesson'; return; }
      const lessonPage = document.querySelector('.lesson-page');
      const lessonClone = lessonPage?.cloneNode(true);
      lessonClone?.querySelectorAll('[data-read-aloud-target]').forEach((control) => control.remove());
      const lessonText = lessonClone?.textContent || lesson?.title || 'Lesson';
      speak(lessonText);
      readBtn.dataset.reading = 'true'; readBtn.textContent = 'Stop listening';
    });
  }
  if (tutorBtn) {
    tutorBtn.addEventListener('click', () => {
      navigate('/tutor');
    });
  }
}
