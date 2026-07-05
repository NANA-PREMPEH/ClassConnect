/**
 * ClassConnect - AI Tutor View
 * Provides a conversational tutor with student-specific memory and recommendations.
 */

import { renderNav, bindNavEvents } from '../components/nav.js';
import { showToast } from '../components/ui.js';
import {
  clearTutorThread,
  getCurrentStudent,
  getLatestDiagnosticForStudent,
  getProgressForStudent,
  getQuizResultsForStudent,
  getTutorThread,
  saveTutorThread
} from '../engine/storage.js';
import { buildStudentProfile } from '../engine/personalization.js';
import { generateTutorReply } from '../engine/ai-tutor.js';

const starterPrompts = [
  'What should I study next?',
  'Explain RAM and storage in simple words.',
  'Help me review my weakest topic.'
];

let tutorState = {
  studentId: null,
  messages: [],
  sending: false
};

function escapeHTML(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function ensureTutorState(studentId) {
  if (tutorState.studentId === studentId) return;

  const thread = await getTutorThread(studentId);
  tutorState = {
    studentId,
    messages: thread?.messages || [],
    sending: false
  };
}

function renderTutorMessages() {
  if (!tutorState.messages.length) {
    return `
      <div class="tutor-empty">
        <div class="tutor-empty__title">Your tutor is ready</div>
        <p class="tutor-empty__text">Ask for an explanation, revision tip, or what to study next. The tutor will answer using your lesson history and diagnostic profile.</p>
      </div>
    `;
  }

  return tutorState.messages.map((message) => `
    <div class="chat-bubble chat-bubble--${message.role}">
      <div class="chat-bubble__role">${message.role === 'assistant' ? 'AI Tutor' : 'You'}</div>
      <div class="chat-bubble__text">${escapeHTML(message.content)}</div>
      ${message.source ? `<div class="chat-bubble__meta">${message.source === 'ai' ? 'AI response' : 'Offline support response'}</div>` : ''}
    </div>
  `).join('');
}

export async function renderTutor() {
  const student = getCurrentStudent();
  if (!student) {
    return '<div class="container" style="padding: 2rem;">Student session not found.</div>';
  }

  await ensureTutorState(student.id);

  const diagnostic = await getLatestDiagnosticForStudent(student.id);
  const progressRecords = await getProgressForStudent(student.id);
  const quizResults = await getQuizResultsForStudent(student.id);
  const profile = buildStudentProfile({
    diagnostic,
    results: quizResults,
    progressRecords
  });

  return `
    ${renderNav({ title: 'AI Tutor', showBack: true, studentName: student.name })}
    <div class="container container--narrow view-enter tutor-page">
      <div class="card card--glass tutor-hero">
        <div class="tutor-hero__header">
          <div>
            <div class="diagnostic-hero__eyebrow">Context-aware tutor with memory</div>
            <h1 class="tutor-hero__title">Ask for help at your own pace</h1>
          </div>
          ${tutorState.messages.length ? '<button class="btn btn--ghost btn--sm" id="btn-clear-chat">Clear chat</button>' : ''}
        </div>

        <div class="tutor-hero__chips">
          <span class="badge badge--${profile.readiness.tone}">${profile.readiness.label}</span>
          <span class="badge badge--primary">Next: ${profile.recommendedNext?.title || 'Lesson 1'}</span>
          <span class="badge badge--neutral">Risk: ${profile.risk.label}</span>
        </div>

        <p class="tutor-hero__memory">
          I remember that your strongest current evidence is in <strong>${profile.strengths[0]?.title || 'the topics you have already practiced'}</strong>,
          while the biggest focus area is <strong>${profile.knowledgeGaps[0]?.title || profile.recommendedNext?.title || 'the next lesson in your path'}</strong>.
        </p>
      </div>

      <div class="card tutor-thread-card">
        <div class="tutor-thread" id="tutor-thread">
          ${renderTutorMessages()}
          ${tutorState.sending ? '<div class="chat-bubble chat-bubble--assistant"><div class="chat-bubble__role">AI Tutor</div><div class="shimmer" style="height: 52px;"></div></div>' : ''}
        </div>

        <div class="tutor-prompts">
          ${starterPrompts.map((prompt) => `
            <button class="tutor-prompt" data-prompt="${prompt}">${prompt}</button>
          `).join('')}
        </div>

        <form class="tutor-composer" id="tutor-form">
          <textarea id="tutor-input" class="input tutor-composer__input" rows="3" placeholder="Ask a question about a lesson, concept, or what to study next..." ${tutorState.sending ? 'disabled' : ''}></textarea>
          <button class="btn btn--primary" type="submit" ${tutorState.sending ? 'disabled' : ''}>Send</button>
        </form>
      </div>
    </div>
  `;
}

export function bindTutorEvents(navigate, renderCurrentView) {
  bindNavEvents({ onBack: () => navigate('/lessons') });

  const form = document.getElementById('tutor-form');
  const input = document.getElementById('tutor-input');
  const clearButton = document.getElementById('btn-clear-chat');
  const thread = document.getElementById('tutor-thread');

  if (thread) {
    thread.scrollTop = thread.scrollHeight;
  }

  if (clearButton) {
    clearButton.addEventListener('click', async () => {
      const student = getCurrentStudent();
      if (!student) return;

      await clearTutorThread(student.id);
      tutorState = {
        studentId: student.id,
        messages: [],
        sending: false
      };
      await renderCurrentView();
    });
  }

  document.querySelectorAll('.tutor-prompt').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const prompt = event.currentTarget.dataset.prompt;
      if (!prompt) return;
      await sendTutorMessage(prompt, renderCurrentView);
    });
  });

  if (form && input) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) {
        showToast('Type a question for the tutor first.', 'error');
        return;
      }

      await sendTutorMessage(message, renderCurrentView);
    });
  }
}

async function sendTutorMessage(message, renderCurrentView) {
  const student = getCurrentStudent();
  if (!student || tutorState.sending) return;

  const diagnostic = await getLatestDiagnosticForStudent(student.id);
  const progressRecords = await getProgressForStudent(student.id);
  const quizResults = await getQuizResultsForStudent(student.id);
  const profile = buildStudentProfile({
    diagnostic,
    results: quizResults,
    progressRecords
  });

  const userMessage = {
    role: 'user',
    content: message,
    createdAt: new Date().toISOString()
  };

  tutorState = {
    ...tutorState,
    sending: true,
    messages: [...tutorState.messages, userMessage]
  };

  await saveTutorThread(student.id, tutorState.messages);
  await renderCurrentView();

  const reply = await generateTutorReply({
    student,
    message,
    history: tutorState.messages,
    profile
  });

  tutorState = {
    ...tutorState,
    sending: false,
    messages: [
      ...tutorState.messages,
      {
        role: 'assistant',
        content: reply.text,
        source: reply.source,
        createdAt: new Date().toISOString()
      }
    ]
  };

  await saveTutorThread(student.id, tutorState.messages);
  await renderCurrentView();
}
