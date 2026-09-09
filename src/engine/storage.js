/**
 * ClassConnect — Storage Engine
 * IndexedDB wrapper for persisting student data, progress, quiz results, and settings.
 */

import { openDB } from 'idb';

const DB_NAME = 'classconnect';
const DB_VERSION = 9;
const SETTINGS_STORE = 'settings';
const FEEDBACK_CACHE_STORE = 'feedbackCache';
const DATA_CHANGE_EVENT = 'classconnect:datachange';
const DATA_SYNC_CHANNEL = 'classconnect-data-sync';
const TEACHER_SESSION_KEY = 'cc_teacherAuthenticated';
const CURRENT_STUDENT_KEY = 'cc_currentStudent';
const STAFF_CLASS_CONTEXT_KEY = 'cc_staffClassContext';
const LEGACY_SETTING_KEYS = ['apiKey', 'teacherPin', 'theme'];

export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  TEACHER: 'teacher',
  INVIGILATOR: 'invigilator'
});

export const ROLE_LABELS = Object.freeze({
  [USER_ROLES.ADMIN]: 'Administrator / Headmaster',
  [USER_ROLES.TEACHER]: 'Subject Teacher',
  [USER_ROLES.INVIGILATOR]: 'Lab Technician / Invigilator'
});

const ROLE_PERMISSIONS = Object.freeze({
  [USER_ROLES.ADMIN]: ['dashboard', 'classes.manage', 'roster.manage', 'gradebook', 'assessment.manage', 'lab.monitor', 'cms.manage', 'data.export', 'backup.manage', 'users.manage', 'audit.view'],
  [USER_ROLES.TEACHER]: ['dashboard', 'roster.manage', 'gradebook', 'assessment.manage', 'cms.manage'],
  [USER_ROLES.INVIGILATOR]: ['lab.monitor']
});

export function hasPermission(permission, teacher = getCurrentTeacher()) {
  return !!teacher?.authenticated && (ROLE_PERMISSIONS[teacher.role] || []).includes(permission);
}

export function getAccessibleClassIds(teacher = getCurrentTeacher()) {
  if (!teacher || teacher.role === USER_ROLES.ADMIN) return null;
  return Array.isArray(teacher.classIds) ? teacher.classIds.map(Number) : [];
}

let dbPromise = null;
let dataSyncChannel = null;
const dataSyncClientId = globalThis.crypto?.randomUUID?.()
  || `cc-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function getDataSyncChannel() {
  if (typeof BroadcastChannel === 'undefined') {
    return null;
  }

  if (!dataSyncChannel) {
    dataSyncChannel = new BroadcastChannel(DATA_SYNC_CHANNEL);
  }

  return dataSyncChannel;
}

function emitDataChange(store, action, record = null) {
  const payload = {
    store,
    action,
    recordId: record?.id ?? record?.studentId ?? record?.cacheKey ?? null,
    timestamp: new Date().toISOString(),
    sourceId: dataSyncClientId
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_CHANGE_EVENT, { detail: payload }));
  }

  try {
    getDataSyncChannel()?.postMessage(payload);
  } catch {
    // BroadcastChannel may be unavailable in restricted contexts.
  }

  return payload;
}

export function subscribeToDataChanges(listener) {
  const handleWindowEvent = (event) => {
    if (event?.detail) {
      listener(event.detail);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(DATA_CHANGE_EVENT, handleWindowEvent);
  }

  const channel = getDataSyncChannel();
  const handleChannelMessage = (event) => {
    if (!event?.data || event.data.sourceId === dataSyncClientId) {
      return;
    }

    listener(event.data);
  };

  channel?.addEventListener('message', handleChannelMessage);

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(DATA_CHANGE_EVENT, handleWindowEvent);
    }

    channel?.removeEventListener('message', handleChannelMessage);
  };
}

function ensureBaseStores(db, transaction = null) {
  if (!db.objectStoreNames.contains('classes')) {
    const classStore = db.createObjectStore('classes', { keyPath: 'id', autoIncrement: true });
    classStore.createIndex('gradeLevel', 'gradeLevel', { unique: false });
    classStore.createIndex('academicYear', 'academicYear', { unique: false });
  }

  if (!db.objectStoreNames.contains('students')) {
    const studentStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
    studentStore.createIndex('name', 'name', { unique: false });
    studentStore.createIndex('classId', 'classId', { unique: false });
    studentStore.createIndex('indexNumber', 'indexNumber', { unique: false });
  } else if (transaction) {
    const studentStore = transaction.objectStore('students');
    if (!studentStore.indexNames.contains('classId')) {
      studentStore.createIndex('classId', 'classId', { unique: false });
    }
    if (!studentStore.indexNames.contains('indexNumber')) {
      studentStore.createIndex('indexNumber', 'indexNumber', { unique: false });
    }
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

  if (!db.objectStoreNames.contains('customLessons')) {
    const store = db.createObjectStore('customLessons', { keyPath: 'id', autoIncrement: true });
    store.createIndex('strand', 'strand', { unique: false });
  }
  if (!db.objectStoreNames.contains('questionBank')) {
    const store = db.createObjectStore('questionBank', { keyPath: 'id', autoIncrement: true });
    store.createIndex('type', 'type', { unique: false });
  }
  if (!db.objectStoreNames.contains('users')) {
    const store = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
    store.createIndex('username', 'username', { unique: true });
    store.createIndex('role', 'role', { unique: false });
  }
  if (!db.objectStoreNames.contains('auditLog')) {
    const store = db.createObjectStore('auditLog', { keyPath: 'id', autoIncrement: true });
    store.createIndex('createdAt', 'createdAt', { unique: false });
  }
}

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        ensureBaseStores(db, transaction);
      },
      blocked(currentVersion, blockedVersion, event) {
        console.warn(
          `[ClassConnect] IndexedDB upgrade blocked (v${currentVersion} → v${blockedVersion}). ` +
          'Close other ClassConnect tabs or clear site data, then try again.'
        );
      },
      blocking(currentVersion, blockedVersion, event) {
        // Another tab is trying to upgrade the DB — close our connection so
        // the upgrade can proceed without the user manually closing this tab.
        event.target.close();
        dbPromise = null;
      },
      terminated() {
        // The browser abnormally closed the connection (e.g. storage pressure).
        dbPromise = null;
      }
    }).catch((err) => {
      // Reset the cached promise so the next call can retry instead of
      // permanently returning the rejected promise.
      dbPromise = null;
      throw err;
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

  try {
    await ensureDefaultClassAndMigrateStudents(db);
  } catch (err) {
    console.warn('[ClassConnect] Default class migration notice:', err);
  }

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

// ==================== CLASSES ====================

export async function ensureDefaultClassAndMigrateStudents(dbInstance = null) {
  const db = dbInstance || await getDB();
  const classes = await db.getAll('classes');
  let defaultClass = classes[0];

  if (!defaultClass) {
    const createdAt = new Date().toISOString();
    const id = await db.add('classes', {
      name: 'B7 — JHS 1A',
      gradeLevel: 'B7',
      stream: '1A',
      academicYear: '2026/2027',
      term: 'Term 1',
      teacherName: 'Class Teacher',
      createdAt
    });
    defaultClass = {
      id,
      name: 'B7 — JHS 1A',
      gradeLevel: 'B7',
      stream: '1A',
      academicYear: '2026/2027',
      term: 'Term 1',
      teacherName: 'Class Teacher',
      createdAt
    };
    emitDataChange('classes', 'create', defaultClass);
  }

  // Check students that don't have classId or indexNumber
  const students = await db.getAll('students');
  const tx = db.transaction('students', 'readwrite');
  let migratedCount = 0;

  for (const student of students) {
    let changed = false;
    if (!student.classId) {
      student.classId = defaultClass.id;
      changed = true;
    }
    if (!student.status) {
      student.status = 'active';
      changed = true;
    }
    if (!student.gender) {
      student.gender = 'unspecified';
      changed = true;
    }
    if (!student.indexNumber) {
      student.indexNumber = `GES-B7-${String(student.id).padStart(4, '0')}`;
      changed = true;
    }
    if (changed) {
      await tx.store.put(student);
      migratedCount += 1;
    }
  }

  await tx.done;
  return { defaultClass, migratedCount };
}

export async function createClass(classData) {
  const db = await getDB();
  const createdAt = new Date().toISOString();
  const payload = {
    name: classData.name?.trim() || `${classData.gradeLevel || 'B7'} — ${classData.stream || 'Stream A'}`,
    gradeLevel: classData.gradeLevel || 'B7',
    stream: classData.stream || 'A',
    academicYear: classData.academicYear || '2026/2027',
    term: classData.term || 'Term 1',
    teacherName: classData.teacherName?.trim() || 'Class Teacher',
    createdAt
  };
  const id = await db.add('classes', payload);
  const created = { ...payload, id };
  emitDataChange('classes', 'create', created);
  return created;
}

export async function getAllClasses() {
  const db = await getDB();
  const classes = await db.getAll('classes');
  if (classes.length === 0) {
    const { defaultClass } = await ensureDefaultClassAndMigrateStudents(db);
    return defaultClass ? [defaultClass] : [];
  }
  return classes;
}

export async function getClass(id) {
  const db = await getDB();
  return db.get('classes', id);
}

export async function updateClass(id, updates) {
  const db = await getDB();
  const existing = await db.get('classes', id);
  if (!existing) return null;

  const payload = {
    ...existing,
    ...updates,
    id,
    updatedAt: new Date().toISOString()
  };
  await db.put('classes', payload);
  emitDataChange('classes', 'update', payload);
  return payload;
}

export async function deleteClass(id) {
  const db = await getDB();
  const students = await db.getAllFromIndex('students', 'classId', id);
  if (students.length > 0) {
    throw new Error(`Cannot delete class: ${students.length} student(s) are assigned to it. Reassign or remove them first.`);
  }

  await db.delete('classes', id);
  emitDataChange('classes', 'delete', { id });
  return true;
}

// ==================== STUDENTS ====================

export async function createStudent(name, pin, extra = {}) {
  const db = await getDB();
  const existing = await findStudentByNameAndPin(name, pin);
  if (existing) return existing;

  let classId = extra.classId;
  if (!classId) {
    const classes = await getAllClasses();
    classId = classes[0]?.id || 1;
  }

  const createdAt = new Date().toISOString();
  const payload = {
    name: name.trim(),
    pin,
    classId,
    indexNumber: extra.indexNumber?.trim() || null,
    gender: extra.gender || 'unspecified',
    status: extra.status || 'active',
    createdAt
  };

  const id = await db.add('students', payload);
  if (!payload.indexNumber) {
    payload.indexNumber = `GES-B7-${String(id).padStart(4, '0')}`;
    await db.put('students', { ...payload, id });
  }

  const created = { ...payload, id };
  emitDataChange('students', 'create', created);
  return created;
}

export async function findStudentByNameAndPin(name, pin) {
  const db = await getDB();
  const all = await db.getAllFromIndex('students', 'name', name.trim());
  return all.find((student) => student.pin === pin) || null;
}

export async function findStudentByIndexOrNameAndPin(identifier, pin) {
  const db = await getDB();
  const cleanId = (identifier || '').trim().toLowerCase();
  if (!cleanId) return null;

  const all = await db.getAll('students');

  // 1. Try matching by Index Number
  const byIndex = all.find((student) =>
    student.indexNumber && student.indexNumber.trim().toLowerCase() === cleanId && student.pin === pin
  );
  if (byIndex) return byIndex;

  // 2. Try matching by Full Name
  const byName = all.find((student) =>
    student.name && student.name.trim().toLowerCase() === cleanId && student.pin === pin
  );
  return byName || null;
}

export async function updateStudent(id, updates) {
  const db = await getDB();
  const existing = await db.get('students', id);
  if (!existing) return null;

  const payload = {
    ...existing,
    ...updates,
    id,
    updatedAt: new Date().toISOString()
  };
  await db.put('students', payload);
  emitDataChange('students', 'update', payload);
  await addAuditLog(updates.pin ? 'student-pin.reset' : 'student-record.updated', { studentId: id, fields: Object.keys(updates) });
  return payload;
}

export async function updateStudentPin(id, newPin) {
  if (!/^\d{4}$/.test(newPin)) {
    throw new Error('PIN must be exactly 4 numeric digits.');
  }
  return updateStudent(id, { pin: newPin });
}

export async function getStudentsByClass(classId) {
  const db = await getDB();
  return db.getAllFromIndex('students', 'classId', classId);
}

export async function bulkCreateStudents(studentsList) {
  const db = await getDB();
  const results = { created: [], updated: [], errors: [] };
  const allExisting = await db.getAll('students');

  const tx = db.transaction('students', 'readwrite');
  const store = tx.store;

  for (const item of studentsList) {
    try {
      const trimmedName = item.name?.trim();
      const cleanIndex = item.indexNumber?.trim();
      if (!trimmedName) {
        results.errors.push({ item, error: 'Student name is required.' });
        continue;
      }

      let match = null;
      if (cleanIndex) {
        match = allExisting.find((s) => s.indexNumber && s.indexNumber.toLowerCase() === cleanIndex.toLowerCase());
      }
      if (!match) {
        match = allExisting.find((s) =>
          s.name && s.name.toLowerCase() === trimmedName.toLowerCase() && s.classId === (item.classId || s.classId)
        );
      }

      if (match) {
        const updated = {
          ...match,
          ...item,
          id: match.id,
          name: trimmedName,
          indexNumber: cleanIndex || match.indexNumber,
          updatedAt: new Date().toISOString()
        };
        await store.put(updated);
        results.updated.push(updated);
      } else {
        const pin = item.pin && /^\d{4}$/.test(item.pin)
          ? item.pin
          : String(Math.floor(1000 + Math.random() * 9000));

        const created = {
          name: trimmedName,
          pin,
          classId: item.classId || 1,
          indexNumber: cleanIndex || null,
          gender: item.gender || 'unspecified',
          status: item.status || 'active',
          createdAt: new Date().toISOString()
        };
        const id = await store.add(created);
        if (!created.indexNumber) {
          created.indexNumber = `GES-B7-${String(id).padStart(4, '0')}`;
          await store.put({ ...created, id });
        }
        results.created.push({ ...created, id });
      }
    } catch (err) {
      results.errors.push({ item, error: err.message });
    }
  }

  await tx.done;
  emitDataChange('students', 'bulk', results);
  return results;
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

  const completedAt = result.completedAt || new Date().toISOString();
  const id = await db.add('progress', {
    studentId,
    lessonId,
    completedAt
  });

  const created = { id, studentId, lessonId, completedAt };
  emitDataChange('progress', 'create', created);
  return created;
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
  const saved = { ...payload, id };
  emitDataChange('quizResults', 'create', saved);
  return saved;
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
  const saved = { ...payload, id };
  emitDataChange('diagnostics', 'create', saved);
  return saved;
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
  emitDataChange('tutorThreads', 'upsert', payload);
  return payload;
}

export async function clearTutorThread(studentId) {
  const db = await getDB();
  await db.delete('tutorThreads', studentId);
  emitDataChange('tutorThreads', 'delete', { studentId });
}

// ==================== ASSESSMENTS ====================

export async function saveAssessment(assessment) {
  const db = await getDB();
  const payload = {
    ...assessment,
    status: assessment.status || 'open',
    createdAt: assessment.createdAt || new Date().toISOString()
  };
  const id = await db.add('assessments', payload);
  const saved = { ...payload, id };
  emitDataChange('assessments', 'create', saved);
  await addAuditLog('assessment.released', { assessmentId: id, title: saved.title });
  return saved;
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
  const saved = { ...payload, id };
  emitDataChange('assessmentSubmissions', 'create', saved);
  return saved;
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
      role: 'admin',
      updatedAt: new Date().toISOString()
    })
  );
}

export function getCurrentTeacher() {
  try { return JSON.parse(sessionStorage.getItem(TEACHER_SESSION_KEY) || 'null'); } catch { return null; }
}

export function setTeacherSession(user) {
  sessionStorage.setItem(TEACHER_SESSION_KEY, JSON.stringify({ authenticated: true, userId: user.id, username: user.username, name: user.name || user.username, role: user.role, classIds: user.classIds || [], updatedAt: new Date().toISOString() }));
  setSetting('activeTeacher', user.username);
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

export function setStaffClassContext(classes = [], selectedClassId = 'all') {
  sessionStorage.setItem(STAFF_CLASS_CONTEXT_KEY, JSON.stringify({ classes: classes.map((entry) => ({ id: entry.id, name: entry.name })), selectedClassId: String(selectedClassId) }));
}

export function getStaffClassContext() {
  try { return JSON.parse(sessionStorage.getItem(STAFF_CLASS_CONTEXT_KEY) || '{"classes":[],"selectedClassId":"all"}'); } catch { return { classes: [], selectedClassId: 'all' }; }
}

// ==================== CMS, ROLES & AUDIT ====================

export async function saveCustomLesson(lesson) {
  const db = await getDB();
  const payload = { ...lesson, updatedAt: new Date().toISOString(), createdAt: lesson.createdAt || new Date().toISOString() };
  const id = lesson.id ? (await db.put('customLessons', payload), lesson.id) : await db.add('customLessons', payload);
  const saved = { ...payload, id };
  emitDataChange('customLessons', lesson.id ? 'update' : 'create', saved);
  await addAuditLog('lesson.saved', { lessonId: id, title: payload.title });
  return saved;
}

export async function getAllCustomLessons() { return (await getDB()).getAll('customLessons'); }

export async function exportLessonPack() {
  return { app: 'ClassConnect', type: 'ccpack', version: 1, exportedAt: new Date().toISOString(), lessons: await getAllCustomLessons(), questions: await getAllQuestionBankItems() };
}

export async function importLessonPack(pack) {
  if (!pack || pack.app !== 'ClassConnect' || pack.type !== 'ccpack') throw new Error('This is not a ClassConnect lesson pack.');
  const lessons = Array.isArray(pack.lessons) ? pack.lessons : [];
  const questions = Array.isArray(pack.questions) ? pack.questions : [];
  for (const lesson of lessons) { const { id, ...record } = lesson; await saveCustomLesson(record); }
  for (const question of questions) { const { id, ...record } = question; await saveQuestionBankItem(record); }
  await addAuditLog('lesson-pack.imported', { lessons: lessons.length, questions: questions.length });
  return { lessons: lessons.length, questions: questions.length };
}

export async function saveQuestionBankItem(item) {
  const db = await getDB();
  const payload = { ...item, updatedAt: new Date().toISOString(), createdAt: item.createdAt || new Date().toISOString() };
  const id = item.id ? (await db.put('questionBank', payload), item.id) : await db.add('questionBank', payload);
  const saved = { ...payload, id };
  emitDataChange('questionBank', item.id ? 'update' : 'create', saved);
  await addAuditLog('question.saved', { questionId: id, type: payload.type });
  return saved;
}

export async function getAllQuestionBankItems() { return (await getDB()).getAll('questionBank'); }

export async function createUser(user) {
  const role = Object.values(USER_ROLES).includes(user.role) ? user.role : USER_ROLES.TEACHER;
  const username = String(user.username || '').trim().toLowerCase();
  const pin = String(user.pin || '').trim();
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) throw new Error('Username must use 3-40 letters, numbers, dots, dashes, or underscores.');
  if (!/^\d{4,8}$/.test(pin)) throw new Error('Account PIN must contain 4 to 8 digits.');
  const db = await getDB();
  const payload = { ...user, username, pin, role, classIds: Array.isArray(user.classIds) ? user.classIds.map(Number).filter(Number.isFinite) : [], failedAttempts: 0, lockedUntil: null, createdAt: new Date().toISOString() };
  const id = await db.add('users', payload);
  const saved = { ...payload, id };
  await addAuditLog('user.created', { userId: id, username: payload.username, role: payload.role });
  return saved;
}

export async function authenticateUser(username, pin) {
  const normalized = String(username || '').trim().toLowerCase();
  const db = await getDB();
  const user = await db.getFromIndex('users', 'username', normalized);
  if (!user) return { user: null, error: 'Invalid username or PIN.' };
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) return { user: null, error: `Account is locked until ${new Date(user.lockedUntil).toLocaleTimeString()}.` };
  if (user.pin !== String(pin || '').trim()) {
    const failedAttempts = (user.failedAttempts || 0) + 1;
    const lockedUntil = failedAttempts >= 5 ? new Date(Date.now() + 5 * 60 * 1000).toISOString() : null;
    await db.put('users', { ...user, failedAttempts: lockedUntil ? 0 : failedAttempts, lockedUntil, updatedAt: new Date().toISOString() });
    await addAuditLog('user.login_failed', { userId: user.id, username: user.username, locked: !!lockedUntil });
    return { user: null, error: lockedUntil ? 'Too many failed attempts. Account locked for 5 minutes.' : 'Invalid username or PIN.' };
  }
  const saved = { ...user, failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date().toISOString() };
  await db.put('users', saved);
  await addAuditLog('user.login', { userId: user.id, username: user.username });
  return { user: saved, error: null };
}

export async function updateUser(id, changes) {
  const db = await getDB();
  const existing = await db.get('users', id);
  if (!existing) throw new Error('User not found.');
  const role = changes.role === undefined ? existing.role : changes.role;
  if (!Object.values(USER_ROLES).includes(role)) throw new Error('Invalid user role.');
  const saved = { ...existing, ...changes, role, classIds: Array.isArray(changes.classIds) ? changes.classIds.map(Number).filter(Number.isFinite) : existing.classIds || [], id, updatedAt: new Date().toISOString() };
  await db.put('users', saved);
  await addAuditLog('user.updated', { userId: id, role: saved.role });
  return saved;
}

export async function deleteUser(id) {
  const db = await getDB();
  const user = await db.get('users', id);
  if (user?.role === USER_ROLES.ADMIN) {
    const admins = (await db.getAllFromIndex('users', 'role', USER_ROLES.ADMIN));
    if (admins.length <= 1) throw new Error('Keep at least one administrator account.');
  }
  await db.delete('users', id);
  await addAuditLog('user.deleted', { userId: id });
}

export async function getAllUsers() { return (await getDB()).getAll('users'); }

// Smoothly migrates devices that used the original single teacher PIN. The
// legacy PIN becomes an administrator account on first RBAC sign-in.
export async function provisionLegacyAdmin() {
  const users = await getAllUsers();
  if (users.length) return users;
  const legacyPin = getTeacherPin();
  if (!legacyPin || !/^\d{4}$/.test(legacyPin)) return users;
  await createUser({ username: 'admin', name: 'School Administrator', pin: legacyPin, role: USER_ROLES.ADMIN });
  return getAllUsers();
}

export async function addAuditLog(action, detail = {}) {
  const db = await getDB();
  const id = await db.add('auditLog', { action, detail, actor: getSetting('activeTeacher') || 'teacher', createdAt: new Date().toISOString() });
  emitDataChange('auditLog', 'create', { id, action });
  return id;
}

export async function getAuditLog() {
  const entries = await (await getDB()).getAll('auditLog');
  return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  await addAuditLog('student-records.exported', { format: 'csv', studentCount: students.length });
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

// ==================== BACKUP & RESTORE ====================

const ALL_BACKUP_STORES = [
  'classes',
  'students',
  'progress',
  'quizResults',
  'diagnostics',
  'tutorThreads',
  'assessments',
  'assessmentSubmissions',
  'customLessons',
  'questionBank',
  'users',
  'auditLog',
  FEEDBACK_CACHE_STORE,
  SETTINGS_STORE
];

export async function exportFullSchoolBackup() {
  const db = await getDB();
  const backupData = {};

  for (const storeName of ALL_BACKUP_STORES) {
    if (db.objectStoreNames.contains(storeName)) {
      backupData[storeName] = await db.getAll(storeName);
    }
  }

  return {
    app: 'ClassConnect',
    schemaVersion: DB_VERSION,
    exportedAt: new Date().toISOString(),
    data: backupData
  };
}

export async function downloadFullSchoolBackup() {
  const payload = await exportFullSchoolBackup();
  const json = JSON.stringify(payload, null, 2);
  const dateStr = new Date().toISOString().slice(0, 10);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `classconnect_school_backup_${dateStr}.json`;
  link.click();
  URL.revokeObjectURL(url);
  await addAuditLog('school-backup.exported', { format: 'json' });
  return payload;
}

export async function restoreFullSchoolBackup(backupPayload, mode = 'merge') {
  if (!backupPayload || backupPayload.app !== 'ClassConnect' || !backupPayload.data) {
    throw new Error('Invalid ClassConnect backup file. Expected valid JSON with app metadata.');
  }

  const db = await getDB();
  const summary = {};

  for (const [storeName, records] of Object.entries(backupPayload.data)) {
    if (!db.objectStoreNames.contains(storeName) || !Array.isArray(records)) {
      continue;
    }

    const tx = db.transaction(storeName, 'readwrite');
    if (mode === 'overwrite') {
      await tx.store.clear();
    }

    let count = 0;
    for (const record of records) {
      await tx.store.put(record);
      count += 1;
    }
    await tx.done;
    summary[storeName] = count;
  }

  // Ensure default class and migrated students exist after restore
  await ensureDefaultClassAndMigrateStudents(db);

  emitDataChange('all', 'restore', summary);
  return summary;
}
