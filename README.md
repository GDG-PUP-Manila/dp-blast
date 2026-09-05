# DP Blast

[![Status: Operate](https://img.shields.io/badge/Status-Operate-green)](docs/state.md)
[![Stack: Astro](https://img.shields.io/badge/Stack-Astro-black)](#stack)
[![FMD philosophy: 1.31.0](https://img.shields.io/badge/FMD%20philosophy-1.31.0-blue)](AGENTS.md)


GDG PUP event photo frame tool. Visitors upload a photo, pick an event frame, preview the composite, then download a profile-ready image.

**Live:** [https://frame.gdgpup.org](https://frame.gdgpup.org)

## Table of Contents

- [About](#about)
- [Start here](#start-here)
- [Stack](#stack)
- [Quick start](#quick-start)
- [Photo / PII handling](#photo--pii-handling)
- [Project status (handover)](#project-status-handover)
- [Documentation](#documentation)
- [Contributors](#contributors)

## About

DP Blast is GDG PUP's event photo frame tool. Visitors upload a photo, pick an event frame, preview the composite, then download a profile-ready image. Built for event attendees who want a shareable framed photo without creating an account.

**Live:** [https://frame.gdgpup.org](https://frame.gdgpup.org)

## Start here

- **Humans:** this README, then [docs/state.md](docs/state.md)
- **Agents:** [AGENTS.md](AGENTS.md) (state → index → FLAGS)
- **Contributors:** table below

## Stack

From `package.json` / `astro.config.mjs`:

- Astro `^6` (server output)
- React `^19` via `@astrojs/react`
- Tailwind CSS `^4` via `@tailwindcss/vite`
- Vercel adapter (`@astrojs/vercel`)
- Sharp (OG images and optional server compositing route)
- Supabase JS (download analytics only)

Node `>=22.12.0`.

## Quick start

```sh
npm install
npm run dev
```

Other scripts:

| Command | Action |
| --- | --- |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run astro ...` | Astro CLI |

Env and secrets: see [FLAGS.md](FLAGS.md) and [docs/state.md](docs/state.md).

## Photo / PII handling

- Anonymous use. No accounts or auth.
- Photos stay in the browser (`sessionStorage` / canvas) for the customize and download flow.
- Download analytics may record event slug, frame id, path, and user-agent in Supabase. Photos are not uploaded for analytics.

## Project status (handover)

| Field | Value |
| --- | --- |
| Milestone | **Operate** (MVP live; core upload → customize → download loop shipped) |
| Owner | GDG PUP Technology (incoming CTO) |
| Handover date | 2026-09-02 |
| Handover | 2026-09-02 |

Remaining work is hardening (rate limits, abuse controls) and formal QA, not greenfield feature build. Prefer reading shipped routes under `src/pages/` over stale phase checkboxes.

## Documentation

| Doc | Purpose |
|-----|---------|
| [State](docs/state.md) | Operate position (live URL, ownership) |
| [Index](docs/index.md) | Inventory of docs that exist |
| [FLAGS](FLAGS.md) | Open improvement register (docs handover) |
| [AGENTS](AGENTS.md) | Agent conventions (read order: state → index → FLAGS → task docs) |
| [centralized-context.md](docs/centralized-context.md) | Product context, routes, tokens |
| [dp-blast-phased-spec.md](docs/specs/dp-blast-phased-spec.md) | Phased history and remaining work |

## Contributors

This project is made possible by the GDG PUP community.

| Name | Role | GitHub |
| --- | --- | --- |
| [Carlos Jerico Dela Torre](https://www.linkedin.com/in/delatorrecj) | Chief Technology Officer (2025-2026) | [@delatorrecj](https://github.com/delatorrecj) |
| [Gerald Berongoy](https://www.linkedin.com/in/geraldberongoy) | Senior Backend Developer / Web Development Learning Head | [@geraldsberongoy](https://github.com/geraldsberongoy) |
| [Rhandie Sales](https://www.linkedin.com/in/rhandie-sales) | Senior Frontend Developer / Web Development Co Lead | [@r0undy](https://github.com/r0undy) |

