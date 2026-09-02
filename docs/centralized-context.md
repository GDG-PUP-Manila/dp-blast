# DP Blast Centralized Context

## Project state

| Field | Value |
| --- | --- |
| Milestone | **Operate** (MVP live at [https://frame.gdgpup.org](https://frame.gdgpup.org)) |
| Owner | GDG PUP Technology (incoming CTO) |
| Handover | 2026-09-02 |
| Outgoing CTO | Carlos Jerico Dela Torre |
| Posture | Core product loop shipped. Prefer operate/harden over greenfield rebuild. |

## Purpose

This file is the single source of project context for planning and implementation.
It mirrors the phased spec and tracks what is actually shipped in the repo.

## Product Snapshot

- Product: DP Blast
- Core user goal: Upload photo, select event frame, preview, download in under 30 seconds.
- MVP shape: Anonymous, fast, reliable, mobile-usable.
- Primary stack (shipped): Astro 6 + React 19 UI, Tailwind 4, Astro server routes on **Vercel** (`@astrojs/vercel`), Sharp for OG (and optional `/api/process`), Supabase for download analytics only.
- Primary compositing path: **client-side canvas** on the customize page (not the Sharp process route).

### Navigation Model (shipped)

1. Landing (`/`) lists events that have frames (`data/events.ts`).
2. Event uploader: `/events/[eventSlug]` (file picker, frame select, handoff to customize).
3. Customize: `/events/[eventSlug]/customize?frameId=...` (zoom, pan, tilt, preview, download, caption copy).
4. Supporting APIs: `/api/test` (health), `/api/og/[eventSlug]` (OG image), `/api/analytics/download` (optional), `/api/process` (Sharp compositing; present but unused by the main UI).

## Non-Goals (MVP)

- User accounts or authentication
- Social sharing features (beyond caption copy helper)
- Payments, subscriptions, or premium tiers

## Phase Tracker

Status values: planned, in-progress, blocked, done, partial

Honest statuses as of handover 2026-09-02 (verified against `src/` and `data/`):

| Phase | Name | Status | Notes |
| ----- | ---- | ------ | ----- |
| 0 | Foundation Spec | done | Spec + context docs exist |
| 1 | Project Setup and Backend Enablement | done | Server output, Vercel adapter, `/api/test`, Sharp installed |
| 2 | Frame Catalog and Asset Specification | done | `data/events.ts` + public frame assets |
| 3 | Upload and Validation Flow | done | Landing → slug uploader → client validation (PNG/JPG/WEBP, 10MB). File picker only (no drag/drop). |
| 4 | Image Processing Engine | done | Client canvas composite is the live path; Sharp `/api/process` remains as an alternate server path |
| 5 | Preview, Download, and Result Experience | done | Customize route, controls, download, caption popup, analytics fire-and-forget |
| 6 | Hardening and Abuse Prevention | planned | Size limits exist; no rate limiting, formal timeouts, or abuse suite |
| 7 | QA, Release, and Feedback Loop | partial | Live site + download analytics; no automated test suite or formal release checklist in repo |

## Feature-to-Phase Map

### Phase 1 (shipped)

- Astro server output + Vercel adapter
- Health-check API route (`/api/test`)
- Sharp available for server image work

### Phase 2 (shipped)

- Event and frame metadata in `data/events.ts`
- Slugs, overlays, thumbnails, caption templates
- Catalog shared by pages and APIs

### Phase 3 (shipped)

- Landing event list
- Slug route to event uploader
- Upload UI (file picker) and frame picker scoped by event
- Client validation for type and size
- Server validation on `/api/process` if that route is used

### Phase 4 (shipped, client-primary)

- Canvas preview composite with cover-fit photo under transparent frame
- Optional Sharp process route for server-side composite
- Export via canvas PNG download

### Phase 5 (shipped)

- Customize page after upload handoff (`sessionStorage` photo handoff)
- Zoom, position, tilt (ranges + quick buttons + touch gestures)
- Download + caption template with `{{name}}` and copy feedback
- Download analytics POST (best-effort)

### Phase 6 (not shipped)

- Rate limiting and stronger abuse controls
- Broader timeout / failure safeguards beyond current try/catch
- Formal abuse-case checklist

### Phase 7 (partial)

- Download analytics table migration under `supabase/migrations/`
- Still needed: automated tests, written release checklist, known-issues log

## GDG Brand Direction (Frontend)

The visual direction follows the Code Rush and GDG brand system: bright, clean, white-first, energetic, and highly readable.

### Visual Pillars

- Foundation: white or near-white base surfaces with soft neutral support
- Brand accents: use the four Google colors as the primary identity anchors
- Decorative language: low-opacity developer motifs and playful geometric accents
- Components: rounded cards and controls with soft shadows and clear hierarchy

### Design Tokens (Required)

Defined in `src/styles/global.css`:

- `--background: #f8f9fa`
- `--foreground: #202124`
- `--google-blue: #4285f4`
- `--google-red: #ea4335`
- `--google-yellow: #fbbc04`
- `--google-green: #34a853`

Use these token names exactly to preserve portability across project areas.

### Typography

- Primary style: geometric sans (Outfit in UI) with modern, clean forms
- Heading style: extra-bold or black weight, tight tracking, concise copy
- Body style: neutral gray, high readability, medium line height
- Avoid default system-only typography for core branded sections

### Motion

- Use spring-based entrance and hover interactions
- Add gentle ambient floating motion for decorative accents
- Keep animation playful but controlled and non-disruptive
- Respect reduced-motion preferences for non-essential loops

### UI Pattern Rules

- Primary CTA: blue fill, white text, rounded shape, subtle lift on hover
- Secondary CTA: white fill, gray border, light hover tint
- Feature cards: white surface, soft border, rounded corners, slight hover raise
- Keep decorative backgrounds low-contrast and non-interactive

### Accessibility Constraints

- Preserve strong text contrast on light surfaces
- Avoid yellow text on white for long-form body copy
- Keep mobile usability first for upload, preview, and download flows

## UX and Accessibility Rules

- Desktop and mobile parity for upload, preview, and download
- Minimum contrast for text on brand-colored and neutral surfaces
- Clear validation and error copy for upload and processing failures
- Touch-friendly controls for mobile actions

## Engineering Rules

- Prefer **shipped code** over phase checkbox text when they disagree; then update this file.
- Catalog and caption contracts live in `data/events.ts` (slug, frame ID, `{{name}}` placeholders).
- Keep photo handling anonymous: no accounts; avoid persisting user photos server-side unless product requirements change.
- Validate client inputs (type, size) before customize; keep error copy user-facing.
- Analytics must fail soft (never block download UX).
- Favor shared catalog helpers (`getEventBySlug`) to prevent route/API drift.
- Do not add an FMD template suite; update existing docs only.

## Definition of Done for Any Feature

- Matches Operate/harden intent or an explicit remaining phase item
- Acceptance criteria checked against real routes
- Mobile usability checked for touched flows
- Error states handled
- Notes updated in this file if status changed

## Immediate priorities (post-handover)

1. Operate the live site; add events/frames via `data/events.ts` + assets when needed.
2. Phase 6 hardening if traffic or abuse warrants it.
3. Phase 7 formal QA/tests and release checklist as capacity allows.
