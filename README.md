# Sous Marin Jaune

Meal ordering web app for the *Sous Marin Jaune* — a .NET Aspire distributed application with an ASP.NET Core API and a React 19 frontend.

## Stack

### Backend (`back/`)
- .NET 10 / ASP.NET Core
- .NET Aspire 13 AppHost orchestrating the API, MongoDB and Keycloak
- SignalR for real-time updates
- MongoDB for persistence
- Keycloak for authentication (OIDC)

### Frontend (`front/`)
- React 19 + TypeScript
- Vite (via `vite-plus`)
- MUI 7 (Material UI) + Emotion
- TanStack Query, Zustand, Inversify
- `oidc-client-ts` for Keycloak auth
- `@microsoft/signalr` client
- API client generated via `openapi-generator-cli` (`pnpm refresh-api`)
- Playwright for e2e tests, Vitest for unit tests

### Deploy (`deploy/`)
- Docker-based deployment workspace (pnpm)
- Build and DB update scripts

## Requirements

- .NET 10 SDK
- Node.js >= 22
- pnpm 11
- Docker (for MongoDB / Keycloak containers spun up by Aspire)

## Running locally

The Aspire AppHost orchestrates every dependency (API, MongoDB, Keycloak, frontend).

```bash
# from the repo root
dotnet run --project back/SousMarinJaune.Api.AppHost
```

The Aspire dashboard URL will be printed in the console.

### Frontend standalone

```bash
cd front
pnpm install
pnpm dev
```

Useful frontend scripts:

- `pnpm dev` — start Vite dev server
- `pnpm build` — type-check + build
- `pnpm lint` — run ESLint
- `pnpm test` — run Vitest
- `pnpm test:e2e` — run Playwright tests
- `pnpm refresh-api` — regenerate the OpenAPI client from the running API

## Project layout

```
back/    .NET solution (Aspire AppHost, Web API, Core, Adapters, Db, Sockets, Tests)
front/   React 19 + Vite + MUI frontend
deploy/  Docker build + DB update scripts
```

## Docker support

The `deploy/` workspace builds Docker images for the API and the frontend.

Supported platforms:

- AMD64 (PC, Mac)
- ARM64 (Raspberry Pi 3/4)

## Contributing

Commits in this repo follow an `Area -- Subject` convention, e.g.:

```
Front -- Fix order summary alignment
Back  -- Add SignalR reconnection handler
All   -- Bump Aspire to 13.3.5
```
