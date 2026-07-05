# AI Feedback Live Checklist

Updated: 2026-07-05

This checklist tracks the live AI quiz-feedback implementation and its offline fallback layer.

## Core Features

- [x] Wrong-answer API wiring
  Description: Wrong answers now send the question, student answer, and correct answer to the AI feedback API as soon as the learner misses the item.
- [x] Live feedback state in quiz review
  Description: The quiz review screen now shows a live status message while the explanation is being generated and swaps in the response as soon as it arrives.
- [x] Simple explanation response
  Description: Gemini prompts are constrained to short, warm 2-3 sentence explanations suitable for Basic 7 learners.
- [x] Offline fallback coverage
  Description: If connectivity or the API fails, the quiz still returns either a saved device-local explanation or the built-in lesson hint.

## Advanced Features

- [x] IndexedDB feedback cache
  Description: AI explanations are now stored locally in IndexedDB for exact-match offline reuse.
- [x] Common-response fallback
  Description: If an exact cached answer is missing, the app can reuse a common saved explanation for the same question.
- [x] Misconception memory
  Description: Cached explanations track reuse count so the UI can surface when a saved explanation has helped multiple times on the device.
- [x] Practice tip support
  Description: Feedback cards now add a short next-step practice tip to help the learner act on the explanation.

## Student Experience

- [x] Added live feedback status text in the quiz review flow
- [x] Added richer feedback cards with source labels for AI, saved offline, common offline hint, and fallback hint
- [x] Added consistent feedback-card reuse in the final quiz results review

## Persistence and Data Model

- [x] Added IndexedDB `feedbackCache` store
- [x] Added cache usage tracking (`usageCount`, `lastUsedAt`)
- [x] Added question-level cache lookup for offline reuse

## Documentation and Validation

- [x] Added this implementation tracker
- [x] Updated `README.md` to describe live AI feedback caching and offline reuse
- [ ] Manual browser QA for the flow: answer wrong online -> receive AI feedback -> go offline -> repeat and confirm cached fallback
- [ ] Live Gemini verification against a real API key
- [ ] Optional future enhancement: teacher-facing misconception cache analytics

## Primary Files Touched

- `src/engine/ai-feedback.js`
- `src/engine/storage.js`
- `src/views/quiz.js`
- `src/views/quiz-results.js`
- `src/components/feedback-card.js`
- `src/styles/quiz.css`
- `README.md`
