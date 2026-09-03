# Live Teacher Dashboard Checklist

Updated: 2026-07-05

This checklist tracks the live teacher dashboard work for ClassConnect.

## Core Features

- [x] Database-backed dashboard snapshot
  Description: The teacher dashboard now rebuilds its analytics directly from IndexedDB data for students, progress, quizzes, diagnostics, assessments, and submissions.
- [x] Live dashboard refresh
  Description: The dashboard now refreshes automatically after local database writes and also runs a timed heartbeat refresh while visible.
- [x] Teacher roster from database
  Description: The student roster is rendered from stored learner records, quiz history, progress, and risk status on the device.
- [x] Live chart refresh
  Description: Lesson scores, ability distribution, and misconception charts are re-rendered after live updates so the visuals stay current.

## Advanced Features

- [x] Cross-tab live sync
  Description: Data-change events now use a local event bus plus BroadcastChannel so dashboard updates can react across open tabs when supported.
- [x] Recent activity feed
  Description: The dashboard now shows a live activity panel for quiz completions, lesson completions, diagnostics, assessment publishing, and assessment submissions.
- [x] Manual refresh control
  Description: Teachers can trigger an immediate refresh from the dashboard header at any time.

## Teacher Experience

- [x] Added live sync status strip with last-updated time
- [x] Kept export and Assessment Lab shortcuts in the roster area
- [x] Preserved student drill-down modal with personalized risk and quiz history
- [x] Replaced the old no-data hard stop with a zero-state dashboard that can update live as records arrive

## Persistence and Events

- [x] Added storage-level `classconnect:datachange` event dispatching
- [x] Added `subscribeToDataChanges()` helper for live listeners
- [x] Emitted change events for students, progress, quiz results, diagnostics, tutor memory, assessments, and assessment submissions
- [x] Added dashboard teardown on route change to stop background listeners

## Documentation and Validation

- [x] Added this implementation tracker
- [ ] Manual browser QA for flow: teacher dashboard open -> student completes quiz -> dashboard updates live
- [ ] Manual browser QA for cross-tab sync behavior
- [x] Production build passes with `npm run build`
- [ ] Optional future enhancement: teacher filters by lesson, risk band, or time window

## Primary Files Touched

- `src/views/dashboard.js`
- `src/styles/dashboard.css`
- `src/engine/storage.js`
- `src/main.js`
