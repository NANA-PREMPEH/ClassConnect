/**
 * ClassConnect — Feedback Card Component
 */

function resolveFeedbackBadge(source) {
  if (source === 'ai') {
    return '<span class="badge badge--primary">AI Feedback</span>';
  }

  if (source === 'fallback') {
    return '<span class="badge badge--neutral">Offline Hint</span>';
  }

  return '<span class="badge badge--success">Quick Check</span>';
}

export function renderFeedbackCard(feedback, isCorrect) {
  const icon = isCorrect ? 'Correct' : 'Review';
  const title = isCorrect ? 'Correct!' : "Let's learn from this";

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
      ${feedback.source === 'ai' ? '<div class="feedback-card__source">Powered by Gemini AI</div>' : ''}
    </div>
  `;
}
