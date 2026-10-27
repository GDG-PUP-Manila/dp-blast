# Project State: DP Blast

**Owner:** GDG PUP Technology (incoming CTO)  
**Last updated:** 2026-10-27
**Handover:** 2026-09-02  

## Position

| Field | Value |
| --- | --- |
| **Current milestone** | Operate |
| **Live URL** | https://frame.gdgpup.org |
| **What it is** | Event photo frame tool: upload, pick frame, preview, download |
| **Current blocker** | Hardening (rate limits / abuse controls) and formal QA still remaining |
| **Owner of the next step** | GDG PUP Technology (incoming CTO) |

**Engagement type:** Internal chapter product (event tooling), not a commercial engagement.

Core upload -> customize -> download loop is shipped. Prefer operate/harden over greenfield rebuild. See [centralized-context.md](centralized-context.md) for routes and phase honesty, and [../FLAGS.md](../FLAGS.md) for the improvement register.

Editor update (2026-10-17): theme preferences, IndexedDB photo handoff, desktop dragging, and keyboard/dialog fixes committed as `82e62da` with Chromium acceptance coverage. Site maintainer credit is Kian Angelo M. Florendo.

Local catalog update (2026-10-27): Membership Application ’27 added at `/events/membership-2027`, using the provided `DP_Blast_mem.png` and caption. Caption gaps and empty credit names are intentional per the user. This catalog update is committed locally; user push and deployment are pending.
