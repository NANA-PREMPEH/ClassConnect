# Lessons Interface Restructure Checklist

**Created:** 2026-09-09  
**Status:** Implemented and verified by production build  
**Scope:** Learner-facing lessons workspace, lesson reader, routing, and responsive interface.

## Target Learner Journey

```text
My learning (/lessons)
  -> Continue / start next lesson       -> /lesson/:id
  -> Browse curriculum                  -> /lessons/library
  -> Check progress                     -> /lessons/progress
  -> Review recommended topics          -> /lessons/review
  -> Complete lesson                    -> /quiz/:id -> /quiz-results/:id
```

## Information Architecture

- [x] Rework `/lessons` into a focused **My learning** dashboard.
- [x] Add a single primary **Continue learning** action above the fold.
- [x] Add a compact three-card summary for completion, mastery, and next focus.
- [x] Limit dashboard review suggestions to two, with a link to the full queue.
- [x] Move the catalogue to `/lessons/library`.
- [x] Move detailed progress and quiz history to `/lessons/progress`.
- [x] Move adaptive path and revision recommendations to `/lessons/review`.
- [x] Include teacher-published content within the Library as labelled School lessons.
- [x] Add authenticated routes and back navigation for all lesson workspaces.

## My Learning Dashboard

- [x] Use a concise learner-focused heading and supporting text.
- [x] Render the recommended lesson with duration, objectives, explanation, and action.
- [x] Render the diagnostic action only when no diagnostic exists.
- [x] State the recommended next lesson until a persisted in-progress state is available.
- [x] Leave assignment/due-date space out because assignments are not in the current data model.
- [x] Provide no-diagnostic, no-progress, and no-review empty states.

## Curriculum Library

- [x] Render an accessible, responsive lesson list for desktop and mobile.
- [x] Group core content by unit and teacher content in a School lessons section.
- [x] Add text search plus completion and school-lesson filters.
- [x] Add sorting for curriculum order, recommended, completed, and school lessons first.
- [x] Standardise metadata, state labels, and lesson-card actions.
- [x] Use text labels rather than colour-only states.
- [x] Do not render locked lessons because no curriculum prerequisite exists.
- [x] Preserve deep links to built-in and custom lesson routes.

## Progress and Review

- [x] Present overall completion before detail.
- [x] Add per-unit completed/remaining progress and a plain-language mastery explanation.
- [x] Keep factual progress separate from recommendations.
- [x] Show recent quiz outcomes linked to their results pages.
- [x] Provide calm progress and review empty states.
- [x] Link diagnostic and quiz-derived recommendations to their corresponding lesson.
- [x] Keep the full revision queue and adaptive sequence on Review.

## Lesson Reader

- [x] Preserve read-aloud, completion, quiz, and previous-lesson support.
- [x] Add `My learning / Unit / Lesson title` breadcrumbs.
- [x] Generate a reachable outline from lesson headings.
- [x] Keep completion at the end of the lesson and announce success to screen readers.
- [x] Add predictable Previous lesson and Next lesson controls.
- [x] Keep the adaptive quiz contextual and available after completion.
- [x] Provide Back to My learning as the safe reader exit.

## Navigation, Accessibility, and Responsive Layout

- [x] Expose My learning, Library, Progress, and Review in compact lesson sub-navigation.
- [x] Keep the primary dashboard action and three-card summary in the initial desktop layout.
- [x] Collapse controls and actions for small screens without horizontal page overflow.
- [x] Preserve headings, landmarks, descriptive labels, status announcements, and existing visible focus styles.
- [x] Apply existing high-contrast, dyslexia-font, and text-scaling settings to all new routes.

## Data and Routing

- [x] Reuse progress, diagnostics, quiz results, custom lessons, and `buildStudentProfile`.
- [x] Extract shared workspace data and reusable lesson-card helpers.
- [x] Guard all `/lessons/*` routes with existing student authentication.
- [x] Preserve refresh, browser history, core lesson, quiz, and custom-lesson route behaviour.
- [x] Keep the previous all-in-one composition removed from `/lessons`.

## Quality Assurance and Acceptance

- [x] Confirm new and returning learner states render through the shared personalization data.
- [x] Confirm custom lessons, completion records, quiz unlocks, and quiz-result links use existing persistence and routes.
- [x] Confirm keyboard-accessible controls, screen-reader labels, and responsive layout rules are present.
- [x] Run `npm run build` successfully.
- [x] Ensure `/lessons` is no longer a catalogue, full adaptive path, revision queue, and detailed progress page combined.
- [x] Ensure learners have clear dedicated destinations to continue, browse, inspect progress, and review.
- [x] Ensure offline storage, personalization, custom lessons, read-aloud support, and quiz flow remain integrated.
