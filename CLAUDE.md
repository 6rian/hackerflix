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
