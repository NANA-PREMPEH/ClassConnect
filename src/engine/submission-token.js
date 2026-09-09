const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const bytesToBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
const base64ToBytes = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

async function keyFor(student, salt) {
  const material = await crypto.subtle.importKey('raw', textEncoder.encode(`${student.indexNumber}|${student.pin}`), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

export async function createSubmissionToken(student, submission) {
  if (!student?.indexNumber || !student?.pin) throw new Error('This learner needs an index number and PIN before a USB submission can be sealed.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plainText = textEncoder.encode(JSON.stringify({ version: 1, createdAt: new Date().toISOString(), submission }));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await keyFor(student, salt), plainText);
  return { app: 'ClassConnect', type: 'ccsub', version: 1, studentIndexNumber: student.indexNumber, salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(encrypted)) };
}

export async function openSubmissionToken(file, students) {
  const token = JSON.parse(await file.text());
  if (token?.app !== 'ClassConnect' || token?.type !== 'ccsub') throw new Error('This is not a ClassConnect submission file.');
  const student = students.find((entry) => entry.indexNumber === token.studentIndexNumber);
  if (!student) throw new Error(`No learner matches ${token.studentIndexNumber}.`);
  try {
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(token.iv) }, await keyFor(student, base64ToBytes(token.salt)), base64ToBytes(token.ciphertext));
    return { student, payload: JSON.parse(textDecoder.decode(decrypted)) };
  } catch { throw new Error(`Verification failed for ${token.studentIndexNumber}; the file may be altered or use a different PIN.`); }
}

export function downloadSubmissionToken(token, indexNumber) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(token)], { type: 'application/json' }));
  link.download = `classconnect-${indexNumber}-${Date.now()}.ccsub`;
  link.click();
  URL.revokeObjectURL(link.href);
}
