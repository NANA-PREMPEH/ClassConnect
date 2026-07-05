# ClassConnect — Implementation Plan

**One-sentence pitch:** An offline-capable web app that delivers a JHS Computing topic with AI-personalized quiz feedback, and gives the teacher a live dashboard of who's struggling and why.

## Curriculum Scope

**Topic strand:** *Introduction to Computer Systems* (GES CCP Computing, Basic 7)

Five lessons, tightly scoped:

| # | Lesson Title | Content Focus |
|---|---|---|
| 1 | What Is a Computer? | Definition, types (desktop, laptop, tablet, smartphone), generations overview |
| 2 | Inside the Computer | Motherboard, CPU, RAM, storage — with labelled diagrams |
| 3 | Input Devices | Keyboard, mouse, touchscreen, scanner, microphone — how they work |
| 4 | Output Devices | Monitor, printer, speaker, projector — matching input↔output |
| 5 | Storage & Putting It All Together | HDD vs SSD vs flash, how a computer system works end-to-end |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    ClassConnect (Vite PWA)                │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Lesson      │  │  Adaptive    │  │  Teacher       │  │
│  │  Viewer      │  │  Quiz Engine │  │  Dashboard     │  │
│  │  (offline)   │  │  (IRT-based) │  │  (Chart.js)    │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                 │                  │           │
│  ┌──────▼─────────────────▼──────────────────▼────────┐  │
│  │              Local State (localStorage/IndexedDB)   │  │
│  └─────────────────────────┬──────────────────────────┘  │
│                            │                             │
│  ┌─────────────────────────▼──────────────────────────┐  │
│  │           Service Worker (Workbox via vite-plugin)  │  │
│  └────────────────────────────────────────────────────┘  │
│                            │                             │
└────────────────────────────┼─────────────────────────────┘
                             │ (online only)
                    ┌────────▼────────┐
                    │  AI Feedback    │
                    │  (Gemini API)   │
                    └─────────────────┘
```

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Build tool** | Vite 6 | Fast, modern, excellent PWA plugin |
| **Framework** | Vanilla JS (ES modules) | No framework overhead — runs on cheapest phones, simplest mental model, smallest bundle |
| **Styling** | Vanilla CSS with custom properties | Design system tokens, no build dependency |
| **PWA** | `vite-plugin-pwa` + Workbox | Cache-first for lessons, network-first for AI feedback |
| **Adaptive quiz** | Custom lightweight IRT (3PL model) | ~100 lines of math — no library dependency needed for our scope |
| **AI feedback** | Google Gemini API (`gemini-2.0-flash`) | Free tier is generous; graceful offline fallback to pre-written hints |
| **Charts** | Chart.js 4 (via CDN, cached by SW) | Lightweight, well-known, offline-cacheable |
| **Data persistence** | localStorage + IndexedDB | No server needed — all data stays on-device |
| **Deployment** | GitHub Pages or Vercel | Free, HTTPS by default (required for SW) |

> [!IMPORTANT]
> **No backend server.** The entire app runs client-side. AI calls go directly from the browser to the Gemini API. Student data lives in IndexedDB. This means:
> - Zero hosting cost
> - Works offline after first load
> - No login/auth complexity for the MVP
> - Teacher dashboard reads from the same device's IndexedDB (multi-student scenario: students use the app on a shared device, each with a name/PIN)

---

## Proposed File Structure

```
ClassConnect/
├── index.html                    # Entry point — app shell
├── vite.config.js                # Vite + PWA config
├── package.json
├── public/
│   ├── favicon.svg
│   ├── icons/                    # PWA icons (192, 512)
│   └── images/                   # Lesson illustrations
├── src/
│   ├── main.js                   # App bootstrap, router, navigation
│   ├── styles/
│   │   ├── index.css             # Design system: tokens, reset, typography
│   │   ├── components.css        # Reusable component styles
│   │   ├── lessons.css           # Lesson viewer styles
│   │   ├── quiz.css              # Quiz UI styles
│   │   └── dashboard.css         # Teacher dashboard styles
│   ├── data/
│   │   ├── lessons.js            # All 5 lessons: title, content (HTML), images
│   │   ├── quiz-bank.js          # Item bank with IRT params (a, b, c per question)
│   │   └── fallback-hints.js     # Offline AI fallback: pre-written explanations
│   ├── engine/
│   │   ├── adaptive-quiz.js      # IRT ability estimation + item selection
│   │   ├── ai-feedback.js        # Gemini API call + offline fallback
│   │   └── storage.js            # IndexedDB/localStorage abstraction
│   ├── views/
│   │   ├── home.js               # Landing / role select (Student vs Teacher)
│   │   ├── student-login.js      # Simple name + PIN entry
│   │   ├── lesson-viewer.js      # Renders lesson content, tracks completion
│   │   ├── quiz.js               # Adaptive quiz UI
│   │   ├── quiz-results.js       # Score + AI feedback display
│   │   └── dashboard.js          # Teacher dashboard with charts
│   └── components/
│       ├── nav.js                # Top navigation bar
│       ├── progress-bar.js       # Lesson/quiz progress indicator
│       ├── question-card.js      # Single quiz question component
│       ├── feedback-card.js      # AI feedback display card
│       └── stat-card.js          # Dashboard metric card
└── README.md                     # Comprehensive project documentation
```

---

## Proposed Changes — Detailed

### 1. Project Scaffold & Build Config

#### [NEW] [package.json](file:///c:/Users/HP/Documents/GitHub/ClassConnet/package.json)
- Vite 6, `vite-plugin-pwa`, Chart.js as dependencies
- Scripts: `dev`, `build`, `preview`

#### [NEW] [vite.config.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/vite.config.js)
- PWA manifest configuration (name, icons, theme color, start URL)
- Workbox config: precache all static assets (`**/*.{js,css,html,svg,png,webp}`)
- Runtime caching: Cache-First for lesson images, Network-First for Gemini API calls

#### [NEW] [index.html](file:///c:/Users/HP/Documents/GitHub/ClassConnet/index.html)
- App shell: `<div id="app">`, loading spinner, meta tags for SEO + PWA
- Google Fonts link (Inter)
- `<script type="module" src="/src/main.js">`

---

### 2. Design System & Styles

#### [NEW] [src/styles/index.css](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/styles/index.css)
- CSS custom properties design system:
  - **Color palette:** Deep indigo/violet primary (#4F46E5), warm amber accent (#F59E0B), dark mode with rich slate backgrounds
  - **Typography:** Inter font, modular scale
  - **Spacing, radius, shadows, transitions**
- CSS reset, base styles
- Dark mode default (can toggle)
- Glassmorphism card utility
- Smooth micro-animation keyframes (fadeIn, slideUp, pulse)

#### [NEW] Other CSS files
- `components.css` — buttons, cards, badges, modals
- `lessons.css` — lesson layout, image captions, content typography
- `quiz.css` — question cards, option buttons, progress bar, timer
- `dashboard.css` — grid layout, chart containers, stat cards

---

### 3. Lesson Content & Quiz Bank (Data Layer)

#### [NEW] [src/data/lessons.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/data/lessons.js)
- Array of 5 lesson objects, each containing:
  - `id`, `title`, `objectives` (learning outcomes)
  - `content` — rich HTML string with headings, paragraphs, lists, images
  - `keyTerms` — vocabulary with definitions
  - `duration` — estimated reading time
- Content is educationally accurate for GES B7 Computing curriculum

#### [NEW] [src/data/quiz-bank.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/data/quiz-bank.js)
- 40+ questions (8 per lesson), each with IRT parameters:
  ```js
  {
    id: "q1_1",
    lessonId: 1,
    stem: "Which of these is NOT a type of computer?",
    options: ["Desktop", "Laptop", "Calculator", "Tablet"],
    correctIndex: 2,
    difficulty: 0.3,    // b parameter (-3 to +3 scale)
    discrimination: 1.2, // a parameter
    guessing: 0.25,      // c parameter (1/4 for 4-option MCQ)
    explanation: "A calculator is an electronic device but not a general-purpose computer..."
  }
  ```

#### [NEW] [src/data/fallback-hints.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/data/fallback-hints.js)
- Pre-written explanations for each question — used when offline or API fails
- Maps question ID → friendly, student-level explanation

---

### 4. Core Engine (Business Logic)

#### [NEW] [src/engine/adaptive-quiz.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/engine/adaptive-quiz.js)
- **Simplified 3-Parameter Logistic (3PL) IRT model:**
  - `P(θ)` — probability of correct answer given ability θ
  - `fisherInfo(θ, item)` — information function for item selection
  - `estimateAbility(responses)` — Maximum Likelihood Estimation
  - `selectNextItem(θ, remainingItems)` — picks item with max Fisher info at current θ
- **Quiz session manager:**
  - Starts at θ = 0 (medium difficulty)
  - Selects 10 questions adaptively from the item bank
  - Updates θ after each response
  - Stops after 10 items or when SE < 0.3
  - Returns: final θ, all responses, per-question data

#### [NEW] [src/engine/ai-feedback.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/engine/ai-feedback.js)
- `generateFeedback(question, studentAnswer, correctAnswer)` — calls Gemini API
- Prompt engineering: "You are a friendly JHS Computing teacher in Ghana. A student answered [X] instead of [Y]. Explain why [Y] is correct in 2-3 simple sentences."
- **Offline fallback:** If fetch fails, returns `fallback-hints.js` explanation
- API key stored in localStorage (teacher enters it once in settings)

#### [NEW] [src/engine/storage.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/engine/storage.js)
- IndexedDB wrapper with stores:
  - `students` — name, PIN, created date
  - `progress` — lesson completions per student
  - `quizResults` — full quiz sessions with per-question data, θ trajectory
  - `settings` — API key, teacher PIN
- Helper functions: `saveQuizResult()`, `getStudentProgress()`, `getAllResults()`, `exportData()`

---

### 5. Views (UI Screens)

#### [NEW] [src/views/home.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/views/home.js)
- Landing screen with ClassConnect branding
- Two large cards: "I'm a Student" / "I'm a Teacher"
- Animated background gradient, glassmorphism cards
- Offline status indicator (green dot = online, amber = offline)

#### [NEW] [src/views/student-login.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/views/student-login.js)
- Name + 4-digit PIN form (creates or logs in)
- Recent students shown as quick-select buttons
- No server auth — PIN just scopes IndexedDB data

#### [NEW] [src/views/lesson-viewer.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/views/lesson-viewer.js)
- Renders lesson HTML with rich typography
- Progress bar across top (1 of 5, 2 of 5...)
- "Mark as Complete" button → saves to IndexedDB
- "Take Quiz" button appears after lesson completion
- Smooth page transitions

#### [NEW] [src/views/quiz.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/views/quiz.js)
- Adaptive quiz powered by the IRT engine
- Shows one question at a time (question card component)
- Progress indicator: "Question 3 of 10"
- Difficulty indicator (subtle): easy/medium/hard badge
- Immediate right/wrong feedback with micro-animation
- Tracks time per question

#### [NEW] [src/views/quiz-results.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/views/quiz-results.js)
- Score summary with circular progress ring animation
- Ability level interpretation (Beginner / Developing / Proficient / Advanced)
- Per-question review: what you answered, correct answer, AI explanation
- "Retry Quiz" and "Next Lesson" buttons

#### [NEW] [src/views/dashboard.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/views/dashboard.js)
- **Teacher enters with a teacher PIN** (set during first run)
- **Summary cards:** Total students, avg score, completion rate, students at risk
- **Chart 1:** Bar chart — average score per lesson (Chart.js)
- **Chart 2:** Doughnut — ability distribution (how many Beginner/Developing/Proficient/Advanced)
- **Chart 3:** Horizontal bar — most commonly missed questions (misconception tracker)
- **Student table:** Name, lessons completed, latest quiz score, ability level, status badge (On Track / Needs Help / At Risk)
- **Drill-down:** Click a student → see their full quiz history, θ trajectory, per-question performance
- Export data as CSV button

---

### 6. Components (Reusable UI)

#### [NEW] [src/components/nav.js](file:///c:/Users/HP/Documents/GitHub/ClassConnet/src/components/nav.js)
- Top bar: ClassConnect logo, student name, offline indicator, settings gear
- Back button for nested views

#### [NEW] Other components
- `progress-bar.js` — animated progress bar with percentage
- `question-card.js` — question stem, 4 option buttons, selected state, correct/incorrect animation
- `feedback-card.js` — AI explanation with "robot teacher" icon, loading shimmer while fetching
- `stat-card.js` — dashboard metric card with icon, value, label, trend arrow

---

### 7. PWA & Offline Assets

#### [NEW] [public/icons/](file:///c:/Users/HP/Documents/GitHub/ClassConnet/public/icons/)
- Generated PWA icons (192×192, 512×512) — will use `generate_image` tool

#### [NEW] [public/images/](file:///c:/Users/HP/Documents/GitHub/ClassConnet/public/images/)
- Lesson illustrations — will generate with `generate_image` tool:
  - Computer types diagram
  - Motherboard labelled diagram
  - Input devices collage
  - Output devices collage
  - Storage devices comparison

---

### 8. Documentation

#### [NEW] [README.md](file:///c:/Users/HP/Documents/GitHub/ClassConnet/README.md)
- Project title, one-line description, badges
- Screenshots/GIF
- Feature list mapping to the 5 portfolio categories
- Architecture diagram
- Setup instructions (`npm install`, `npm run dev`)
- Curriculum alignment section
- Tech stack rationale
- How the adaptive quiz works (IRT explanation)
- AI feedback approach
- Offline support explanation
- Deployment guide
- License (MIT)
