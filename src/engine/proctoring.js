/**
 * ClassConnect - Proctoring Session
 * Provides lightweight browser lockdown and anomaly logging for local assessments.
 */

function nowIso() {
  return new Date().toISOString();
}

function buildEvent(type, detail = {}) {
  return {
    type,
    detail,
    timestamp: nowIso()
  };
}

export function createProctorSession() {
  const events = [];
  const listeners = [];
  const textState = new Map();
  let startedAt = null;

  function logEvent(type, detail = {}) {
    events.push(buildEvent(type, detail));
  }

  function addManagedListener(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    listeners.push(() => target.removeEventListener(eventName, handler, options));
  }

  async function requestFullscreenIfPossible() {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      logEvent('fullscreen-request-failed');
    }
  }

  async function start() {
    startedAt = Date.now();
    await requestFullscreenIfPossible();

    addManagedListener(document, 'visibilitychange', () => {
      if (document.hidden) {
        logEvent('tab-hidden');
      }
    });

    addManagedListener(window, 'blur', () => {
      logEvent('window-blur');
    });

    addManagedListener(document, 'fullscreenchange', () => {
      if (!document.fullscreenElement) {
        logEvent('fullscreen-exit');
      }
    });

    addManagedListener(document, 'contextmenu', (event) => {
      event.preventDefault();
      logEvent('context-menu-open');
    });

    ['copy', 'cut', 'paste'].forEach((eventName) => {
      addManagedListener(document, eventName, (event) => {
        event.preventDefault();
        logEvent(`${eventName}-attempt`);
      });
    });

    addManagedListener(document, 'keydown', (event) => {
      const shortcutBlocked = event.key === 'F12'
        || (event.ctrlKey && ['c', 'v', 'x', 'p', 's', 'u'].includes(event.key.toLowerCase()))
        || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(event.key.toLowerCase()));

      if (shortcutBlocked) {
        event.preventDefault();
        logEvent('blocked-shortcut', { key: event.key });
      }
    });

    window.onbeforeunload = () => 'Assessment still in progress.';
    logEvent('proctor-started');
  }

  function trackTextEntry(questionId, newText) {
    const currentLength = (newText || '').length;
    const state = textState.get(questionId) || { length: 0, updatedAt: Date.now() };
    const now = Date.now();
    const deltaLength = currentLength - state.length;
    const deltaTime = now - state.updatedAt;

    if (deltaLength >= 80 && deltaTime < 1500) {
      logEvent('burst-typing', { questionId, deltaLength, deltaTime });
    }

    textState.set(questionId, {
      length: currentLength,
      updatedAt: now
    });
  }

  function summarize() {
    const counts = events.reduce((summary, event) => {
      summary[event.type] = (summary[event.type] || 0) + 1;
      return summary;
    }, {});

    const anomalyScore = Math.min(
      100,
      (counts['fullscreen-exit'] || 0) * 18
      + (counts['tab-hidden'] || 0) * 16
      + (counts['window-blur'] || 0) * 12
      + (counts['paste-attempt'] || 0) * 12
      + (counts['copy-attempt'] || 0) * 8
      + (counts['cut-attempt'] || 0) * 8
      + (counts['blocked-shortcut'] || 0) * 7
      + (counts['burst-typing'] || 0) * 10
      + (counts['context-menu-open'] || 0) * 6
    );

    return {
      startedAt: startedAt ? new Date(startedAt).toISOString() : null,
      endedAt: nowIso(),
      durationMs: startedAt ? Date.now() - startedAt : 0,
      anomalyScore,
      label: anomalyScore >= 60 ? 'High' : anomalyScore >= 30 ? 'Moderate' : 'Low',
      counts,
      events
    };
  }

  async function stop() {
    listeners.splice(0).forEach((cleanup) => cleanup());
    window.onbeforeunload = null;

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore exit errors.
    }

    logEvent('proctor-stopped');
    return summarize();
  }

  return {
    start,
    stop,
    summarize,
    logEvent,
    trackTextEntry
  };
}
