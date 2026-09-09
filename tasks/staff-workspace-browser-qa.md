# Staff Workspace Browser QA

**Execution status (2026-09-09):** Automated preflight passed: local app endpoint returned HTTP 200 and `npm run test:workspace` passed (3/3). Interactive browser scenarios remain pending because the browser automation bridge is unavailable in this session.

- [x] Verify local application endpoint responds successfully.
- [x] Run RBAC workspace contract tests (`npm run test:workspace`).

Run these scenarios in a browser after each deployment or PWA cache refresh.

- [ ] Administrator: sign in, open every workspace, create/edit staff, create class, export/restore backup, and review audit filtering.
- [ ] Subject Teacher: confirm only assigned classes appear in the global selector, learner directory, roster, and gradebook.
- [ ] Invigilator: confirm only Lab Monitor is visible and direct routes to learners, gradebook, assessments, curriculum, and administration display Access restricted.
- [ ] Desktop: verify the Overview summary fits at 1366×768 and sidebar navigation remains visible.
- [ ] Tablet/mobile: verify the compact horizontal workspace navigation, filters, tables, and modals have no page-level horizontal overflow.
- [ ] Accessibility: verify keyboard focus, high contrast, dyslexia-friendly font, and large-text modes across Overview, Learners, Gradebook, and Administration.
