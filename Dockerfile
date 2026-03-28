FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base AS dev
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3333
CMD ["pnpm", "run", "dev"]

FROM base AS build
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:22-slim AS prod
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3333
CMD ["node", "build/bin/server.js"]
