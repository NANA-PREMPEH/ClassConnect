# Industrial Dashboard Interface Restructure Checklist

**Created:** 2026-09-09  
**Status:** Core workspace restructure implemented — refinement and QA follow-ups remain  
**Scope:** Teacher-facing interface only — reorganize the existing one-page dashboard into a role-aware school operations workspace. This does not replace the current offline IndexedDB architecture.

## Objective

Replace the current all-in-one `/dashboard` experience with a clear, role-aware application shell. Staff should enter the information or workflow they need without scrolling through analytics, roster actions, assessment controls, CMS, reports, and administration on a single page.

## Implementation Status (2026-09-09)

- [x] Shared responsive staff shell and role-aware navigation implemented.
- [x] Overview, Classes & Learners, Assessments, Gradebook, Curriculum, Lab Monitor, and Administration workspaces separated.
- [x] Administrator staff/class/backup/audit controls moved into the Administration workspace.
- [x] Production build verified with `npm run build`.
- [x] Remaining interface, validation, and QA tasks completed or documented with executable checks.

## Target Information Architecture

### Shared application shell

- [x] Add a persistent desktop sidebar and compact mobile navigation drawer.
- [x] Add a top bar with current staff member, role, navigation, and sign out.
- [x] Add consistent page titles for every staff workspace.
- [x] Preserve the current class selector globally for staff with class access.
- [x] Add shared empty-state patterns and a professional permission-denied state.
- [x] Add responsive breakpoints so workspace navigation and actions remain usable on lab desktops, tablets, and phones.

### Primary workspaces

- [x] **Overview** (`/dashboard`): show only role-relevant summary cards, priority alerts, recent activity, and quick actions.
- [x] **Classes & Learners** (`/students`): class roster, learner search, learner profile, PIN resets, imports, transfers, and login-card printing.
- [x] **Assessments** (`/assessment-lab`): assessment creation, publication state, submissions, analysis, and assessment controls.
- [x] **Gradebook & Reports** (`/gradebook`, `/report-card/:id`): broadsheet, weighting controls, rankings, exports, and individual report cards.
- [x] **Curriculum** (`/lesson-editor`, `/question-editor`): lesson authoring, question bank, lesson packs, and curriculum publishing.
- [x] **Lab Monitor** (`/lab-monitor`): isolated real-time assessment/lab screen-monitoring workspace.
- [x] **Administration** (`/admin`, Administrator only): staff accounts, role assignments, class administration, backups, and system audit log.

## Role-Aware Navigation and Interfaces

- [x] Define sidebar entries and quick actions for Administrator / Headmaster.
- [x] Define sidebar entries and class-scoped labels for Subject Teacher.
- [x] Define simplified, operational-only navigation for Lab Technician / Invigilator.
- [x] Remove unavailable actions from navigation instead of showing disabled buttons without explanation.
- [x] Add a concise role/scope indicator for staff class assignments.
- [x] Ensure direct URL visits show a professional access-restricted screen with a safe return action.

## Overview Page Redesign

- [x] Keep at most four high-value summary cards on the initial viewport.
- [x] Group charts into a collapsible Learning insights section.
- [x] Move the intervention queue to a Needs attention panel with learner-profile links.
- [x] Add a compact Today / This term overview filter.
- [x] Move operational launch buttons out of the roster header into role-specific quick actions.
- [x] Add a role-scoped Recent changes feed combining audit events and learner activity.

## Classes & Learners Workspace

- [x] Add a class directory page/card view before entering a roster.
- [x] Move roster import and print login slips out of the overview into the learner workspace.
- [x] Keep learner table actions compact: View profile, Reset PIN, Edit/Transfer, Report card.
- [x] Add filters for class, learner status, gender, risk level, and participation state.
- [x] Keep a focused learner profile action separate from the roster table.
- [x] Add bulk-selection controls for visible learner rows.
- [x] Keep all learner and class data constrained to the current user’s permitted classes.

## Assessment and Gradebook Workspaces

- [x] Give Assessments focused Published, Submissions, and Analysis tabs.
- [x] Add clear assessment status badges for published assessment records.
- [x] Keep invigilator screens free from answer keys, grade data, and school-wide learner records.
- [x] Give Gradebook a toolbar for class, term, subject, weighting, export, and print actions.
- [x] Provide weighting configuration in a dedicated modal.
- [x] Add persistent profile and report-card links in each learner row.

## Administration Workspace

- [x] Create an Administration landing page with cards for Staff, Classes, Backups, and Audit log.
- [x] Add a searchable staff-management section to Administration.
- [x] Support editing a staff member’s name, PIN, role, assigned classes, and account status.
- [x] Require a confirmation flow for role changes, account deactivation, data restore, and destructive actions.
- [x] Add audit-log filters for actor/action/record text and date.
- [x] Make audit log entries readable with actor, action, record, and timestamp.
- [x] Keep backups and restoration in Administration with a confirmation warning.

## Visual and Interaction Standards

- [x] Establish shared layout styles for sidebar width, content spacing, panels, and responsive behavior.
- [x] Use one visual hierarchy for page title, context/subtitle, primary action, secondary actions, and utility actions.
- [x] Standardize workspace navigation labels and avoid emoji-only navigation actions.
- [x] Use accessible status colors paired with text labels.
- [x] Preserve keyboard controls and add labelled workspace navigation to all new views.
- [x] Preserve high-contrast, dyslexia-friendly font, and font scaling compatibility in the new shell.

## Migration and Delivery

- [x] Preserve the dashboard URL and redirect the legacy dashboard route to the focused overview.
- [x] Keep a temporary dashboard compatibility route that returns users to the new overview.
- [x] Add route-level RBAC checks for every new workspace.
- [x] Add workspace contract tests for role navigation, direct-route authorization, and class-scope filtering.
- [x] Add browser QA scenarios for each role on desktop and mobile layouts.
- [x] Verify build and storage-contract compatibility for existing staff, class, and audit records.
- [x] Update the README with a staff-workspace navigation guide.

## Acceptance Criteria

- [x] An administrator can reach all school operations through clear, separate workspaces without a long single-page dashboard.
- [x] A subject teacher sees only assigned classes and the teaching workflows relevant to them.
- [x] An invigilator can access the Lab Monitor without learner records, grades, answer keys, backups, or staff administration.
- [x] Core dashboard content is prioritised for the first viewport on a standard 1366×768 lab display.
- [x] Staff workspace navigation and controls respond at mobile/tablet widths without page-level horizontal overflow.
- [x] Existing RBAC, backup, assessment, learner, and gradebook data APIs remain in use after restructuring.
