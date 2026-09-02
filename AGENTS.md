# Agent notes (DP Blast)

## Read order (every session)

1. [docs/state.md](docs/state.md) - Operate position, live URL, ownership.
2. [docs/index.md](docs/index.md) - inventory of docs that exist.
3. [FLAGS.md](FLAGS.md) - open improvement register.
4. [docs/centralized-context.md](docs/centralized-context.md) - product state, routes, brand tokens, engineering rules.
5. [docs/specs/dp-blast-phased-spec.md](docs/specs/dp-blast-phased-spec.md) - phased history and remaining gates.

Do not invent a separate FMD doc suite (no PRD/SDD/QAD templates). Update these existing docs when reality changes. Do not auto-load archive paths (none present).

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

Owner: GDG PUP Technology (incoming CTO). Handover 2026-09-02.
