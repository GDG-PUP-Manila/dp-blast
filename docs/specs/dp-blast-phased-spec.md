# DP Blast Phased Implementation Spec

## Document Status

- Status: Handover snapshot (statuses aligned to shipped code)
- Date: 2026-09-02
- Product: DP Blast
- Owner: GDG PUP Technology (incoming CTO)
- Outgoing CTO: Carlos Jerico Dela Torre
- Milestone: **Operate** (MVP live at https://frame.gdgpup.org)
- Primary goal: Let a user upload a profile photo, apply a selected campaign frame, preview the output, and download the final image.

## Product Summary

DP Blast is a web app that takes a user-uploaded image, composites it with a selected transparent frame for a chosen event or campaign, and returns a processed output suitable for profile-picture use. The MVP should optimize for speed, simplicity, and reliable output quality over feature breadth.

Primary navigation model (shipped):

1. Landing page lists all events that have available DP frames.
2. Selecting an event routes the user to an event-specific uploader page using a slug route.
3. After photo select, the user continues to `/events/[eventSlug]/customize` for alignment, download, and caption copy.
4. Uploader and customize context are scoped to the selected event, including frame choices and validation.

## Spec-Driven Development Rules

Each phase must complete the following before the next phase begins:

1. A written spec exists for the phase scope.
2. Acceptance criteria are defined before implementation.
3. Code is built only for the approved phase scope.
4. Validation is performed against acceptance criteria, not assumptions.
5. Any scope expansion is written into a later phase instead of being added ad hoc.

**Handover note:** Phases 0-5 are complete in production. Prefer code under `src/` and `data/` over outdated "in-progress" labels. Remaining intentional work is Phase 6 hardening and Phase 7 formal QA.

## Success Metrics

1. A first-time user can generate a framed image in under 30 seconds.
2. Image processing succeeds for supported formats in at least 95% of valid submissions.
3. Final output is visually aligned with the selected frame on common portrait aspect ratios.
4. Mobile flow is fully usable for upload, preview, and download.

## Constraints and Assumptions

1. Stack is Astro with React for interactive UI (Astro 6 / React 19 shipped).
2. Backend runs on Astro server routes with the **Vercel** adapter (`output: "server"`). Older drafts mentioned a Node adapter; that is not what ships.
3. Sharp is used for OG generation and an optional `/api/process` route. The live customize/download path composites in the **browser canvas**.
4. MVP uses a fixed catalog of admin-provided events and frame assets in `data/events.ts`.
5. Anonymous usage is allowed in MVP.

## Routing Model (MVP)

1. Event discovery route: `/`.
2. Event-specific uploader route: `/events/[eventSlug]`.
3. Customize route: `/events/[eventSlug]/customize`.
4. Event slug must be unique, stable, URL-safe, and derived from event metadata.
5. Server process API (if used) must include event context and a frame identifier.

## Phase 0: Foundation Spec

**Status: done**

### Goal

Define the product boundaries, user flow, technical constraints, and non-goals before implementation begins.

### Scope

1. Confirm MVP behavior.
2. Define supported file formats, max upload size, and output dimensions.
3. Decide deployment mode for Astro backend.
4. Define the first frame catalog and asset format requirements.

### Deliverables

1. Product requirements document.
2. User flow diagram.
3. Technical decision record for backend mode and image pipeline.
4. Frame asset specification.

### Acceptance Criteria

1. The upload-to-download flow is documented end to end.
2. The processing pipeline is defined clearly enough that backend work can begin without ambiguity.
3. Every supported input and output format is explicitly listed.
4. Non-goals are documented to prevent scope drift.

### Non-Goals

1. User authentication.
2. Social sharing features.
3. Payment or premium tiers.

## Phase 1: Project Setup and Backend Enablement

**Status: done**

### Goal

Convert the current Astro app into a server-capable app that can accept uploads and process images.

### Scope

1. Add Astro deployment adapter (shipped: Vercel).
2. Switch output mode to server or hybrid (shipped: `server`).
3. Install image processing dependency (Sharp).
4. Establish environment variable handling (Supabase analytics env optional).
5. Create backend folder conventions for API routes and shared server utilities.

### Deliverables

1. Updated Astro configuration for backend execution.
2. Shared catalog module (`data/events.ts`).
3. Base API route structure (`/api/test`, `/api/process`, `/api/og`, `/api/analytics`).
4. Developer runbook for local setup (root README).

### Acceptance Criteria

1. The app runs locally with server routes enabled.
2. A health-check API route returns a valid response (`/api/test`).
3. Build and preview work in the selected deployment mode.
4. Image-processing dependency installs and loads successfully.

### Exit Gate

Backend infrastructure is proven working before any UI-dependent processing features are started.

## Phase 2: Frame Catalog and Asset Specification

**Status: done**

### Goal

Create a consistent system for storing and referencing event campaigns and frame assets.

### Scope

1. Define event metadata schema.
2. Define frame metadata schema, including event linkage.
3. Define event-to-frame mapping rules.
4. Define event slug rules and uniqueness constraints.
5. Prepare initial frame assets in transparent PNG format.
6. Create thumbnails for the selection UI.
7. Add a catalog source the frontend and backend can both trust.

### Deliverables

1. Event catalog in `data/events.ts` (events + nested frames).
2. Documented slug field per event.
3. Organized frame assets under `public/`.
4. Caption templates with `{{name}}` placeholder.
5. Resolution helpers such as `getEventBySlug`.

### Acceptance Criteria

1. Each event has a unique ID and display metadata.
2. Each frame has a unique ID, display name, preview asset, full overlay asset, and linked event.
3. Frame dimensions match the expected compositing canvas rules.
4. The frontend can render event and frame catalogs without hardcoded per-item logic beyond the catalog module.
5. The backend can resolve a valid event and frame combination with no ambiguous mapping.
6. Event slugs map deterministically to event entries with no collisions.

### Exit Gate

Frame data is stable enough that processing logic can depend on it.

## Phase 3: Upload and Validation Flow

**Status: done**

### Goal

Let users submit a valid photo and chosen frame safely and reliably.

### Scope

1. Build event browsing UI on landing page, listing events with available frames.
2. Add routing from landing to event-specific uploader via `/events/[eventSlug]`.
3. Build upload UI on event uploader (shipped: file picker; drag-and-drop not implemented).
4. Add frame selection UI filtered by selected event slug.
5. Add client-side validation for type, size, event slug, and frame ID.
6. Add server-side validation for MIME type, dimensions, event slug, and frame ID on `/api/process`.
7. Define error states and retry paths.

### Deliverables

1. Event listing on landing page.
2. Event uploader page routed by slug.
3. Upload control and frame picker scoped to route event.
4. Validation for PNG/JPG/WEBP and 10MB max.
5. Handoff to customize via `sessionStorage` + query `frameId`.

### Acceptance Criteria

1. Supported files submit successfully into the customize flow.
2. Invalid files are rejected with clear messages.
3. No processing occurs for unsupported file types or invalid frame IDs in the live UI path.
4. The form is usable on desktop and mobile.
5. Landing event cards route to the correct event uploader slug page.

### Exit Gate

The system accepts only clean, expected inputs before compositing begins.

## Phase 4: Image Processing Engine

**Status: done** (client-primary; Sharp route optional)

### Goal

Produce a visually correct final image by compositing the uploaded photo with the selected frame.

### Scope

1. Normalize image orientation (browser decode / Sharp `rotate` on process route).
2. Resize or crop the user image to a target canvas.
3. Composite the selected frame on top of the image.
4. Export the final image in at least one downloadable format (PNG).
5. Handle processing failures and user-visible errors.

### Deliverables

1. Client canvas compositing on customize page (live path).
2. Optional Sharp compositing service at `/api/process`.
3. Output size caps (preview/export edge limits).

### Acceptance Criteria

1. Output image is generated successfully for supported uploads in the live UI.
2. Frame transparency is preserved.
3. Portrait uploads produce visually acceptable alignment with user controls.
4. Processing stays within a practical budget for normal uploads on-device.
5. Note: server Sharp path is available but not wired from the customize download button.

### Exit Gate

The core product promise is met with repeatable output quality.

## Phase 5: Preview, Download, and Result Experience

**Status: done**

### Goal

Give users confidence in the result and a complete post-processing experience that supports download, sharing copy, and event caption reuse.

### Scope

1. Show processing/loading state for download.
2. Render final image preview on canvas.
3. Provide download action.
4. Provide reset and retry actions.
5. Handle mobile-friendly download behavior.
6. Route users to a dedicated customization page after upload handoff.
7. Provide manual customization controls for zoom, position adjustment, and tilt.
8. Provide event caption section with editable name placeholder.
9. Provide one-click caption copy action with success and failure feedback.

### Deliverables

1. Customize route UI (`/events/[eventSlug]/customize`).
2. Zoom, pan, and tilt controls plus touch gestures.
3. Caption popup with copy feedback after download.
4. Download analytics hook (`/api/analytics/download`).

### Acceptance Criteria

1. The user can clearly see when download preparation is in progress.
2. The user can preview the composite before download.
3. The downloaded file opens correctly on common devices.
4. Adjustments can be reset without a full site refresh.
5. The user is routed into customization after upload selection.
6. The user can adjust zoom, position, and tilt before downloading.
7. The user can set a name used in the caption template before copying.
8. The user can copy the generated caption with feedback / fallback.
9. Caption flow works on desktop and mobile with graceful clipboard fallback.

### Exit Gate

The full user loop is complete from upload to downloadable result.

## Phase 6: Hardening and Abuse Prevention

**Status: planned**

### Goal

Reduce operational risk before or during public operation.

### Scope

1. Add rate limiting.
2. Add request size and processing time limits (partial: 10MB client/server caps exist).
3. Improve server-side error handling and logs.
4. Add cleanup strategy for temporary files if disk is used.
5. Test malicious and malformed input cases.

### Deliverables

1. Rate-limiting middleware or equivalent.
2. Input and timeout safeguards beyond current basics.
3. Operational logging guidance.
4. Abuse test checklist.

### Acceptance Criteria

1. The app degrades safely under repeated invalid requests.
2. Oversized or malformed uploads do not crash the server.
3. Temporary artifacts are cleaned up predictably if introduced.
4. User-facing errors remain generic while logs retain technical detail.

### Exit Gate

The app is stable enough for sustained public traffic under abuse pressure.

## Phase 7: QA, Release, and Feedback Loop

**Status: partial**

### Goal

Ship the MVP with verification, observability, and a controlled rollout.

### Scope

1. Add unit and integration coverage for validation and processing.
2. Perform manual cross-device QA.
3. Prepare release checklist.
4. Add lightweight usage analytics (shipped: download events to Supabase when configured).
5. Define post-launch bug triage and improvement process.

### Deliverables

1. Test plan / automated tests (not yet in repo).
2. Release checklist (not yet formalized in repo).
3. Known issues log (not yet formalized in repo).
4. Initial analytics event (download tracking shipped).

### Acceptance Criteria

1. Critical upload, processing, and download flows are tested.
2. Core mobile and desktop paths pass manual QA.
3. Release blockers are tracked explicitly.
4. A feedback loop exists for prioritizing fixes after launch.

### Exit Gate

The MVP is launch-ready with basic confidence and monitoring. Live Operate milestone is already met; remaining work is formalizing QA artifacts and tests.

## Recommended Build Order

1. Phase 0 - done
2. Phase 1 - done
3. Phase 2 - done
4. Phase 3 - done
5. Phase 4 - done
6. Phase 5 - done
7. Phase 6 - next if hardening needed
8. Phase 7 - complete remaining QA artifacts

## Phase Ownership Template

Use this template before starting each remaining phase.

```md
## Phase X: [Name]

### Problem

### Goal

### In Scope

### Out of Scope

### API or Data Contracts

### UI States

### Acceptance Criteria

### Risks

### Test Plan
```

## Immediate Next Specs to Write

1. Hardening / rate-limit approach for Phase 6 (only if traffic warrants).
2. Minimal test plan and known-issues log for Phase 7 completion.
3. Keep catalog/event addition notes in centralized-context when new events ship.
