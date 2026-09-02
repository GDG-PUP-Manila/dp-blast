# Agent notes (DP Blast)

## Read first

1. [docs/centralized-context.md](docs/centralized-context.md) — product state, routes, brand tokens, engineering rules
2. [docs/specs/dp-blast-phased-spec.md](docs/specs/dp-blast-phased-spec.md) — phased history and remaining gates

Do not invent a separate FMD doc suite (no PRD/SDD/QAD templates). Update these existing docs when reality changes.

## Stack pins

- Astro 6, React 19, Tailwind 4
- Deploy: `@astrojs/vercel`, `output: "server"`, site `https://frame.gdgpup.org`
- Image: Sharp on server routes; primary user compositing is **client canvas** on `/events/[eventSlug]/customize`
- Analytics: Supabase insert from `/api/analytics/download` (optional env)

## Conventions

- **Prefer code over stale phase checkboxes.** If docs and `src/` disagree, trust the code and update the docs.
- Catalog lives in `data/events.ts` (events, slugs, frames, caption templates).
- Anonymous MVP: no auth. Photos are not stored as user accounts; keep PII handling minimal.
- Keep design tokens in `src/styles/global.css` aligned with centralized-context.
- No em-dashes in new docs copy for this project.

## Status posture

Milestone is **Operate** (MVP live). Implement only when fixing bugs, hardening, or adding catalog events. Do not restart phase scaffolding from scratch.
