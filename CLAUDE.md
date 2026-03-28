# HackerFlix

IMDb for tech — a curated directory of movies, TV shows, and documentaries about AI, hacking, cybersecurity, programming, privacy, and digital culture. Content sourced from TMDB.

Curated list: https://www.themoviedb.org/list/8214827-hackerflix-net

## Status

v2 is the active branch. Branch off `v2` for all features and bug fixes. `main` = legacy v1 (ignore for now).

## Stack

- **Backend**: AdonisJS + TypeScript
- **Frontend**: React + TypeScript + Tailwind CSS, via Inertia.js (SSR)
- **Database**: SQLite — TMDB data cached locally and refreshed on a schedule
- **Dev environment**: Docker + docker-compose
- **Package manager**: pnpm
- **Testing**: Japa (backend), Vitest (frontend)

## Design

Dark-first cyberpunk aesthetic with neon purple, green, and blue accents. Light theme available. Fully responsive and WCAG AA accessible.

Homepage features a hero section with a configurable featured title, followed by category sections. Individual pages include synopsis, cast, ratings, and media.

## Config

A config file (not env vars) stores non-secret values: TMDB list ID, featured content ID (default: _Hackers_, 1995), default theme, etc.

TMDB API Access Token is provided via `.env`. No user auth — reviews and ratings come directly from TMDB.

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
