# Industry-Standard School LMS Implementation To-Do List

**Date Created:** 2026-09-03  
**Status:** Ready for Review & Planning  
**Target Specification:** [`tasks/industry-standard-school-features.md`](file:///c:/Users/HP/Documents/GitHub/ClassConnect/tasks/industry-standard-school-features.md)  
**Primary Objective:** Upgrade ClassConnect from single-browser isolated learner tool to a production-ready, industry-standard school LMS for computer labs and classroom environments.

---

## Phase 1: Core Lab & Roster Multi-Tenancy (Immediate Priority)

### 1.1 Hierarchical Class & Grade Data Model
- [x] **Schema & Store Updates (`src/engine/storage.js`)**
  - Add `classes` store: `{ id, gradeLevel, stream, academicYear, term, teacherName, createdAt }`
  - Enhance `students` store to include: `classId`, `indexNumber`, `gender`, `status: 'active' | 'transferred' | 'graduated'`
  - Create index on `students` by `classId` and by `indexNumber`
- [x] **Database Migration Handler (`src/engine/storage.js`)**
  - Upgrade IndexedDB version to v7 safely with non-blocking migration.
  - Automatically associate existing learners to a default "B7 — JHS 1A" class to avoid data loss.

### 1.2 Class & Roster Management UI
- [x] **Class Switcher & Manager in Dashboard (`src/views/dashboard.js`, `src/styles/dashboard.css`)**
  - Add Class Selector dropdown in dashboard header (e.g. "All Classes", "B7 — JHS 1A").
  - Filter all statistics, risk lists, activity feeds, and rosters by selected class.
  - "Classes" button and "Manage School Classes" modal with class creation form.
- [x] **Enhanced Student Roster View (`src/views/dashboard.js`)**
  - Add columns for Index Number, Name, Class/Stream badge, Gender, Lessons, Quizzes, Latest Score, Risk, and Actions.
  - Search/filter students by name or index number in real-time.
  - "Edit / Transfer" student modal to change class, name, gender, or status.

### 1.3 Bulk CSV Roster Import & Login Cards
- [x] **CSV / Excel Parser & Validator (`src/engine/roster-importer.js`)**
  - Support template: `Index Number, Full Name, Class, Gender, PIN`.
  - Auto-generate secure 4-digit PINs if missing; detect internal and database duplicates.
  - Preview modal showing valid records count, warnings, and error rows before commit.
  - Downloadable sample CSV template for teachers.
- [x] **Bulk Student Login Card Generator (`src/views/dashboard.js`, `src/styles/dashboard.css`)**
  - Printable card layout with 8 cards per A4 page (`@media print`).
  - Each slip includes: School Name, Student Name, Index Number, Assigned Class, 4-digit PIN, and URL/Login instructions.

### 1.4 Student PIN & Credential Management
- [x] **Teacher PIN Reset for Students (`src/views/dashboard.js`, `src/engine/storage.js`)**
  - "Reset PIN" button in student row and drill-down profile modal in teacher dashboard.
  - Teacher can set a new 4-digit PIN or auto-generate a random one.
- [x] **Student Login Enhancement (`src/views/student-login.js`)**
  - Allow login via Name OR Index Number + 4-digit PIN.
  - Recent students show class stream badges.

### 1.5 System Backup, Disaster Recovery & Archival
- [x] **Full-School Backup Generator (`src/engine/storage.js`)**
  - Export all IndexedDB stores (`classes`, `students`, `progress`, `quizResults`, `diagnostics`, `tutorThreads`, `assessments`, `assessmentSubmissions`, `feedbackCache`, `settings`) into a single timestamped JSON file.
- [x] **Backup Restoration Workflow (`src/views/dashboard.js`, `src/engine/storage.js`)**
  - File picker in Teacher Settings with confirmation prompt and schema validation.
  - Safe restore with option to merge or overwrite records.

---

## Phase 2: GES Assessment & Gradebook Compliance

### 2.1 Continuous Assessment (SBA) Weighting Engine
- [x] **Assessment Weighting Engine (`src/engine/gradebook.js`)**
  - Configurable weighting formulas:
    - Formative / SBA: Class exercises & adaptive quizzes (default 30%)
    - Mid-Term Diagnostic / Project (default 20%)
    - Summative End-of-Term Assessment (default 50%)
  - Interactive teacher percentage adjustment panel in Gradebook view with real-time recalculation.

### 2.2 Official GES BECE 9-Point & Standard Letter Grading
- [x] **Grading Scale Transformer (`src/engine/gradebook.js`)**
  - Implement GES BECE 9-Point grading standard:
    - `Grade 1` (90–100%, Excellent)
    - `Grade 2` (80–89%, Very Good)
    - `Grade 3` (70–79%, Good)
    - `Grade 4` (60–69%, High Average)
    - `Grade 5` (55–59%, Average)
    - `Grade 6` (50–54%, Low Average)
    - `Grade 7` (45–49%, Lower)
    - `Grade 8` (40–44%, Lowest)
    - `Grade 9` (0–39%, Fail)
  - Secondary conversion for WAEC letter grades (`A1` to `F9`) and curricular descriptors.

### 2.3 Master Broadsheet Gradebook View
- [x] **Tabular Broadsheet Grid (`src/views/gradebook.js`, `src/styles/gradebook.css`)**
  - High-density tabular view: Students along Y-axis, Lessons/Quizzes/Assessments along X-axis.
  - Columns for: Rank (with medal badges), Index Number, Name, Lesson 1–5 quiz scores, SBA Raw, Diagnostic Raw, Exam Raw, Final Percentage, BECE Grade, and Action link.
  - Direct CSV export of the full broadsheet for school administrative records.

### 2.4 Printable Terminal Report Cards
- [x] **Student Terminal Report Card View (`src/views/report-card.js`, `src/styles/report-card.css`)**
  - Print-optimized CSS stylesheet (`@media print`) matching standard Ghana Education Service terminal assessment sheets.
  - Header: Republic of Ghana / GES flag stripe, School Name, Academic Year, Term, Student Name, Index Number, Class/Stream, Attendance record.
  - Performance Breakdown table: Strand breakdown, Quiz score, Exam score, Weighted %, Grade, Teacher competency assessment.
  - Summary Score Ribbon: Continuous SBA (30%), Exam (50%), Composite %, BECE Grade badge.
  - Conduct appraisal, Headmaster's remarks, and official signature lines for Teacher and Headmaster.

---

## Phase 3: Multi-PC Computer Lab Networking & Live Monitoring

### 3.1 Local Lab LAN Server Mode ("Host Mode")
- [x] **CLI / Dev Server Host Configuration (`vite.config.js`, `package.json`)**
  - Added `npm run lab` with `--host 0.0.0.0` so all PCs on the local lab Wi-Fi/switch can access `http://<teacher-ip>:5173`.
  - Teacher starts a lab session from Live Lab Monitor and receives a copyable student join link.
- [ ] **Dashboard IP / QR Provisioning**
  - Display clear local IP address and an offline QR code in the teacher dashboard header for lab setup.
- [ ] **Local Network Sync Protocol (`src/engine/storage.js`, `src/engine/lan-sync.js`)**
  - Optional WebSocket / HTTP lightweight sync endpoint for multi-computer labs so student PCs push quiz/assessment submissions straight to the teacher's host database.

### 3.2 Air-Gapped "Sneakernet" Token Submission (For Labs without Network)
- [ ] **Encrypted Submission File Exporter (`src/views/assessment-session.js`, `src/views/quiz-results.js`)**
  - If offline and not connected to a lab host, student can click "Save Submission to USB".
  - Generates compact, tamper-resistant `.ccsub` file containing encrypted responses, proctor events, and timing.
- [ ] **Batch Submission Collector in Dashboard (`src/views/dashboard.js`)**
  - Teacher drags & drops folder of `.ccsub` files from USB drive into dashboard.
  - Automatic parsing, verification, duplicate prevention, and real-time gradebook update.

### 3.3 Live Lab Classroom Monitor Grid ("Exam Control")
- [x] **Live Classroom Monitor Board (`src/views/lab-monitor.js`, `src/styles/lab-monitor.css`)**
  - Grid of live cards representing all active students/PCs in the lab.
  - Status tags: `Reading Lesson`, `Adaptive Quiz`, `Taking Assessment (Q5/10)`, `Completed`, `Idle >2m`.
  - Real-time red warning banner if proctoring detects fullscreen exit or tab hiding during assessments.
- [ ] **Synchronized Exam Broadcast**
  - Teacher clicks "Unlock Assessment [Title]" -> pushes unlock state to lab session.
  - "Lock All Screens" / "Force Submit All" buttons for exam time termination.

---

## Phase 4: CMS, Accessibility & Enterprise Polish

### 4.1 Visual Lesson & Question Bank CMS
- [x] **Lesson Authoring View (`src/views/lesson-editor.js`, `src/styles/assessment.css`)**
  - Local authoring form for title, subject, strand, objectives, key terms, and Markdown/HTML-compatible lesson body.
- [ ] **CMS Illustration & Curriculum Delivery Integration**
  - Add illustration upload/selection and surface custom lessons alongside the student curriculum.
- [x] **Question Bank Editor (`src/views/question-editor.js`)**
  - Local authoring form for MCQ, true/false, fill-in-the-blank, short-answer, and coding question records with Bloom tags and IRT difficulty.
- [ ] **Question Bank Editing & Assessment Integration**
  - Add saved-question editing and selection from the Assessment Lab.
- [ ] **Lesson Pack (.ccpack) Exporter / Importer**
  - Share curriculum units across schools via zip archives.

### 4.2 Accessibility & Voice Synthesis
- [x] **Offline Text-to-Speech Engine (`src/engine/speech.js`)**
  - Integrated browser Web Speech API (zero dependencies) with lesson-level "Listen" / stop controls and speech-speed selection.
- [ ] **Expanded Read-Aloud Coverage**
  - Add individual controls beside lesson paragraphs, key terms, and quiz question stems, plus pitch and voice selection.
- [x] **Assistive Display Mode**
  - Toggle for OpenDyslexic typeface.
  - High-contrast color theme for low-contrast CRT/LCD lab monitors.
  - Font size zoom controls (Standard, Large, Extra Large).

### 4.3 Multi-Teacher & Role-Based Access Control (RBAC)
- [ ] **User Role Management (`src/engine/storage.js`)**
  - Roles: `Admin/Headmaster`, `Subject Teacher`, `Lab Technician/Invigilator`.
  - Separate login credentials and permission matrix.
- [ ] **System Audit Log (`src/views/dashboard.js`)**
  - Chronological log of grade modifications, assessment releases, and student record exports.

---

## Primary File Architecture Impact

```
ClassConnect/
├── src/
│   ├── engine/
│   │   ├── storage.js          # [MODIFY] Upgraded schemas, classes store, backup/restore
│   │   ├── gradebook.js        # [NEW] GES 9-point scale, SBA 30/70 weighting
│   │   ├── roster-importer.js  # [NEW] CSV/Excel parsing and validation
│   │   ├── lan-sync.js         # [NEW] Multi-PC local lab sync protocol
│   │   └── speech.js           # [NEW] Offline Web Speech API TTS helper
│   ├── views/
│   │   ├── dashboard.js        # [MODIFY] Class switcher, live lab monitor link, roster actions
│   │   ├── gradebook.js        # [NEW] Tabular broadsheet master gradebook
│   │   ├── report-card.js      # [NEW] Printable student terminal report cards
│   │   ├── lab-monitor.js      # [NEW] Real-time classroom live screen board
│   │   ├── lesson-editor.js    # [NEW] Visual CMS for custom lesson content
│   │   └── student-login.js    # [MODIFY] Class filter, Index Number support
│   └── styles/
│       ├── gradebook.css       # [NEW] Broadsheet styles
│       ├── report-card.css     # [NEW] Print-optimized CSS (@media print)
│       └── lab-monitor.css     # [NEW] Live monitor tiles & anomaly indicators
└── tasks/
    ├── industry-standard-school-features.md  # Architectural specification
    └── industry-standard-features-todo.task.md # This implementation checklist
```

---

## Validation & Verification Checklist

- [ ] `npm run build` succeeds with zero errors.
- [ ] Upgraded IndexedDB preserves all existing student profiles, progress, and quiz histories.
- [ ] CSV import correctly ingests sample roster of 40 students with valid class tags.
- [ ] Report card view prints cleanly to standard A4 paper format without cutoff.
- [ ] One-click backup file can be exported and successfully restored on a fresh browser instance.
