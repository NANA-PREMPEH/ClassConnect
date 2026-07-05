/**
 * ClassConnect - Feedback Card Component
 */

function resolveFeedbackBadge(source) {
  if (source === 'ai') {
    return '<span class="badge badge--primary">AI Feedback</span>';
  }

  if (source === 'cache') {
    return '<span class="badge badge--accent">Saved Offline</span>';
  }

  if (source === 'question-cache') {
    return '<span class="badge badge--warning">Common Offline Hint</span>';
  }

  if (source === 'fallback') {
    return '<span class="badge badge--neutral">Offline Hint</span>';
  }

  return '<span class="badge badge--success">Quick Check</span>';
}

function resolveFeedbackSourceText(feedback) {
  if (feedback.source === 'ai') {
    return 'Powered by Gemini AI and saved for offline reuse.';
  }

  if (feedback.source === 'cache') {
    return 'Loaded from this device cache so feedback still works offline.';
  }

  if (feedback.source === 'question-cache') {
    return 'Reused from a common explanation for this question while offline.';
  }

  if (feedback.source === 'fallback') {
    return 'Using the built-in lesson explanation because no saved AI response matched yet.';
  }

  return '';
}

function renderFeedbackInsight(feedback, isCorrect) {
  if (isCorrect || !feedback.practiceTip) {
    return '';
  }

  return `
    <div class="feedback-card__tip">
      <strong>Next step:</strong> ${feedback.practiceTip}
    </div>
  `;
}

function renderFeedbackMeta(feedback, isCorrect) {
  if (isCorrect || (!feedback.usageCount && !feedback.reusedFromQuestionBank)) {
    return '';
  }

  if (feedback.reusedFromQuestionBank) {
    return '<div class="feedback-card__meta">Misconception memory: reused a common explanation for this question.</div>';
  }

  if ((feedback.usageCount || 0) > 1) {
    return `<div class="feedback-card__meta">Misconception memory: this saved explanation has helped ${feedback.usageCount} times on this device.</div>`;
  }

  return '';
}

export function renderFeedbackCard(feedback, isCorrect) {
  const icon = isCorrect ? 'Correct' : 'Review';
  const title = isCorrect ? 'Correct!' : "Let's learn from this";
  const sourceText = resolveFeedbackSourceText(feedback);

  return `
    <div class="card feedback-card ${isCorrect ? 'feedback-card--correct' : 'feedback-card--incorrect'}">
      <div class="feedback-card__header">
        <span class="feedback-card__icon">${icon}</span>
        <span class="feedback-card__title">${title}</span>
        ${resolveFeedbackBadge(feedback.source)}
      </div>
      <div class="feedback-card__body">
        ${feedback.text}
      </div>
      ${renderFeedbackInsight(feedback, isCorrect)}
      ${renderFeedbackMeta(feedback, isCorrect)}
      ${sourceText ? `<div class="feedback-card__source">${sourceText}</div>` : ''}
    </div>
  `;
}
