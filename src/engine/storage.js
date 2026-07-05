/**
 * ClassConnect — Storage Engine
 * IndexedDB wrapper for persisting student data, progress, quiz results, and settings.
 */

import { openDB } from 'idb';

const DB_NAME = 'classconnect';
const DB_VERSION = 5;
const SETTINGS_STORE = 'settings';
const FEEDBACK_CACHE_STORE = 'feedbackCache';
const TEACHER_SESSION_KEY = 'cc_teacherAuthenticated';
const CURRENT_STUDENT_KEY = 'cc_currentStudent';
const LEGACY_SETTING_KEYS = ['apiKey', 'teacherPin', 'theme'];

let dbPromise = null;

function ensureBaseStores(db) {
  if (!db.objectStoreNames.contains('students')) {
    const studentStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
    studentStore.createIndex('name', 'name', { unique: false });
  }

  if (!db.objectStoreNames.contains('progress')) {
    const progressStore = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
    progressStore.createIndex('studentId', 'studentId', { unique: false });
  }

  if (!db.objectStoreNames.contains('quizResults')) {
    const quizStore = db.createObjectStore('quizResults', { keyPath: 'id', autoIncrement: true });
    quizStore.createIndex('studentId', 'studentId', { unique: false });
    quizStore.createIndex('lessonId', 'lessonId', { unique: false });
  }

  if (!db.objectStoreNames.contains('diagnostics')) {
    const diagnosticStore = db.createObjectStore('diagnostics', { keyPath: 'id', autoIncrement: true });
    diagnosticStore.createIndex('studentId', 'studentId', { unique: false });
  }

  if (!db.objectStoreNames.contains('tutorThreads')) {
    db.createObjectStore('tutorThreads', { keyPath: 'studentId' });
  }

  if (!db.objectStoreNames.contains('assessments')) {
    const assessmentStore = db.createObjectStore('assessments', { keyPath: 'id', autoIncrement: true });
    assessmentStore.createIndex('createdAt', 'createdAt', { unique: false });
  }

  if (!db.objectStoreNames.contains('assessmentSubmissions')) {
    const submissionStore = db.createObjectStore('assessmentSubmissions', { keyPath: 'id', autoIncrement: true });
    submissionStore.createIndex('assessmentId', 'assessmentId', { unique: false });
    submissionStore.createIndex('studentId', 'studentId', { unique: false });
  }

  if (!db.objectStoreNames.contains(FEEDBACK_CACHE_STORE)) {
    const feedbackStore = db.createObjectStore(FEEDBACK_CACHE_STORE, { keyPath: 'cacheKey' });
    feedbackStore.createIndex('questionId', 'questionId', { unique: false });
    feedbackStore.createIndex('updatedAt', 'updatedAt', { unique: false });
  }

  if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
    db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
  }
}

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        ensureBaseStores(db);
      }
    });
  }

  return dbPromise;
}

function readLocalSetting(key) {
  try {
    return localStorage.getItem(`cc_${key}`);
  } catch {
    return null;
  }
}

function writeLocalSetting(key, value) {
  try {
    if (value === null || value === undefined || value === '') {
      localStorage.removeItem(`cc_${key}`);
      return;
    }

    localStorage.setItem(`cc_${key}`, value);
  } catch {
    // localStorage might be full or disabled.
  }
}

async function persistSetting(key, value) {
  const db = await getDB();
  await db.put(SETTINGS_STORE, {
    key,
    value,
    updatedAt: new Date().toISOString()
  });
}

// ==================== SETTINGS ====================

export async function hydrateSettingsFromDB() {
  const db = await getDB();

  await Promise.all(
    LEGACY_SETTING_KEYS.map(async (key) => {
      const entry = await db.get(SETTINGS_STORE, key);

      if (entry?.value) {
        writeLocalSetting(key, entry.value);
        return;
      }

      const legacyValue = readLocalSetting(key);
      if (legacyValue) {
        await persistSetting(key, legacyValue);
      }
    })
  );
}

export function getSetting(key) {
  return readLocalSetting(key);
}

export async function getSettingAsync(key) {
  const db = await getDB();
  const entry = await db.get(SETTINGS_STORE, key);

  if (entry?.value !== undefined) {
    writeLocalSetting(key, entry.value);
    return entry.value;
  }

  return readLocalSetting(key);
}

export function setSetting(key, value) {
  writeLocalSetting(key, value);
  void persistSetting(key, value);
}

export async function setSettingAsync(key, value) {
  writeLocalSetting(key, value);
  await persistSetting(key, value);
}

export function getApiKey() {
  return getSetting('apiKey');
}

export async function getApiKeyAsync() {
  return getSettingAsync('apiKey');
}

export function setApiKey(key) {
  setSetting('apiKey', key);
}

export async function setApiKeyAsync(key) {
  await setSettingAsync('apiKey', key);
}

export function getTeacherPin() {
  return getSetting('teacherPin');
}

export async function getTeacherPinAsync() {
  return getSettingAsync('teacherPin');
}

export function setTeacherPin(pin) {
  setSetting('teacherPin', pin);
}

export async function setTeacherPinAsync(pin) {
  await setSettingAsync('teacherPin', pin);
}

// ==================== STUDENTS ====================

export async function createStudent(name, pin) {
  const db = await getDB();
  const existing = await findStudentByNameAndPin(name, pin);
  if (existing) return existing;

  const createdAt = new Date().toISOString();
  const id = await db.add('students', {
    name: name.trim(),
    pin,
    createdAt
  });

  return { id, name: name.trim(), pin, createdAt };
}

export async function findStudentByNameAndPin(name, pin) {
  const db = await getDB();
  const all = await db.getAllFromIndex('students', 'name', name.trim());
  return all.find((student) => student.pin === pin) || null;
}

export async function getAllStudents() {
  const db = await getDB();
  return db.getAll('students');
}

export async function getStudent(id) {
  const db = await getDB();
  return db.get('students', id);
}

// ==================== LESSON PROGRESS ====================

export async function markLessonComplete(studentId, lessonId) {
  const db = await getDB();
  const existing = await getProgressForStudent(studentId);
  const alreadyDone = existing.find((entry) => entry.lessonId === lessonId);
  if (alreadyDone) return alreadyDone;

  const completedAt = new Date().toISOString();
  const id = await db.add('progress', {
    studentId,
    lessonId,
    completedAt
  });

  return { id, studentId, lessonId, completedAt };
}

export async function getProgressForStudent(studentId) {
  const db = await getDB();
  return db.getAllFromIndex('progress', 'studentId', studentId);
}

export async function getAllProgress() {
  const db = await getDB();
  return db.getAll('progress');
}

export const getStudentProgress = getProgressForStudent;

export async function isLessonComplete(studentId, lessonId) {
  const progress = await getProgressForStudent(studentId);
  return progress.some((entry) => entry.lessonId === lessonId);
}

// ==================== QUIZ RESULTS ====================

export async function saveQuizResult(result) {
  const db = await getDB();
  const completedAt = new Date().toISOString();
  const payload = {
    ...result,
    completedAt
  };
  const id = await db.add('quizResults', payload);
  return { ...payload, id };
}

export async function getQuizResultsForStudent(studentId) {
  const db = await getDB();
  return db.getAllFromIndex('quizResults', 'studentId', studentId);
}

export async function getAllQuizResults() {
  const db = await getDB();
  return db.getAll('quizResults');
}

export async function getQuizResultsForLesson(lessonId) {
  const db = await getDB();
  return db.getAllFromIndex('quizResults', 'lessonId', lessonId);
}

// ==================== DIAGNOSTICS ====================

export async function saveDiagnosticResult(result) {
  const db = await getDB();
  const completedAt = new Date().toISOString();
  const payload = {
    ...result,
    completedAt
  };
  const id = await db.add('diagnostics', payload);
  return { ...payload, id };
}

export async function getDiagnosticResult(id) {
  const db = await getDB();
  return db.get('diagnostics', id);
}

export async function getDiagnosticsForStudent(studentId) {
  const db = await getDB();
  return db.getAllFromIndex('diagnostics', 'studentId', studentId);
}

export async function getLatestDiagnosticForStudent(studentId) {
  const diagnostics = await getDiagnosticsForStudent(studentId);
  return diagnostics
    .slice()
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt))[0] || null;
}

export async function getAllDiagnostics() {
  const db = await getDB();
  return db.getAll('diagnostics');
}

// ==================== TUTOR MEMORY ====================

export async function getTutorThread(studentId) {
  const db = await getDB();
  return db.get('tutorThreads', studentId);
}

export async function saveTutorThread(studentId, messages) {
  const db = await getDB();
  const payload = {
    studentId,
    messages: messages.slice(-20),
    updatedAt: new Date().toISOString()
  };
  await db.put('tutorThreads', payload);
  return payload;
}

export async function clearTutorThread(studentId) {
  const db = await getDB();
  await db.delete('tutorThreads', studentId);
}

// ==================== ASSESSMENTS ====================

export async function saveAssessment(assessment) {
  const db = await getDB();
  const payload = {
    ...assessment,
    createdAt: assessment.createdAt || new Date().toISOString()
  };
  const id = await db.add('assessments', payload);
  return { ...payload, id };
}

export async function getAssessment(id) {
  const db = await getDB();
  return db.get('assessments', id);
}

export async function getAllAssessments() {
  const db = await getDB();
  return db.getAll('assessments');
}

export async function saveAssessmentSubmission(submission) {
  const db = await getDB();
  const payload = {
    ...submission,
    completedAt: submission.completedAt || new Date().toISOString()
  };
  const id = await db.add('assessmentSubmissions', payload);
  return { ...payload, id };
}

export async function getAssessmentSubmissionsForAssessment(assessmentId) {
  const db = await getDB();
  return db.getAllFromIndex('assessmentSubmissions', 'assessmentId', assessmentId);
}

export async function getAssessmentSubmissionsForStudent(studentId) {
  const db = await getDB();
  return db.getAllFromIndex('assessmentSubmissions', 'studentId', studentId);
}

export async function getAllAssessmentSubmissions() {
  const db = await getDB();
  return db.getAll('assessmentSubmissions');
}

// ==================== FEEDBACK CACHE ====================

export async function getFeedbackCacheEntry(cacheKey) {
  const db = await getDB();
  return db.get(FEEDBACK_CACHE_STORE, cacheKey);
}

export async function getQuestionFeedbackCache(questionId) {
  const db = await getDB();
  return db.getAllFromIndex(FEEDBACK_CACHE_STORE, 'questionId', questionId);
}

export async function saveFeedbackCacheEntry(entry) {
  const db = await getDB();
  const existing = await db.get(FEEDBACK_CACHE_STORE, entry.cacheKey);
  const now = new Date().toISOString();

  const payload = {
    ...existing,
    ...entry,
    createdAt: existing?.createdAt || entry.createdAt || now,
    updatedAt: now,
    usageCount: entry.usageCount || (existing ? (existing.usageCount || 0) + 1 : 1),
    lastUsedAt: entry.lastUsedAt || now
  };

  await db.put(FEEDBACK_CACHE_STORE, payload);
  return payload;
}

export async function markFeedbackCacheUsed(cacheKey) {
  const db = await getDB();
  const existing = await db.get(FEEDBACK_CACHE_STORE, cacheKey);

  if (!existing) {
    return null;
  }

  const payload = {
    ...existing,
    usageCount: (existing.usageCount || 0) + 1,
    lastUsedAt: new Date().toISOString()
  };

  await db.put(FEEDBACK_CACHE_STORE, payload);
  return payload;
}

// ==================== SESSION ====================

export function setCurrentStudent(student) {
  sessionStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
}

export function getCurrentStudent() {
  try {
    const data = sessionStorage.getItem(CURRENT_STUDENT_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearCurrentStudent() {
  sessionStorage.removeItem(CURRENT_STUDENT_KEY);
}

export function setTeacherAuthenticated(authenticated = true) {
  if (!authenticated) {
    sessionStorage.removeItem(TEACHER_SESSION_KEY);
    return;
  }

  sessionStorage.setItem(
    TEACHER_SESSION_KEY,
    JSON.stringify({
      authenticated: true,
      updatedAt: new Date().toISOString()
    })
  );
}

export function isTeacherAuthenticated() {
  try {
    const data = sessionStorage.getItem(TEACHER_SESSION_KEY);
    return !!(data && JSON.parse(data)?.authenticated);
  } catch {
    return false;
  }
}

export function clearTeacherAuthenticated() {
  sessionStorage.removeItem(TEACHER_SESSION_KEY);
}

// ==================== EXPORT ====================

export async function exportAllDataAsCSV() {
  const students = await getAllStudents();
  const results = await getAllQuizResults();

  let csv = 'Student Name,Lesson,Score,Total Questions,Ability (theta),Level,Completed At,Total Time (s)\n';

  for (const result of results) {
    const student = students.find((entry) => entry.id === result.studentId);
    const name = student ? student.name : 'Unknown';
    const totalTimeSeconds = Math.round((result.totalTimeMs || 0) / 1000);
    csv += `"${name}",${result.lessonId},${result.score},${result.totalQuestions},${result.theta?.toFixed(2) || 'N/A'},${result.level || 'N/A'},"${result.completedAt}",${totalTimeSeconds}\n`;
  }

  return csv;
}

export function downloadCSV(csv, filename = 'classconnect_data.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
