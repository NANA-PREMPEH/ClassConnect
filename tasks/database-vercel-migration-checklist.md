# ClassConnect — Supabase, AI, and Offline Sync Checklist

## Target architecture

```text
ClassConnect PWA
  ├─ IndexedDB / localStorage / sessionStorage (offline-first source on device)
  ├─ Supabase Auth + Postgres + Storage + Edge Functions (only cloud backend)
  ├─ Gemini 2.0 Flash (primary AI)
  └─ Groq / llama-3.3-70b-specdec (fallback AI)

Device change queue → nested JSONB sync vault → Postgres trigger → relational analytics → Chart.js admin reporting
```

## Platform — Supabase only

- [ ] Create a Supabase project in a region appropriate for the school.
- [ ] Enable Database Branching and use a branch for every scoring-engine or schema change before merging to production.
- [ ] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel; these are public browser configuration values. A local `.env.example` is available.
- [ ] Store the Supabase service-role key only in Supabase Edge Function secrets or Vercel server-side variables; never use a `VITE_*` prefix for it.
- [x] Move the database schema and migrations to `supabase/`.
- [x] Remove the superseded Neon driver, `DATABASE_URL` helpers, custom session routes, `db/schema.sql`, and Neon seed script.

## Authentication, access, and storage

- [ ] Configure Supabase Auth for approved student and staff sign-in methods.
- [ ] Replace browser-only teacher PIN sessions with Supabase Auth sessions and role-aware profiles.
- [ ] Add school, class, enrolment, staff-assignment, student-progress, assessment, and submission tables.
- [ ] Add Row Level Security policies so students access only their own records, teachers access only assigned classes, and administrators access only their school.
- [ ] Store report exports, backup files, and approved lesson assets in Supabase Storage with bucket-level access policies.
- [ ] Add audit records for staff administration, assessment publication, grade changes, and backup/restore actions.

## Dual-provider AI layer

- [ ] Add a Supabase Edge Function for AI requests so provider keys never reach the browser.
- [ ] Configure `GEMINI_API_KEY` as the primary secret and use `gemini-2.0-flash` for rubric grading, question generation, and diagnostic tasks.
- [ ] Configure `GROQ_API_KEY` as the fallback secret and use `llama-3.3-70b-specdec` for student explanations when Gemini times out, fails, or is rate-limited.
- [ ] Apply request timeouts, provider error classification, one fallback attempt, and safe offline fallback messages.
- [ ] Require an authenticated Supabase user and add per-user/school rate limits before invoking either provider.
- [ ] Keep successful explanations in IndexedDB for exact-answer and question-level offline reuse.
- [ ] Log provider, latency, fallback usage, and non-sensitive error metadata for operational monitoring.

## Low-connectivity JSONB synchronization

- [ ] Keep learner actions local in IndexedDB, localStorage, and sessionStorage while offline.
- [ ] Maintain an IndexedDB outbox with stable client operation IDs, timestamps, retry counts, and sync status.
- [ ] Let a teacher explicitly push a single nested JSONB classroom payload when connectivity is available.
- [ ] Create a Supabase `sync_vault` table to retain the original payload, device metadata, actor, school, status, and error details.
- [ ] Add a Postgres trigger/function that validates and unpacks JSON arrays into relational progress, quiz, diagnostic, assessment, and submission records.
- [ ] Make payload processing idempotent so retries and duplicate uploads do not duplicate learner records.
- [ ] Track per-item analytics and recompute moving average difficulty/discrimination after processed quiz and assessment attempts.
- [ ] Return a sync receipt with accepted, rejected, and conflict counts; retain failed payloads for teacher review.
- [ ] Add conflict handling based on stable IDs and `updated_at`, without silently overwriting teacher changes.

## PWA, assets, and reporting

- [x] Keep Vite PWA and Workbox enabled for the application shell.
- [ ] Use Cache-First caching for lesson typography, illustrations, icons, and core UI assets.
- [ ] Use Network-First with offline fallback for Supabase, sync, and cloud-AI operations; never cache authenticated API responses as public assets.
- [ ] Preserve Chart.js 4 for the administrative dashboard.
- [ ] Add a Supabase reporting adapter that reads parsed relational metrics rather than raw sync-vault payloads.
- [ ] Visualize student risk intervention levels, completion, diagnostic readiness, and 3PL IRT item difficulty against the Basic 7 syllabus.
- [ ] Restrict reports to authorised school/class scopes through RLS and role checks.

## Verification and release

- [ ] Test a database branch with synthetic school data before each migration is merged.
- [ ] Test no-network learning, reconnect, teacher JSONB push, duplicate retry, partial failure, and conflict resolution.
- [ ] Test Gemini success, Gemini timeout/rate-limit fallback to Groq, Groq failure, and offline cached explanation paths.
- [ ] Test fresh devices, cleared browser storage, two-device classroom use, and staff/student permission boundaries.
- [ ] Confirm backups, retention, consent, account removal, and audit requirements before production rollout.
- [ ] Deploy through Vercel over HTTPS and verify the service worker, Supabase Edge Functions, and reporting dashboard in production.
