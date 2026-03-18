# DP Blast Centralized Context

## Purpose

This file is the single source of project context for planning and implementation.
It mirrors the phased spec and adds practical tracking for execution.

## Product Snapshot

- Product: DP Blast
- Core user goal: Upload photo, select event frame, preview, download in under 30 seconds.
- MVP shape: Anonymous, fast, reliable, mobile-usable.
- Primary stack direction: Astro + React UI, Astro server routes, Node adapter, Sharp for compositing.

### Navigation Model (MVP)

- Landing (`/`) is event discovery: list only events with available frames.
- Event uploader route is slug-based: `/events/[eventSlug]`.
- Event context is route-driven; uploader operations are scoped to selected event.

## Non-Goals (MVP)

- User accounts or authentication
- Social sharing features
- Payments, subscriptions, or premium tiers

## Phase Tracker

Status values: planned, in-progress, blocked, done

| Phase | Name                                     | Status      | Exit Gate                                                      |
| ----- | ---------------------------------------- | ----------- | -------------------------------------------------------------- |
| 0     | Foundation Spec                          | done        | Product flow, formats, constraints, and non-goals are explicit |
| 1     | Project Setup and Backend Enablement     | in-progress | Server mode and health route proven                            |
| 2     | Frame Catalog and Asset Specification    | in-progress | Stable frame manifest and assets                               |
| 3     | Upload and Validation Flow               | in-progress | Only valid inputs accepted                                     |
| 4     | Image Processing Engine                  | in-progress | Reliable compositing quality                                   |
| 5     | Preview, Download, and Result Experience | in-progress | Complete user loop                                             |
| 6     | Hardening and Abuse Prevention           | planned     | Operational safeguards in place                                |
| 7     | QA, Release, and Feedback Loop           | planned     | Launch readiness with monitoring                               |

## Feature-to-Phase Map

### Phase 1

- Astro Node adapter enabled
- Output mode set to server or hybrid
- Shared server utility structure for validation and processing helpers
- Health-check API route

### Phase 2

- Event and frame metadata schema and manifest
- Event-to-frame mapping rules and integrity checks
- Event slug generation and uniqueness rules
- Organized frame and thumbnail assets
- Validation rules for frame entry integrity

### Phase 3

- Landing event list UI for browsing available events
- Slug route handoff from landing to event uploader page
- Upload UI (picker and drag/drop) on event uploader page
- Frame picker UI scoped by selected event slug
- Client and server input validation
- User-facing error and retry states

### Phase 4

- Orientation normalization
- Resize or crop to target canvas
- Frame compositing over user image
- Output generation and failure handling

### Phase 5

- Processing/loading state UI
- Result preview and download
- Dedicated customization page route after upload handoff
- Photo alignment controls (zoom, position, tilt)
- Reset and retry actions
- Mobile-safe download behavior
- Event caption editor (name placeholder replacement)
- Caption copy-to-clipboard flow with success and fallback states

### Phase 6

- Rate limiting and payload controls
- Timeout and failure safeguards
- Cleanup for temporary artifacts
- Abuse-case validation

### Phase 7

- Unit and integration test coverage for critical paths
- Cross-device manual QA
- Release checklist and known issues log
- Feedback and triage loop

## GDG Brand Direction (Frontend)

The visual direction should follow the Code Rush and GDG brand system: bright, clean, white-first, energetic, and highly readable.

### Visual Pillars

- Foundation: white or near-white base surfaces with soft neutral support
- Brand accents: use the four Google colors as the primary identity anchors
- Decorative language: low-opacity developer motifs and playful geometric accents
- Components: rounded cards and controls with soft shadows and clear hierarchy

### Design Tokens (Required)

- `--background: #f8f9fa`
- `--foreground: #202124`
- `--google-blue: #4285f4`
- `--google-red: #ea4335`
- `--google-yellow: #fbbc04`
- `--google-green: #34a853`

Use these token names exactly to preserve portability across project areas.

### Typography

- Primary style: geometric sans with modern, clean forms
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

- Build only in active phase scope; defer extras to later phases.
- Validate changes against phase acceptance criteria before marking done.
- Keep frontend and backend contracts explicit (event slug, frame ID, file constraints, error schema).
- Keep share contracts explicit (event caption template and placeholder keys such as `name`).
- Favor shared utilities for validation logic to prevent drift.

## Definition of Done for Any Feature

- Phase scope match confirmed
- Acceptance criteria met and checked
- Mobile usability checked for touched flows
- Error states handled
- Notes updated in this file if status changed

## Immediate Execution Order

1. Finish Phase 1 backend setup and health route.
2. Build event and frame catalog schema with slug metadata for Phase 2.
3. Implement landing event browsing and slug-routed upload flow for Phase 3.
4. Continue in phase order through release readiness.
