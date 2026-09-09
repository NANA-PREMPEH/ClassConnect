import { renderNav, bindNavEvents } from '../components/nav.js';
import { renderStaffShell, bindStaffShell } from '../components/staff-shell.js';
import { exportLessonPack, getAllCustomLessons, importLessonPack, saveCustomLesson } from '../engine/storage.js';
import { showToast } from '../components/ui.js';
import { createLessonPackArchive, readLessonPackArchive } from '../engine/lesson-pack.js';

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const illustrationChoices = [
  { value: '', label: 'No illustration' },
  { value: '/images/lesson-1-computer-types.png', label: 'Computer types' },
  { value: '/images/lesson-2-inside-computer.png', label: 'Inside a computer' },
  { value: '/images/lesson-3-input-devices.png', label: 'Input devices' },
  { value: '/images/lesson-4-output-devices.png', label: 'Output devices' },
  { value: '/images/lesson-5-storage-devices.png', label: 'Storage devices' }
];

function downloadPack(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `classconnect-${new Date().toISOString().slice(0, 10)}.ccpack`;
  link.click();
  URL.revokeObjectURL(url);
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The illustration could not be read.'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export async function renderLessonEditor() {
  const items = await getAllCustomLessons();
  const content = `<main class="container container--narrow view-enter cms-page">
      <div class="card">
        <h1 class="card__title">Create a custom lesson</h1>
        <p class="card__subtitle">Lessons are stored locally and shared as portable ClassConnect lesson packs.</p>
        <div class="cms-actions"><button class="btn btn--secondary btn--sm" id="btn-export-pack">Export .ccpack</button><label class="btn btn--ghost btn--sm">Import .ccpack<input id="cms-import-pack" type="file" accept=".ccpack,application/json" hidden></label></div>
        <form id="lesson-editor-form" class="cms-form">
          <input class="input" id="cms-title" required placeholder="Lesson title">
          <div class="cms-grid"><input class="input" id="cms-strand" placeholder="Strand (e.g. Networks)"><input class="input" id="cms-subject" placeholder="Subject (e.g. Computing)"></div>
          <textarea class="input" id="cms-objectives" rows="3" placeholder="Objectives, one per line"></textarea>
          <textarea class="input" id="cms-terms" rows="3" placeholder="Key terms: term - definition, one per line"></textarea>
          <textarea class="input" id="cms-body" rows="12" required placeholder="Lesson body (Markdown or safe HTML)"></textarea>
          <fieldset class="cms-illustration">
            <legend>Lesson illustration <span>optional</span></legend>
            <p class="cms-illustration__help">Select a curriculum visual or upload a classroom image (PNG, JPEG, WebP, or GIF; up to 2 MB).</p>
            <div class="cms-grid">
              <label class="cms-field-label">Curriculum visual<select class="input" id="cms-illustration-choice">${illustrationChoices.map((choice) => `<option value="${choice.value}">${choice.label}</option>`).join('')}</select></label>
              <label class="cms-field-label">Upload a new image<input class="input" id="cms-illustration-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label>
            </div>
            <div class="cms-grid"><input class="input" id="cms-illustration-alt" placeholder="Image description for screen readers"><input class="input" id="cms-illustration-caption" placeholder="Optional image caption"></div>
            <div class="cms-illustration__preview" id="cms-illustration-preview" hidden><img alt=""><span></span></div>
          </fieldset>
          <button class="btn btn--primary" type="submit">Save lesson</button>
        </form>
      </div>
      <section class="card cms-list"><h2>Saved custom lessons</h2>${items.length ? items.map((item) => `<article class="cms-list__item">${item.illustration?.src ? `<img class="cms-list__thumbnail" src="${esc(item.illustration.src)}" alt="">` : ''}<div><strong>${esc(item.title)}</strong><span>${esc(item.subject || 'Computing')} - ${esc(item.strand || 'Unassigned')}</span></div></article>`).join('') : '<p class="insight-empty">No custom lessons yet.</p>'}</section>
    </main>`;
  return renderStaffShell({ title: 'Curriculum', subtitle: 'Create portable lessons, illustrations, and curriculum packs.', activePath: '/lesson-editor', content });
}

export function bindLessonEditorEvents(navigate) {
  bindStaffShell(navigate);
  const choice = document.getElementById('cms-illustration-choice');
  const upload = document.getElementById('cms-illustration-upload');
  const alt = document.getElementById('cms-illustration-alt');
  const caption = document.getElementById('cms-illustration-caption');
  const preview = document.getElementById('cms-illustration-preview');
  let uploadedImage = '';
  const updatePreview = () => {
    const src = uploadedImage || choice?.value;
    if (!preview) return;
    preview.hidden = !src;
    if (src) {
      preview.querySelector('img').src = src;
      preview.querySelector('img').alt = alt?.value || 'Selected lesson illustration';
      preview.querySelector('span').textContent = caption?.value || 'Illustration ready to publish';
    }
  };
  choice?.addEventListener('change', () => { if (choice.value) { uploadedImage = ''; upload.value = ''; } updatePreview(); });
  upload?.addEventListener('change', async () => {
    const file = upload.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > MAX_IMAGE_SIZE_BYTES) {
      upload.value = '';
      showToast('Choose an image file no larger than 2 MB.', 'error');
      return;
    }
    try { uploadedImage = await readImageFile(file); choice.value = ''; updatePreview(); } catch (error) { showToast(error.message, 'error'); }
  });
  alt?.addEventListener('input', updatePreview);
  caption?.addEventListener('input', updatePreview);
  document.getElementById('lesson-editor-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = (id) => document.getElementById(id).value.trim();
    const illustrationSrc = uploadedImage || choice?.value;
    const illustration = illustrationSrc ? { src: illustrationSrc, alt: value('cms-illustration-alt') || `Illustration for ${value('cms-title')}`, caption: value('cms-illustration-caption') } : null;
    await saveCustomLesson({ title: value('cms-title'), strand: value('cms-strand'), subject: value('cms-subject'), objectives: value('cms-objectives').split('\n').map((item) => item.trim()).filter(Boolean), keyTerms: value('cms-terms').split('\n').map((item) => item.trim()).filter(Boolean), content: value('cms-body'), illustration });
    showToast('Custom lesson saved locally.', 'success');
    navigate('/lesson-editor');
  });
  document.getElementById('btn-export-pack')?.addEventListener('click', async () => {
    downloadPack(createLessonPackArchive(await exportLessonPack()));
    showToast('ZIP lesson pack exported.', 'success');
  });
  document.getElementById('cms-import-pack')?.addEventListener('change', async (event) => {
    try {
      const pack = await readLessonPackArchive(event.target.files[0]);
      const summary = await importLessonPack(pack);
      showToast(`${summary.lessons} lessons and ${summary.questions} questions imported.`, 'success');
      navigate('/lesson-editor');
    } catch (error) { showToast(error.message || 'Could not import that lesson pack.', 'error'); }
  });
}
