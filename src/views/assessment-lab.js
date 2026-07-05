/**
 * ClassConnect - Teacher Assessment Lab
 * Lets teachers generate assessments and inspect item analysis and integrity flags.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { showModal, showToast } from '../components/ui.js';
import { getAssessmentBlueprintOptions, generateAssessment } from '../engine/assessment-generator.js';
import {
  getAllAssessments,
  getAllAssessmentSubmissions,
  getAllStudents,
  saveAssessment
} from '../engine/storage.js';
import { buildAssessmentOverview } from '../engine/item-analysis.js';

function countByType(questions, type) {
  return questions.filter((question) => question.type === type).length;
}

function renderLessonChecklist() {
  const lessonOptions = getAssessmentBlueprintOptions();
  return lessonOptions.map((lesson) => `
    <label class="assessment-check">
      <input type="checkbox" name="lesson-id" value="${lesson.lessonId}" ${lesson.lessonId <= 3 ? 'checked' : ''}>
      <span class="assessment-check__body">
        <span class="assessment-check__title">Lesson ${lesson.lessonId}: ${lesson.title}</span>
        <span class="assessment-check__meta">${lesson.objectives.length} objectives available</span>
      </span>
    </label>
  `).join('');
}

function renderAssessmentCards(assessments, submissions) {
  if (!assessments.length) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">Assess</div>
        <h2 class="empty-state__title">No Assessments Yet</h2>
        <p class="empty-state__text">Generate your first AI-powered assessment blueprint to publish it to the student assessment center.</p>
      </div>
    `;
  }

  return assessments.map((assessment) => {
    const assessmentSubmissions = submissions.filter((submission) => submission.assessmentId === assessment.id);
    const overview = buildAssessmentOverview(assessment, assessmentSubmissions);

    return `
      <div class="card assessment-admin-card">
        <div class="assessment-admin-card__header">
          <div>
            <div class="assessment-admin-card__eyebrow">${assessment.generatedBy === 'ai' ? 'AI generated' : 'Objective-based fallback'}</div>
            <h3 class="assessment-admin-card__title">${assessment.title}</h3>
            <p class="assessment-admin-card__meta">${assessment.durationMinutes} min | ${assessment.questions.length} questions | ${assessment.objectiveCoverage.length} objectives covered</p>
          </div>
          <div class="assessment-admin-card__badges">
            <span class="badge badge--primary">${countByType(assessment.questions, 'mcq')} MCQ</span>
            <span class="badge badge--accent">${countByType(assessment.questions, 'short')} Short</span>
            <span class="badge badge--warning">${countByType(assessment.questions, 'code')} Code</span>
          </div>
        </div>

        <div class="assessment-admin-card__metrics">
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${overview.submissionCount}</span>
            <span class="assessment-admin-card__metric-label">Submissions</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${overview.averagePercentage}%</span>
            <span class="assessment-admin-card__metric-label">Average Score</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${overview.flaggedIntegrityCount}</span>
            <span class="assessment-admin-card__metric-label">High AI Risk</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${overview.flaggedProctorCount}</span>
            <span class="assessment-admin-card__metric-label">High Proctor Alerts</span>
          </div>
        </div>

        <div class="assessment-admin-card__footer">
          <span class="badge badge--neutral">${assessment.advancedFeature || 'Advanced feature enabled'}</span>
          <button class="btn btn--ghost btn--sm btn-view-analysis" data-assessment-id="${assessment.id}">View Analysis</button>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHTML(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function openAssessmentAnalysisModal(assessmentId) {
  const assessments = await getAllAssessments();
  const submissions = await getAllAssessmentSubmissions();
  const students = await getAllStudents();
  const assessment = assessments.find((entry) => entry.id === assessmentId);
  if (!assessment) return;

  const assessmentSubmissions = submissions.filter((submission) => submission.assessmentId === assessment.id);
  const overview = buildAssessmentOverview(assessment, assessmentSubmissions);

  const flaggedRows = assessmentSubmissions
    .filter((submission) => submission.integrity?.label !== 'Low' || submission.proctor?.label !== 'Low')
    .map((submission) => {
      const student = students.find((entry) => entry.id === submission.studentId);
      return `
        <tr>
          <td>${student?.name || 'Unknown'}</td>
          <td>${submission.grading?.percentage || 0}%</td>
          <td>${submission.integrity?.label || 'Low'} (${submission.integrity?.score || 0})</td>
          <td>${submission.proctor?.label || 'Low'} (${submission.proctor?.anomalyScore || 0})</td>
        </tr>
      `;
    }).join('');

  const html = `
    <div class="analysis-modal">
      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Objective Coverage</h4>
        <div class="analysis-modal__chips">
          ${assessment.objectiveCoverage.map((entry) => `
            <span class="badge badge--neutral">${escapeHTML(entry.lessonTitle || `Lesson ${entry.lessonId}`)}: ${escapeHTML(entry.objective)}</span>
          `).join('')}
        </div>
      </div>

      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Item Analysis</h4>
        <div class="student-detail__table-wrap">
          <table class="student-detail__table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Discrimination</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${overview.itemAnalysis.map((item, index) => `
                <tr>
                  <td>Q${index + 1}</td>
                  <td>${item.type}</td>
                  <td>${item.difficultyIndex}</td>
                  <td>${item.discriminationIndex}</td>
                  <td>${item.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Flagged Submissions</h4>
        ${flaggedRows ? `
          <div class="student-detail__table-wrap">
            <table class="student-detail__table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Score</th>
                  <th>AI / Style Risk</th>
                  <th>Proctoring</th>
                </tr>
              </thead>
              <tbody>${flaggedRows}</tbody>
            </table>
          </div>
        ` : '<div class="insight-empty">No submissions are currently flagged.</div>'}
      </div>
    </div>
  `;

  showModal(assessment.title, html, [{ label: 'Close', variant: 'btn--ghost' }], { modalClass: 'modal--wide' });
}

export async function renderAssessmentLab() {
  const assessments = (await getAllAssessments())
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  const submissions = await getAllAssessmentSubmissions();

  return `
    ${renderNav({ title: 'Assessment Lab', showBack: true, showSettings: false, showLogout: false })}
    <div class="container view-enter assessment-lab-page" style="padding-top: var(--space-6);">
      <div class="card card--glass assessment-hero">
        <div class="assessment-hero__eyebrow">AI-powered assessment platform</div>
        <h1 class="assessment-hero__title">Generate, grade, protect, and analyze assessments</h1>
        <p class="assessment-hero__text">Create multiple-choice, short answer, and coding tasks from lesson objectives. ClassConnect will grade open responses, estimate AI-writing risk, monitor browser anomalies, and compute item analysis automatically.</p>
      </div>

      <div class="assessment-lab-layout">
        <div class="card assessment-builder-card">
          <h2 class="assessment-builder-card__title">AI Question Generator</h2>
          <p class="assessment-builder-card__subtitle">Build an assessment blueprint from selected lessons. If Gemini is available, the app will try AI generation first and fall back locally if needed.</p>

          <form id="assessment-builder-form" class="assessment-builder-form">
            <div class="input-group">
              <label for="assessment-title">Assessment Title</label>
              <input id="assessment-title" class="input" type="text" value="Mid-Unit Computing Assessment" minlength="4" required>
            </div>

            <div class="assessment-builder-form__grid">
              <div class="input-group">
                <label for="assessment-duration">Duration (minutes)</label>
                <input id="assessment-duration" class="input" type="number" min="10" value="25">
              </div>
              <div class="input-group">
                <label for="assessment-mcq-count">MCQ Count</label>
                <input id="assessment-mcq-count" class="input" type="number" min="0" value="4">
              </div>
              <div class="input-group">
                <label for="assessment-short-count">Short Answer Count</label>
                <input id="assessment-short-count" class="input" type="number" min="0" value="2">
              </div>
              <div class="input-group">
                <label for="assessment-code-count">Coding Count</label>
                <input id="assessment-code-count" class="input" type="number" min="0" value="1">
              </div>
            </div>

            <div class="input-group">
              <label>Lesson Objective Coverage</label>
              <div class="assessment-checklist">
                ${renderLessonChecklist()}
              </div>
            </div>

            <div class="assessment-builder-form__actions">
              <button class="btn btn--primary btn--lg" type="submit">Generate and Publish Assessment</button>
            </div>
          </form>
        </div>

        <div class="assessment-admin-panel">
          <div class="assessment-admin-panel__header">
            <h2 class="assessment-builder-card__title">Published Assessments</h2>
            <p class="assessment-builder-card__subtitle">Students will see these in the local Assessment Center on this device.</p>
          </div>
          <div class="assessment-admin-list">
            ${renderAssessmentCards(assessments, submissions)}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindAssessmentLabEvents(navigate) {
  bindNavEvents({ onBack: () => navigate('/dashboard') });

  const form = document.getElementById('assessment-builder-form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const lessonIds = [...document.querySelectorAll('input[name="lesson-id"]:checked')]
        .map((input) => Number.parseInt(input.value, 10))
        .filter(Boolean);

      const config = {
        title: document.getElementById('assessment-title')?.value || '',
        durationMinutes: document.getElementById('assessment-duration')?.value || '25',
        mcqCount: document.getElementById('assessment-mcq-count')?.value || '0',
        shortAnswerCount: document.getElementById('assessment-short-count')?.value || '0',
        codingCount: document.getElementById('assessment-code-count')?.value || '0',
        lessonIds
      };

      const totalQuestions = Number.parseInt(config.mcqCount, 10)
        + Number.parseInt(config.shortAnswerCount, 10)
        + Number.parseInt(config.codingCount, 10);

      if (lessonIds.length === 0) {
        showToast('Choose at least one lesson for the blueprint.', 'error');
        return;
      }

      if (totalQuestions <= 0) {
        showToast('Add at least one question to the assessment.', 'error');
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Generating...';
      }

      try {
        const assessment = await generateAssessment(config);
        await saveAssessment(assessment);
        showToast(`Assessment published with ${assessment.questions.length} questions.`, 'success');
        await navigate('/assessment-lab');
      } catch (error) {
        console.error(error);
        showToast('Assessment generation failed. Please try again.', 'error');
        if (button) {
          button.disabled = false;
          button.textContent = 'Generate and Publish Assessment';
        }
      }
    });
  }

  document.querySelectorAll('.btn-view-analysis').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const assessmentId = Number.parseInt(event.currentTarget.dataset.assessmentId, 10);
      await openAssessmentAnalysisModal(assessmentId);
    });
  });
}
