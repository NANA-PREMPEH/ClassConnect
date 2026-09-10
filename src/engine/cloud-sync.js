import { openDB } from 'idb';

const DB_NAME = 'classconnect-sync';
const STORE = 'outbox';
const SYNCABLE_STORES = new Set(['classes', 'students', 'progress', 'quizResults', 'diagnostics', 'assessments', 'assessmentSubmissions']);

async function getQueue() {
  return openDB(DB_NAME, 1, { upgrade(db) { db.createObjectStore(STORE, { keyPath: 'operationId' }); } });
}

export async function queueDataChange(change) {
  if (!SYNCABLE_STORES.has(change.store) || !change.record) return;
  const db = await getQueue();
  const operation = {
    operationId: crypto.randomUUID(), entity: change.store, action: change.action,
    entityLocalId: String(change.record.id ?? change.record.studentId ?? ''), payload: change.record,
    occurredAt: change.timestamp, attempts: 0
  };
  await db.put(STORE, operation);
}

export async function pendingSyncCount() { return (await getQueue()).count(STORE); }

/** Holds immutable changes until the Supabase sync-vault feature is enabled. */
export async function flushSyncOutbox() {
  return { synced: 0, pending: await pendingSyncCount() };
}

export function startCloudSync() {
  const run = () => { void flushSyncOutbox(); };
  window.addEventListener('online', run);
  run();
  return () => window.removeEventListener('online', run);
}
