# HackerFlix

IMDb for tech — a curated directory of movies, TV shows, and documentaries about AI, hacking, cybersecurity, programming, privacy, and digital culture. Content sourced from TMDB.

Curated list: https://www.themoviedb.org/list/8214827-hackerflix-net

## Status

v2 is the active branch. Branch off `v2` for all features and bug fixes. `main` = legacy v1 (ignore for now).

## Stack

- **Backend**: AdonisJS + TypeScript
- **Frontend**: React + TypeScript + Tailwind CSS, via Inertia.js (SSR)
- **Database**: PostgreSQL via Supabase — TMDB data cached and refreshed on a schedule
- **Dev environment**: Docker + docker-compose
- **Package manager**: pnpm
- **Testing**: Japa (backend), Vitest (frontend)

## Design

Dark-first cyberpunk aesthetic with neon purple, green, and blue accents. Light theme available. Fully responsive and WCAG AA accessible.

Homepage features a hero section with a configurable featured title, followed by category sections. Individual pages include synopsis, cast, ratings, and media.

## Config

A config file (not env vars) stores non-secret values: TMDB list ID, featured content ID (default: _Hackers_, 1995), default theme, etc.

TMDB API Access Token is provided via `.env`. No user auth — reviews and ratings come directly from TMDB.

## Database

Single Supabase project with schema-based environment separation:

- **Dev / staging**: `dev` schema — set `DB_SCHEMA=dev`
- **Production**: `public` schema — set `DB_SCHEMA=public`

The `dev` schema must exist in Supabase before running migrations. Create it once via the Supabase SQL editor: `CREATE SCHEMA IF NOT EXISTS dev;`

Connection is configured via `DATABASE_URL` (full PostgreSQL connection string) and `DB_SCHEMA`. CI/CD tests run against a local Postgres service container (no Supabase credentials needed).

## Deployment

Target: DigitalOcean Droplet (~$6–18/mo) running Docker. Cloudflare sits in front for CDN and DDoS protection when needed.

## CI/CD

GitHub Actions pipelines:

**On pull request:**

- Lint, type-check
- Japa backend tests
- Vitest frontend tests

**On merge to `v2`:**

- All of the above
- Build Docker image and push to GitHub Container Registry (GHCR)
- SSH into the Droplet and run `docker-compose pull && docker-compose up -d`

## Git Hooks

A pre-commit hook (via `husky` + `lint-staged`) runs on every commit:

- **Prettier** on changed files
- **Type-check** (`tsc --noEmit`)
- **Lint** (`eslint`)

## Project Management

- Issues and feature requests tracked in GitHub Issues
- PRBs and PRDs are tracked in GitHub Issues.
- "Ticket" is the same thing as a GitHub Issue.
- Milestones are used to group related issues and track progress toward releases.
- Labels are used for categorization (e.g., `bug`, `feature`, `enhancement`, `documentation`).

## Claude Skills

Custom skills live in `.claude/skills/`. HackerFlix-specific skills use the `hf-` prefix:

- **`hf-engineer`** — lead engineer and architect. Technical planning, implementation, bug fixes, devops, code reviews, performance optimization. Entry point for all coding tasks.
- **`hf-product-manager`** — product direction, PRBs, SEO/traffic strategy. Does not write code.
- **`hf-team`** — coordinates multi-agent work across frontend, backend, database, and design.
- **`hf-designer`** — cyberpunk UI/UX guidance, component design, Tailwind implementations.

Third-party skills (`supabase`, `supabase-postgres-best-practices`) are bundled for database work.

## Rules

1. All code-related tasks must be assigned to `hf-engineer`.
2. Product and strategy tasks must be assigned to `hf-product_manager`.
3. Multi-agent coordination tasks must be assigned to `hf-team`.
4. Design-related tasks must be assigned to `hf-designer`.
5. For database schema design and queries, `hf-engineer` may utilize `supabase` and `supabase-postgres-best-practices` skills as needed.
6. Do not guess or assume requirements. If any aspect of a task is unclear, ask for clarification before proceeding.
7. Follow best practices for code quality, security, and performance. Prioritize maintainability and scalability in all implementations.
8. Communicate clearly and regularly about progress, blockers, and decisions.
