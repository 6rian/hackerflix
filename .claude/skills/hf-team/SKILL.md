---
name: hf-team
description: 'Coordinate multi-agent team work on HackerFlix (IMDb for tech). Use when breaking a task across frontend, backend, database, or design concerns.'
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

### Backend Agent

Owns `app/` (controllers, middleware, exceptions, services), `commands/`, `start/`, `config/`, `adonisrc.ts`.

- Tests: `node ace test` (Japa)
- Data models live in `app/models/` — key types: `Movie`, `TvSeries`, `Person`, `Genre`, `Image`, `Video`, `Season`, `Network`, `ProductionCompany`, plus credit/keyword/rating bridge tables
- TMDB data sync runs via `data:import` Ace command in `commands/`
- No user auth — ratings and reviews come directly from TMDB
- Non-secret config (TMDB list ID, featured content ID, default theme) lives in `config/`, not `.env`
- TMDB API token is in `.env.dev` as `TMDB_API_ACCESS_TOKEN`

### Frontend Agent

Owns `inertia/` (pages, components) and `resources/` (CSS, assets).

- Tests: `pnpm vitest`
- Pages live in `inertia/pages/`: `home`, `movies`, `tv_shows`, `documentaries`, `media_details`, `search`, `tag`, `about`, `profile`
- Data flows from AdonisJS controllers via `inertia.render()` — no separate API layer
- **Design system — dark-first cyberpunk:**
  - Backgrounds: `#0a0a0f`, `#0d1117`, `#12141c` (never pure black)
  - Neon accents: purple `#b026ff`/`#9333ea`, green `#00ff41`/`#22c55e`, blue `#00d4ff`/`#38bdf8`
  - Light theme is available — both themes must work
- Responsive: mobile-first at 375 / 768 / 1280px
- WCAG AA: 4.5:1 contrast for body, visible focus states, 44×44px touch targets

For non-trivial UI/layout decisions and features that require new designs/coponents, delegate to the `cyberpunk-ui-designer` agent.

### Database Agent

Owns `database/migrations/` and schema design.

- Apply the `supabase` and `supabase-postgres-best-practices` skills
- Schema-based env separation: `DB_SCHEMA=dev` (dev/staging), `DB_SCHEMA=public` (production)
- TMDB data is read-heavy and cached locally — index for read performance
- Never modify already-run migrations; always add new ones

## Coordination Rules

1. **Shared types** — when a controller response shape changes, update the corresponding Inertia page props type in the same PR.
2. **Pre-commit hooks** (husky + lint-staged) run Prettier, `tsc --noEmit`, and ESLint on every commit. Never bypass with `--no-verify`.
3. **pnpm only** — never use npm or yarn.
4. **Docker** — dev environment runs via `docker-compose up`; use `docker-compose exec app` to run Ace commands inside the container.

## Common Multi-Agent Workflows

**Add a new content field:**

1. Database agent → migration to add column
2. Backend agent → update model + controller
3. Frontend agent → update TypeScript page props + component

**Add a new page:**

1. Backend agent → route (`start/routes.ts`) + controller + `inertia.render()`
2. Frontend agent → page component in `inertia/pages/` + TypeScript props interface
3. Design agent (if new layout patterns) → `cyberpunk-ui-designer`

**TMDB data model change:**

1. Backend agent → update `data:import` command + affected models
2. Database agent → migration for schema changes
3. Frontend agent → update any affected page components
