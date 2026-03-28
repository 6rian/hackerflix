# HackerFlix

A curated directory of movies, TV shows, and documentaries about AI, hacking, cybersecurity, programming, and digital culture. Built with AdonisJS, React, and Inertia.js.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [pnpm](https://pnpm.io/installation) (for local tooling / pre-commit hooks)

## Local Development

1. Clone the repo
2. Copy the env file and fill in required values:
   ```sh
   cp .env.example .env
   ```
   Generate an `APP_KEY`:
   ```sh
   pnpm exec node ace generate:key
   ```
3. Install dependencies (sets up git hooks):
   ```sh
   pnpm install
   ```
4. Start the dev server:
   ```sh
   docker compose up
   ```
5. Open [http://localhost:3333](http://localhost:3333)

## Running Tests

```sh
pnpm test        # backend (Japa)
```

## Useful Commands

```sh
pnpm dev         # start dev server without Docker
pnpm build       # production build
pnpm lint        # ESLint
pnpm typecheck   # TypeScript type check
pnpm format      # Prettier (all files)
```

## Branching

`v2` is the active development branch. Branch off `v2` for all features and bug fixes.

```sh
git checkout v2
git checkout -b feat/your-feature
```
