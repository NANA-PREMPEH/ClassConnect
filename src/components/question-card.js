/**
 * ClassConnect — Question Card Component
 */

export function renderQuestionCard(question) {
  const letters = ['A', 'B', 'C', 'D'];

  return `
    <div class="question-card">
      <div class="question-card__stem" id="question-stem">${question.stem}<button class="read-aloud-button" type="button" data-read-aloud-target="question-stem" aria-label="Read question aloud" aria-pressed="false">Listen</button></div>
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
