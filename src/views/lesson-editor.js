import { renderNav, bindNavEvents } from '../components/nav.js';
import { exportLessonPack, getAllCustomLessons, importLessonPack, saveCustomLesson } from '../engine/storage.js';
import { showToast } from '../components/ui.js';

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function downloadPack(pack) {
  const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `classconnect-${new Date().toISOString().slice(0, 10)}.ccpack`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function renderLessonEditor() {
  const items = await getAllCustomLessons();
  return `${renderNav({ title: 'Lesson CMS', showBack: true, showLogout: true })}
    <main class="container container--narrow view-enter cms-page">
      <div class="card">
        <h1 class="card__title">Create a custom lesson</h1>
        <p class="card__subtitle">Lessons are stored locally and shared as portable ClassConnect lesson packs.</p>
        <div class="cms-actions"><button class="btn btn--secondary btn--sm" id="btn-export-pack">Export .ccpack</button><label class="btn btn--ghost btn--sm">Import .ccpack<input id="cms-import-pack" type="file" accept=".ccpack,application/json" hidden></label></div>
        <form id="lesson-editor-form" class="cms-form">
          <input class="input" id="cms-title" required placeholder="Lesson title">
          <div class="cms-grid"><input class="input" id="cms-strand" placeholder="Strand (e.g. Networks)"><input class="input" id="cms-subject" placeholder="Subject (e.g. Computing)"></div>
          <textarea class="input" id="cms-objectives" rows="3" placeholder="Objectives, one per line"></textarea>
          <textarea class="input" id="cms-terms" rows="3" placeholder="Key terms: term — definition, one per line"></textarea>
          <textarea class="input" id="cms-body" rows="12" required placeholder="Lesson body (Markdown or safe HTML)"></textarea>
          <button class="btn btn--primary" type="submit">Save lesson</button>
        </form>
      </div>
      <section class="card cms-list"><h2>Saved custom lessons</h2>${items.length ? items.map((item) => `<article><strong>${esc(item.title)}</strong><span>${esc(item.subject || 'Computing')} · ${esc(item.strand || 'Unassigned')}</span></article>`).join('') : '<p class="insight-empty">No custom lessons yet.</p>'}</section>
    </main>`;
}

export function bindLessonEditorEvents(navigate) {
  bindNavEvents({ onBack: () => navigate('/dashboard') });
  document.getElementById('lesson-editor-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = (id) => document.getElementById(id).value.trim();
    await saveCustomLesson({ title: value('cms-title'), strand: value('cms-strand'), subject: value('cms-subject'), objectives: value('cms-objectives').split('\n').filter(Boolean), keyTerms: value('cms-terms').split('\n').filter(Boolean), content: value('cms-body') });
    showToast('Custom lesson saved locally.', 'success');
    navigate('/lesson-editor');
  });
  document.getElementById('btn-export-pack')?.addEventListener('click', async () => downloadPack(await exportLessonPack()));
  document.getElementById('cms-import-pack')?.addEventListener('change', async (event) => {
    try {
      const pack = JSON.parse(await event.target.files[0].text());
      const summary = await importLessonPack(pack);
      showToast(`${summary.lessons} lessons and ${summary.questions} questions imported.`, 'success');
      navigate('/lesson-editor');
    } catch (error) { showToast(error.message || 'Could not import that lesson pack.', 'error'); }
  });
}
