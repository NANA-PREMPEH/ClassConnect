import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';

const PACK_FILE = 'classconnect-pack.json';

export function createLessonPackArchive(pack) {
  const payload = { ...pack, version: Math.max(2, Number(pack.version) || 1), format: 'zip' };
  return new Blob([zipSync({ [PACK_FILE]: strToU8(JSON.stringify(payload, null, 2)) }, { level: 6 })], { type: 'application/zip' });
}

export async function readLessonPackArchive(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (!isZip) return JSON.parse(strFromU8(bytes)); // Supports the original JSON-only packs.
  const contents = unzipSync(bytes);
  if (!contents[PACK_FILE]) throw new Error('This archive does not contain a ClassConnect lesson pack.');
  return JSON.parse(strFromU8(contents[PACK_FILE]));
}
