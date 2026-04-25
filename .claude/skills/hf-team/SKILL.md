---
name: hf-team
description: 'Coordinates a multi-agent team for HackerFlix (IMDb for tech). Use only when explicitly asked to create or assemble an agent team.'
---

# HackerFlix Agent Team

HackerFlix is a curated directory of tech/AI/hacking films and shows (IMDb-style). Content is sourced from TMDB, cached in Postgres via Supabase, and served with AdonisJS + Inertia.js + React.

**Active branch:** `v2` — always branch off `v2`. `main` is legacy v1.

## Stack Reference

| Layer    | Tech                                                         |
| -------- | ------------------------------------------------------------ |
| Backend  | AdonisJS 6 + TypeScript, Japa tests                          |
| Frontend | React + TypeScript + Tailwind CSS, Inertia.js (SSR)          |
| Database | PostgreSQL via Supabase (`dev` / `public` schema separation) |
| Dev env  | Docker + docker-compose, pnpm                                |
| CI       | GitHub Actions → GHCR → DigitalOcean                         |

## Agent Roles

### Engineer (Lead)

Owns all code and architecture across the full stack. Apply the `hf-engineer` skill for any implementation work.

- Entry point for all coding tasks: technical planning, feature implementation, bug fixes, devops, code reviews, performance optimization
- Delegates UI/UX design decisions to `hf-designer` when non-trivial
- Asks `hf-product-manager` for requirements clarification when needed
- Asks the user when confidence is below 90%

**Backend** — owns `app/` (controllers, middleware, exceptions, services), `commands/`, `start/`, `config/`, `adonisrc.ts`

- Tests: `node ace test` (Japa)
- Data models in `app/models/`: `Movie`, `TvSeries`, `Person`, `Genre`, `Image`, `Video`, `Season`, `Network`, `ProductionCompany`, plus credit/keyword/rating bridge tables
- TMDB data sync via `data:import` Ace command; token in `.env` as `TMDB_API_ACCESS_TOKEN`
- No user auth — ratings and reviews come directly from TMDB
- Non-secret config lives in `config/`, not `.env`

**Frontend** — owns `inertia/` (pages, components) and `resources/` (CSS, assets)

- Tests: `pnpm vitest`
- Pages in `inertia/pages/`: `home`, `movies`, `tv_shows`, `documentaries`, `media_details`, `search`, `tag`, `about`, `profile`
- Data flows from AdonisJS controllers via `inertia.render()` — no separate API layer
- Design system — dark-first cyberpunk: backgrounds `#0a0a0f`/`#0d1117`/`#12141c`; neon accents purple `#b026ff`/`#9333ea`, green `#00ff41`/`#22c55e`, blue `#00d4ff`/`#38bdf8`; both themes must work; WCAG AA; mobile-first 375/768/1280px

**Database** — owns `database/migrations/` and schema design

- Apply the `supabase` and `supabase-postgres-best-practices` skills
- `DB_SCHEMA=dev` (dev/staging), `DB_SCHEMA=public` (production)
- Read-heavy TMDB cache — index for reads; never modify already-run migrations

### Product Manager

Owns product direction, feature scoping, SEO strategy, and traffic acquisition strategy. Apply the `hf-product-manager` skill.

- Writes PRBs to GitHub Issues (`6rian/hackerflix`, label: `PRB`) scoped to feature complexity
- Consulted before significant new features to align on scope and acceptance criteria
- Does **not** implement code — defines what and why, engineers own the how
- When consulted mid-task: responds inline, then asks user if they want a GitHub issue created

### Designer

Owns UI/UX design for non-trivial components and layouts. Apply the `hf-designer` skill.

- Provides component designs, layout guidance, color/typography decisions, and Tailwind implementations
- Consulted by the Engineer when a new UI component or page layout is needed

## Coordination Rules

1. **Shared types** — when a controller response shape changes, update the corresponding Inertia page props type in the same PR.
2. **Pre-commit hooks** (husky + lint-staged) run Prettier, `tsc --noEmit`, and ESLint on every commit. Never bypass with `--no-verify`.
3. **pnpm only** — never use npm or yarn.
4. **Docker** — dev environment runs via `docker-compose up`; use `docker-compose exec app` to run Ace commands inside the container.

## Common Multi-Agent Workflows

All implementation steps use the `hf-engineer` skill regardless of whether the work is backend, frontend, or database.

**Propose a new feature:**

1. Product Manager (`hf-product-manager`) → write PRB, file GitHub issue with `PRB` label
2. Designer (`hf-designer`, if new layout/components) → design components and layout
3. Backend agent (`hf-engineer`) → implement server-side changes
4. Frontend agent (`hf-engineer`) → implement UI changes

**Add a new content field:**

1. Database agent (`hf-engineer`) → migration to add column
2. Backend agent (`hf-engineer`) → update model + controller
3. Frontend agent (`hf-engineer`) → update TypeScript page props + component

**Add a new page:**

1. Designer (`hf-designer`, if new layout patterns) → design page layout and components
2. Backend agent (`hf-engineer`) → route (`start/routes.ts`) + controller + `inertia.render()`
3. Frontend agent (`hf-engineer`) → page component in `inertia/pages/` + TypeScript props interface

**TMDB data model change:**

1. Backend agent (`hf-engineer`) → update `data:import` command + affected models
2. Database agent (`hf-engineer`) → migration for schema changes
3. Frontend agent (`hf-engineer`) → update any affected page components
