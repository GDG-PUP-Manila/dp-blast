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
| 7 | QA, Release, and Feedback Loop | partial | Live site + download analytics + Chromium acceptance tests; formal release checklist and broader device QA remain |

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

- Customize page after upload handoff (IndexedDB with `sessionStorage` fallback in the local 2026-10-17 update)
- Zoom, position, tilt (ranges + quick buttons + touch gestures)
- Download + caption template with `{{name}}` and copy feedback
- Download analytics POST (best-effort)

### Phase 6 (not shipped)

- Rate limiting and stronger abuse controls
- Broader timeout / failure safeguards beyond current try/catch
- Formal abuse-case checklist

### Phase 7 (partial)

- Download analytics table migration under `supabase/migrations/`
- Chromium acceptance tests added locally on 2026-10-17. Still needed: written release checklist and broader cross-device QA. FLAGS remains the improvement register.

### Local development update: 2026-10-17

Status: committed as `82e62da`. Extends phases 3-5 with phase 7 acceptance coverage. Production status has not been reverified during the 2026-10-27 catalog update.

- Light/dark toggle on all pages, device-theme detection, and a saved browser preference. Shared neutral tokens adapt surfaces, text, controls, dialogs, and grid fades while preserving GDG accent tokens.
- Mouse and pen dragging on the canvas update position sliders. Existing touch pan, pinch, and rotation remain.
- Photo handoff uses IndexedDB with a per-tab identifier and sessionStorage fallback. Only the latest photo for that tab is used; restoration expires after 24 hours and expired IndexedDB records are pruned during later uploads. Photos stay on the device. If both stores fail, the uploader explains how to continue, and the editor can still load and download a photo for the current visit.
- Canvas drawing defaults both offset scales to 1.
- Escape only dismisses an open dialog. Both dialogs manage focus and make background content inert while open. Upload actions use native buttons; shared focus indicators cover keyboard controls.
- Reduced motion disables nonessential animation and parallax while keeping the name dialog visible.
- Captions and hints are valid UTF-8 in the source. Browser checks verify caption emoji; the terminal's earlier garbled display was a decoding issue.
- Footer maintainer credit: Kian Angelo M. Florendo. Historical contributor acknowledgments remain in README.
- `npm test` runs Chromium acceptance checks for theme detection and persistence, photo rendering and PNG download, mouse/pen/touch dragging, large-photo reload, storage fallbacks, upload validation, and keyboard/dialog behavior. Run `npx playwright install chromium` once if needed.

Acceptance scope: local desktop and emulated mobile Chromium. Physical devices, Safari/Firefox, and production deployment are not verified by these checks. Phase 6 remains planned and phase 7 remains partial.

### Catalog update: 2026-10-27

- New first catalog entry: **Membership Application ’27**, slug `membership-2027`, frame ID `membership-2027-frame`.
- Overlay: `public/membership-2027.png`, supplied by the user, 2160 x 2160 transparent PNG (artwork replaced on 2026-10-27; files renamed from the earlier `DP_Blast_mem` name). Preserve this artwork for canvas compositing. The existing export cap produces 2048 x 2048 PNG downloads.
- Catalog cover and selector thumbnail: `public/membership-2027_thumbnail.png`, generated at 480 x 480 with transparency preserved.
- Caption preserves the provided prose, intentionally empty headings/phrases/credits, three repetitions of each supplied URL, and all five hashtags. Only `[Name]` is converted to the established `{{name}}` template contract. The user explicitly confirmed the blanks on 2026-10-27.
- External application link: `https://forms.gle/6bwhYTCKF8wbymuKA`. The additional `https://surl.li/ywgejf` link is preserved in the caption. Destination contents have not been verified.
- Homepage social preview follows the first catalog event through `/api/og/[eventSlug]`, so it now uses the membership artwork. Cosmos and SparkFest remain available with their existing captions and routes.
- Focused browser coverage lives in `tests/membership.spec.ts`: discovery, name personalization, transparent preview/export, OG image, Clipboard API and fallback, intentional caption gaps, and mobile dark mode.
- Validation on 2026-10-27: production build passed; all eight existing editor cases passed in the full browser run, and both membership cases passed in the focused rerun after the clipboard assertion accounted for Windows CRLF. Desktop light and mobile dark screenshots reviewed; `/api/test` returned HTTP 200. Safari, Firefox, physical devices, and production deployment were not verified.
- Phase mapping: phase 2 catalog addition, using existing phases 3-5 flow with phase 7 validation. Phase 6 hardening and broader release work are unchanged.
- Delivery status: committed locally; user push and deployment are pending.

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

Additional neutral tokens: `--surface`, `--surface-muted`, `--surface-hover`, `--surface-translucent`, `--text-secondary`, `--text-muted`, `--border`, and `--fade-rgb`. Dark mode overrides neutral tokens under `:root[data-theme="dark"]`; preference initialization runs before page rendering.

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
