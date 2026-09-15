import { getSupabaseClient } from './supabase-client.js';

export const SCHOOL_STORAGE_BUCKETS = Object.freeze({
  exports: 'school-exports',
  backups: 'school-backups',
  lessonAssets: 'lesson-assets'
});

function safeFileName(name = 'file') {
  return String(name).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'file';
}

export function schoolStoragePath(schoolId, category, fileName) {
  if (!schoolId) throw new Error('A school ID is required for cloud storage.');
  return `${schoolId}/${category}/${Date.now()}-${safeFileName(fileName)}`;
}

export async function uploadSchoolFile({ bucket, schoolId, category, file, metadata = {} }) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  const path = schoolStoragePath(schoolId, category, file?.name);
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file?.type || 'application/octet-stream',
    upsert: false,
    metadata
  });
  if (error) throw error;
  return data;
}

export async function createSchoolFileUrl(bucket, path, expiresIn = 300) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
