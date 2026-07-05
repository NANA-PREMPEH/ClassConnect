# ClassConnect

Offline-capable adaptive learning for Basic 7 Computing in Ghana, with lesson delivery, adaptive quizzes, AI feedback, and a device-local teacher dashboard.

## Screenshots

### Home
![ClassConnect home screen](docs/screenshots/home.png)

### Student Login
![Student login screen](docs/screenshots/student-login.png)

### Teacher Access
![Teacher access setup screen](docs/screenshots/teacher-login.png)

## Overview

ClassConnect is built for low-connectivity classrooms. Students can read lessons, complete quizzes, and review explanations on the same device, while teachers use a PIN-protected dashboard to inspect progress, common misconceptions, and learner risk levels.

The project is aligned to the GES Common Core Programme strand **Introduction to Computer Systems** for **Basic 7 Computing**.

## Feature Map

This implementation now covers the five planned showcase areas:

1. **Offline-first lesson delivery**
   Lessons, icons, screenshots, and generated illustrations are packaged for PWA use and cached for offline study.
2. **Adaptive assessment**
   The quiz engine uses a lightweight 3PL IRT model to estimate learner ability and choose the next most informative question.
3. **AI-supported feedback**
   Wrong answers can trigger Gemini explanations, while offline and failure-safe fallbacks use curriculum-aligned local hints.
4. **Teacher analytics**
   The dashboard includes completion tracking, score trends, ability distribution, misconception charts, export, and student drill-downs.
5. **Zero-backend deployment**
   Student records, quiz history, settings, and teacher access all live in IndexedDB and browser storage on the device.

## Curriculum Scope

The app includes five lessons:

1. What Is a Computer?
2. Inside the Computer
3. Input Devices
4. Output Devices
5. Storage and Putting It All Together

Each lesson includes:

- learning objectives
- rich reading content
- vocabulary support
- a lesson illustration
- completion tracking
- a linked adaptive quiz

## Architecture

```text
                     ClassConnect (Vite PWA)

   Home / Login / Lessons / Quiz / Results / Dashboard
                       |            |         |
                       |            |         +--> Chart.js analytics
                       |            |
                       |            +--> Adaptive quiz engine (3PL IRT)
                       |
                       +--> Lesson data + generated illustrations

                 IndexedDB + localStorage/sessionStorage
         students | progress | quizResults | settings | sessions

                     Service Worker (vite-plugin-pwa)
              precache shell/assets + runtime cache for lesson media

                     Online-only optional Gemini API
               friendly explanations for incorrect answers
```

## Tech Stack

- **Frontend:** Vanilla JS with ES modules
- **Styling:** Vanilla CSS with design tokens and theme toggle
- **Build tool:** Vite 6
- **PWA:** `vite-plugin-pwa` + Workbox
- **Data persistence:** `idb`, `localStorage`, and `sessionStorage`
- **Charts:** Chart.js 4
- **AI feedback:** Google Gemini `gemini-2.0-flash`
- **Assets:** AI-generated lesson illustrations plus PWA icons

## Adaptive Quiz Design

ClassConnect uses a simplified **3-Parameter Logistic (3PL)** Item Response Theory model.

For each question, the engine stores:

- `difficulty` (`b`)
- `discrimination` (`a`)
- `guessing` (`c`)

During a quiz session the app:

1. starts the learner at `theta = 0`
2. selects the next question using maximum Fisher information
3. updates `theta` after each answer using iterative estimation
4. records time-per-question and theta trajectory
5. stops after 10 questions or once the estimate is stable enough

Saved quiz results include:

- final score
- final `theta`
- standard error
- total and average time
- per-question correctness
- per-question timing
- per-question theta movement
- full theta trajectory for analytics

## AI Feedback Strategy

When a student misses a question:

1. the app checks for a saved Gemini API key
2. if online, it sends a short prompt asking for a warm 2-3 sentence explanation
3. if offline or the API fails, it falls back to a local explanation from `src/data/fallback-hints.js`

This keeps feedback available even on unstable school networks.

## Teacher Workflow

Teacher access is protected with a 4-digit PIN on each device.

On first use:

1. open **Teacher**
2. create a 4-digit teacher PIN
3. optionally save a Gemini API key
4. enter the dashboard

The dashboard currently supports:

- total students
- average latest score
- lesson completion rate
- students at risk
- average score by lesson
- ability distribution
- horizontal misconception chart
- lessons completed in the roster
- CSV export
- per-student drill-down with quiz history, theta trajectory, and per-question performance

## Offline Support

The project is designed to remain useful after first load.

What works offline:

- lesson reading
- stored screenshots and illustrations
- lesson completion tracking
- adaptive quizzes
- local results review
- dashboard analytics for the data already on the device

What needs connectivity:

- first-time asset download
- Gemini explanation requests

Workbox configuration now includes:

- static asset precache
- lesson image cache
- Chart.js CDN cache
- Google Fonts cache
- Gemini runtime strategy configuration

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/
    nav.js
    progress-bar.js
    question-card.js
    feedback-card.js
    stat-card.js
    ui.js
  data/
    lessons.js
    quiz-bank.js
    fallback-hints.js
  engine/
    adaptive-quiz.js
    ai-feedback.js
    storage.js
    theme.js
  views/
    home.js
    student-login.js
    teacher-login.js
    lesson-viewer.js
    quiz.js
    quiz-results.js
    dashboard.js
```

## Deployment Guide

### Vercel

1. Import the repository into Vercel.
2. Keep the default Vite build command: `npm run build`.
3. Keep the output directory as `dist`.
4. Deploy over HTTPS so service workers can register correctly.

### GitHub Pages

1. Build the app with `npm run build`.
2. Publish the `dist` directory through your preferred Pages workflow.
3. If deploying under a subpath, update Vite base settings and PWA paths accordingly.

## Known Limitations

- Data is intentionally device-local. There is no backend sync yet.
- Teacher authentication is device-scoped, not centrally managed.
- Gemini explanations depend on a client-side API key and internet access.
- The screenshot set currently focuses on entry flows; richer dashboard captures can be added later from a seeded demo dataset.

## License

MIT
