# ClassConnect — Industry-Standard School LMS Feature Roadmap

**Document Version:** 1.0.0  
**Target Environment:** Ghanaian & West African Junior High Schools (JHS 1–3 / B7–B9), Computer Labs, Hybrid/Air-Gapped Classrooms  
**Reference Standards:** GES (Ghana Education Service) CCP Curriculum, WAEC/BECE Assessment Guidelines, UNESCO Offline Digital Learning Standards, IMS Global LTI / QTI  

---

## Executive Summary & Gap Analysis

ClassConnect currently features a high-quality, modern client-side adaptive learning and assessment engine featuring 3PL IRT adaptive quizzes, Gemini-powered AI tutoring, browser-level proctoring, and a live teacher dashboard. 

However, real-world school adoption (by Headmasters, ICT Coordinators, Subject Teachers, and District Education Directorates) demands structural, administrative, and multi-device capabilities. Currently, all data is stored in the local browser's IndexedDB of a single machine, students share a flat unorganized list without classes/grades, teachers share a single 4-digit PIN, and lessons are hardcoded to 5 introductory modules.

This document categorizes the essential features and functions required to elevate ClassConnect into a **production-grade, industry-standard school learning and assessment management system**.

---

## Pillar 1: Class, Grade & Roster Management (Multi-Tenancy)

### Current Gap
Students exist in a single flat database table without grade levels, classes, or streams. In a school of 300+ students, a teacher cannot filter or group students.

### Industry-Standard Capabilities Needed:
1. **Hierarchical Class Organization**:
   - Academic Year (e.g., 2026/2027) & Terms (Term 1, Term 2, Term 3).
   - Grade Levels (B7 / JHS 1, B8 / JHS 2, B9 / JHS 3).
   - Streams / Sections (e.g., JHS 1A, JHS 1B, Green House, Gold Track).
2. **Official Student Identification**:
   - Unique Student Index / Admission Numbers (e.g., `GES/2026/0491`) alongside student names.
   - Gender and demographic tags (essential for national educational reporting metrics, e.g., girls in STEM).
3. **Bulk Roster Import & Export**:
   - Excel / CSV drag-and-drop roster upload with validation and error-checking.
   - Batch auto-generation of initial student 4-digit PINs with printable student login slips/cards.
4. **Student Credential Management**:
   - Teacher ability to reset a student's forgotten PIN from the dashboard in 1 click.
   - Student transfer between classes or archiving of graduated cohorts.

---

## Pillar 2: Multi-Device Computer Lab Networking & Offline Sync

### Current Gap
IndexedDB is sandboxed to the single browser on the single PC. In a school computer lab with 20–40 desktop computers, each computer is an isolated island:
- A student logging into PC #4 cannot access work done on PC #12.
- The teacher’s PC does not see submissions made on student lab PCs unless all PCs are connected to the internet.

### Industry-Standard Capabilities Needed:
1. **Local Lab Server Mode ("Teacher PC as Host / Hub")**:
   - The teacher's PC runs as a local lightweight LAN server (via Node / local IP or mDNS, e.g., `http://classconnect.local:5173` or `http://192.168.1.100:5173`).
   - All student desktop computers in the lab connect over local Wi-Fi or LAN cable without needing internet access.
   - All diagnostic, quiz, progress, and assessment records automatically sync back to the teacher's central database.
2. **Air-Gapped "Sneakernet" Sync (USB / QR / File-Based)**:
   - For labs without local routers: a student finishes an assessment and downloads an encrypted session token file (`.ccsub`).
   - The teacher inserts a USB drive or uploads the batch of files to their dashboard with automatic deduplication and grading reconciliation.
3. **Hybrid Cloud Sync**:
   - When internet is available, optionally backup the teacher's local database to a cloud backend (Firebase / Supabase / School District Server).

---

## Pillar 3: Official Assessment, Continuous Assessment (SBA) & Report Cards

### Current Gap
The app calculates raw percentages and theta ability scores, but schools require GES-compliant Continuous Assessment (SBA), terminal summative weighting, and standard grading scales.

### Industry-Standard Capabilities Needed:
1. **Continuous Assessment (SBA) Weighting Engine**:
   - Configurable formula: e.g., Class Exercises / Quizzes (30%) + Mid-Term / Diagnostic Projects (20%) + End of Term Exam (50%) = 100%.
2. **GES & Standard Letter Grading Scales**:
   - **Ghana Basic Education Certificate Examination (BECE) 9-Point Scale**:
     - Grade 1: 90–100% (Highest / Excellent)
     - Grade 2: 80–89% (Higher)
     - Grade 3: 70–79% (High)
     - Grade 4: 60–69% (High Average)
     - Grade 5: 55–59% (Average)
     - Grade 6: 50–54% (Low Average)
     - Grade 7: 45–49% (Lower)
     - Grade 8: 40–44% (Lowest)
     - Grade 9: 0–39% (Fail)
   - Configurable conversion to A–F letter grades or percentage mastery standards.
3. **Printable Terminal Report Cards**:
   - Print-optimized CSS (`@media print`) and PDF export for individual student report cards.
   - Includes: Student Photo / Avatar, Term, Class Teacher Remarks, Attendance, Subject Breakdown, IRT Mastery Trajectory, and Principal/Headmaster Signature line.
4. **Broadsheet / Master Gradebook View**:
   - Full tabular grid showing all students down rows, all lessons and assessments across columns, with rank, GPA, and total score calculations.

---

## Pillar 4: Multi-Teacher & Role-Based Access Control (RBAC)

### Current Gap
A single global 4-digit PIN locks the teacher dashboard. Anyone with the PIN has full destructive access to all settings, student records, and exports.

### Industry-Standard Capabilities Needed:
1. **User Roles**:
   - **School Administrator / Headmaster**: Full access to all classes, teacher assignments, system backups, and school-wide analytics.
   - **Subject Teacher**: Access only to assigned classes, lesson authoring, and grading.
   - **Invigilator / Lab Tech**: Ability to launch exams, monitor live student screens, and reset student lab sessions without seeing question answers or school records.
2. **Individual Teacher Accounts**:
   - Email/Username + Secure Password or Teacher PIN with account lockouts on repeated failures.
   - Teacher profile (Name, Department, Assigned Subjects/Classes).
3. **Audit Trail & Action Logs**:
   - Log of who generated assessments, who altered student grades, and who exported school records for accountability and integrity.

---

## Pillar 5: Curriculum & Content Management System (CMS)

### Current Gap
Lesson contents and quiz banks are hardcoded into `src/data/lessons.js` and `src/data/quiz-bank.js`. Teachers cannot add lessons, edit existing text, or support other subjects (e.g., Mathematics, Integrated Science).

### Industry-Standard Capabilities Needed:
1. **Visual Lesson Authoring**:
   - WYSIWYG / Markdown editor for teachers to create new lessons or customize existing ones.
   - Ability to add objectives, key terms, diagrams, code snippets, and review questions.
2. **Multi-Strand & Multi-Subject Curriculum Structure**:
   - Organization by Subject (e.g., Computing, Science, Maths) and Curriculum Strands:
     - *Strand 1: Introduction to Computing*
     - *Strand 2: Productivity Software (Word Processing, Spreadsheets)*
     - *Strand 3: Communication Networks & Internet Safety*
     - *Strand 4: Computational Thinking & Basic Programming*
3. **Custom Question Bank Editor**:
   - Teachers can author Multiple Choice, True/False, Fill-in-the-Blank, Short Answer, and Coding questions.
   - Tagging questions by Bloom's Taxonomy (Knowledge, Comprehension, Application, Analysis) and IRT difficulty parameter.
4. **Lesson Pack Import/Export**:
   - Teachers can share curated curriculum bundles (`.ccpack` zip files) with neighboring schools on flash drives.

---

## Pillar 6: Live Classroom Management & Lab Control ("Exam Mode")

### Current Gap
Assessments have local proctoring (tab detection, copy-paste lock), but the teacher has no real-time awareness of what students are doing across the lab during the test.

### Industry-Standard Capabilities Needed:
1. **Live Lab Monitor Grid**:
   - Teacher dashboard shows a grid of student tiles representing every active PC in the lab.
   - Real-time status indicators: `Reading Lesson`, `Taking Quiz #2`, `In Exam (Question 4/10)`, `Idle / Inactive`, `Flagged Anomaly`.
2. **Synchronized Exam Broadcast ("Start Exam Together")**:
   - Teacher pushes "Start Assessment" from the dashboard; all student screens unlock and enter fullscreen exam mode simultaneously.
   - Teacher can remotely pause the exam or force-submit all active tests when class time expires.
3. **Real-Time Proctor Alerts**:
   - Immediate red badge on the teacher monitor if a student switches tabs, exits fullscreen, or attempts a keyboard shortcut.

---

## Pillar 7: Attendance, Punctuality & Behavioral Tracking

### Current Gap
ClassConnect tracks lesson completions, but schools must account for student presence and participation.

### Industry-Standard Capabilities Needed:
1. **Digital Attendance Register**:
   - Quick one-click roll-call interface: Present, Late, Absent, Excused.
   - Auto-marking attendance based on student login during scheduled class periods.
2. **Attendance Analytics**:
   - Correlation analysis between attendance rates and IRT ability scores / risk factors (e.g., "Students missing >3 sessions show 40% higher risk of failing B7 Strand 1").

---

## Pillar 8: Accessibility, Inclusion & Voice Support

### Current Gap
Content is currently visual/text-only. Students with reading difficulties, visual impairments, or non-native English fluency have no accommodation.

### Industry-Standard Capabilities Needed:
1. **Offline Text-to-Speech (Web Speech API)**:
   - "Read Aloud" button on lesson sections, key terms, and question stems using the browser's built-in offline speech synthesizer.
2. **Accessibility Settings & Assistive Modes**:
   - Dyslexia-friendly font toggle (OpenDyslexic).
   - Adjustable font scaling (Normal, Large, Extra Large).
   - High-contrast mode optimized for low-grade CRT/LCD monitors commonly found in older school labs.
3. **Bilingual / Local Context Glossary**:
   - Key computing terms with contextual Ghanaian English and local dialect analogies (Twi, Ga, Ewe equivalents for concepts like memory, processing, and networks).

---

## Pillar 9: System Maintenance, Backup, Archival & Data Safety

### Current Gap
If a browser's cache is cleared or a computer crashes, all stored student records, quiz results, and diagnostic histories are lost with no recovery path.

### Industry-Standard Capabilities Needed:
1. **Automated & Manual Full-School Backup**:
   - 1-click "Download Complete School Backup" producing an encrypted, timestamped archive (`classconnect-backup-2026-09-03.ccdb`).
   - "Restore from Backup" workflow with sanity checks to prevent data corruption.
2. **Academic Year Roll-Over & Archiving**:
   - End-of-year wizard: Archive the current year's records to cold storage, promote JHS 1 students to JHS 2, and clean active rosters.
3. **Data Privacy Compliance**:
   - Anonymized export option for reporting to district educational offices without exposing personal student names.

---

## Recommended Implementation Phasing

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: CORE LAB & ROSTER READINESS (Immediate Next Step)             │
│ • Class & Stream Organization (JHS 1A, 1B, 2A, etc.)                   │
│ • Bulk CSV Student Import & Login Card Generator                       │
│ • Teacher PIN Reset for Students                                       │
│ • Full School JSON/ZIP Backup & Restore Utility                        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: GES ASSESSMENT & GRADEBOOK COMPLIANCE                         │
│ • Continuous Assessment (SBA) Weighting (30% Formative / 70% Exam)     │
│ • GES BECE 9-Point Grading Scale conversion                            │
│ • Printable Student Terminal Report Card (PDF & CSS Print)             │
│ • Master Broadsheet Gradebook Table in Dashboard                       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: MULTI-PC LAB NETWORKING & LIVE MONITORING                     │
│ • Local LAN Server / Hub Mode for Multi-PC Lab Sync                    │
│ • Offline USB "Sneakernet" Token Submission Collector                  │
│ • Live Lab Classroom Monitor (Real-time student status tiles)          │
│ • Synchronized Exam Lock/Unlock Broadcast                              │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: CMS, ACCESSIBILITY & ENTERPRISE POLISH                        │
│ • Custom Lesson & Question Bank Authoring UI                           │
│ • Offline Text-to-Speech (Web Speech API) & Accessibility Panel        │
│ • Multi-Teacher Role-Based Access Control                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

*This document is saved under `tasks/industry-standard-school-features.md` for review and architectural sign-off prior to component implementation.*
