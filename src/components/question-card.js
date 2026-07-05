/**
 * ClassConnect — Question Card Component
 */

export function renderQuestionCard(question) {
  const letters = ['A', 'B', 'C', 'D'];

  return `
    <div class="question-card">
      <div class="question-card__stem">${question.stem}</div>
      <div class="question-options" id="question-options">
        ${question.options.map((option, index) => `
          <button class="option-btn" data-index="${index}" id="option-${index}">
            <span class="option-btn__letter">${letters[index]}</span>
            <span class="option-btn__text">${option}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
