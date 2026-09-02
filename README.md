# DP Blast

GDG PUP event photo frame tool. Visitors upload a photo, pick an event frame, preview the composite, then download a profile-ready image.

**Live:** [https://frame.gdgpup.org](https://frame.gdgpup.org)

## Stack

From `package.json` / `astro.config.mjs`:

- Astro `^6` (server output)
- React `^19` via `@astrojs/react`
- Tailwind CSS `^4` via `@tailwindcss/vite`
- Vercel adapter (`@astrojs/vercel`)
- Sharp (OG images and optional server compositing route)
- Supabase JS (download analytics only)

Node `>=22.12.0`.

## Run locally

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

## Docs

Start here: [docs/centralized-context.md](docs/centralized-context.md)

Phased implementation history and remaining work: [docs/specs/dp-blast-phased-spec.md](docs/specs/dp-blast-phased-spec.md)

Agent conventions: [AGENTS.md](AGENTS.md)

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
| Outgoing CTO | Carlos Jerico Dela Torre |

Remaining work is hardening (rate limits, abuse controls) and formal QA, not greenfield feature build. Prefer reading shipped routes under `src/pages/` over stale phase checkboxes.

## Contributors

Built for [GDG PUP Manila](https://gdgpup.org) by:

| Role | Contributor |
| --- | --- |
| Development | [Gerald Berongoy](https://www.linkedin.com/in/geraldberongoy/) |
| Development | [Rhandie J. Sales Jr.](https://www.linkedin.com/in/rhandie-sales/) |
| CTO | [Carlos Jerico Dela Torre](https://www.linkedin.com/in/delatorrecj/) (outgoing, historical) |
