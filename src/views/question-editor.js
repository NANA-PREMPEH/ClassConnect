import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderStaffShell, bindStaffShell } from '../components/staff-shell.js';
import { getAllQuestionBankItems, saveQuestionBankItem } from '../engine/storage.js';
import { showToast } from '../components/ui.js';

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function renderQuestionItem(item) {
  return `<article class="cms-list__item question-bank-item">
    <div><strong>${esc(item.type)} - ${esc(item.bloom || 'Knowledge')}</strong><span>${esc(item.prompt)}</span></div>
    <button class="btn btn--ghost btn--sm btn-edit-question" type="button" data-question-id="${item.id}">Edit</button>
  </article>`;
}

export async function renderQuestionEditor() {
  const items = await getAllQuestionBankItems();
  const content = `<main class="container container--narrow view-enter cms-page">
      <div class="card"><h1 class="card__title" id="question-editor-title">Author a question</h1>
        <p class="card__subtitle">Save reusable questions, then choose them directly in the Assessment Lab.</p>
        <form id="question-editor-form" class="cms-form">
          <input id="question-id" type="hidden">
          <div class="cms-grid"><select class="input" id="question-type"><option value="mcq">Multiple choice</option><option value="true-false">True / False</option><option value="fill-blank">Fill in the blank</option><option value="short">Short answer</option><option value="code">Coding</option></select><select class="input" id="question-bloom"><option>Knowledge</option><option>Comprehension</option><option>Application</option><option>Analysis</option></select></div>
          <div class="cms-grid"><label class="cms-field-label">Curriculum lesson<select class="input" id="question-lesson"><option value="">General / not tied to a lesson</option><option value="1">Lesson 1</option><option value="2">Lesson 2</option><option value="3">Lesson 3</option><option value="4">Lesson 4</option><option value="5">Lesson 5</option></select></label><label class="cms-field-label">IRT difficulty (-3 to +3)<input class="input" id="question-difficulty" type="number" min="-3" max="3" step="0.1" value="0"></label></div>
          <textarea class="input" id="question-prompt" required rows="4" placeholder="Question prompt"></textarea>
          <textarea class="input" id="question-options" rows="4" placeholder="Options, one per line (MCQ only)"></textarea>
          <input class="input" id="question-answer" placeholder="Correct answer / answer key">
          <div class="cms-actions"><button class="btn btn--primary" id="btn-save-question">Save question</button><button class="btn btn--ghost" id="btn-cancel-question-edit" type="button" hidden>Cancel edit</button></div>
        </form>
      </div>
      <section class="card cms-list"><h2>Saved questions</h2>${items.length ? items.map(renderQuestionItem).join('') : '<p class="insight-empty">No custom questions yet.</p>'}</section>
    </main>`;
  return renderStaffShell({ title: 'Question bank', subtitle: 'Author and reuse assessment questions for the curriculum.', activePath: '/lesson-editor', content });
}

export function bindQuestionEditorEvents(navigate) {
  bindStaffShell(navigate);
  const form = document.getElementById('question-editor-form');
  const value = (id) => document.getElementById(id)?.value.trim() || '';
  const resetForm = () => {
    form?.reset();
    document.getElementById('question-id').value = '';
    document.getElementById('question-editor-title').textContent = 'Author a question';
    document.getElementById('btn-save-question').textContent = 'Save question';
    document.getElementById('btn-cancel-question-edit').hidden = true;
  };
  document.querySelectorAll('.btn-edit-question').forEach((button) => button.addEventListener('click', async () => {
    const item = (await getAllQuestionBankItems()).find((question) => question.id === Number(button.dataset.questionId));
    if (!item) return;
    document.getElementById('question-id').value = item.id;
    document.getElementById('question-type').value = item.type || 'mcq';
    document.getElementById('question-bloom').value = item.bloom || 'Knowledge';
    document.getElementById('question-lesson').value = item.lessonId || '';
    document.getElementById('question-prompt').value = item.prompt || '';
    document.getElementById('question-options').value = (item.options || []).join('\n');
    document.getElementById('question-answer').value = item.answer || '';
    document.getElementById('question-difficulty').value = item.difficulty ?? 0;
    document.getElementById('question-editor-title').textContent = 'Edit saved question';
    document.getElementById('btn-save-question').textContent = 'Save changes';
    document.getElementById('btn-cancel-question-edit').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
  document.getElementById('btn-cancel-question-edit')?.addEventListener('click', resetForm);
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = Number(value('question-id')) || undefined;
    await saveQuestionBankItem({ id, type: value('question-type'), bloom: value('question-bloom'), lessonId: Number(value('question-lesson')) || null, prompt: value('question-prompt'), options: value('question-options').split('\n').map((entry) => entry.trim()).filter(Boolean), answer: value('question-answer'), difficulty: Number(value('question-difficulty')) });
    showToast(id ? 'Question updated.' : 'Question saved to the local bank.', 'success');
    navigate('/question-editor');
  });
}
