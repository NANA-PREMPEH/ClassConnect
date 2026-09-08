/**
 * Development-LAN relay client. The `lab` Vite command relays these custom
 * HMR messages between PCs; the teacher browser remains the local record of
 * authority. Nothing is sent to the public internet.
 */
const LAB_KEY = 'cc_lab_room';
const listeners = new Set();
let started = false;

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `lab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getLabRoom() {
  const room = new URLSearchParams(window.location.search).get('lab');
  if (room) localStorage.setItem(LAB_KEY, room);
  return room || localStorage.getItem(LAB_KEY) || '';
}

export function createLabRoom() {
  const room = makeId();
  localStorage.setItem(LAB_KEY, room);
  return room;
}

export function getLabJoinUrl(room = getLabRoom()) {
  const url = new URL('/student-login', window.location.origin);
  url.searchParams.set('lab', room);
  return url.toString();
}

export function startLabSync(onMessage) {
  if (onMessage) listeners.add(onMessage);
  const room = getLabRoom();
  if (!room || !import.meta.hot) return () => listeners.delete(onMessage);

  if (!started) {
    started = true;
    import.meta.hot.on('classconnect:lan', (message) => {
      if (!message || message.room !== getLabRoom()) return;
      listeners.forEach((listener) => listener(message));
    });
    import.meta.hot.send('classconnect:lan', { type: 'join', room, sentAt: new Date().toISOString() });
  }

  return () => listeners.delete(onMessage);
}

export function sendLabMessage(type, payload = {}) {
  const room = getLabRoom();
  if (!room || !import.meta.hot) return false;
  import.meta.hot.send('classconnect:lan', { type, room, sentAt: new Date().toISOString(), ...payload });
  return true;
}

export function publishLabStatus(status, detail = {}) {
  return sendLabMessage('status', { status, ...detail });
}

export function sendLabControl(action, detail = {}) {
  return sendLabMessage('control', { action, ...detail });
}
