# Sous Marin Jaune

Meal ordering web app for the *Sous Marin Jaune* — a .NET Aspire distributed application with an ASP.NET Core API and a React 19 frontend.

## Stack

### Backend (`back/`)
- .NET 10 / ASP.NET Core
- .NET Aspire 13.5 AppHost orchestrating the API, MongoDB and Keycloak
- SignalR for real-time updates
- MongoDB for persistence
- Keycloak for authentication (OIDC)

### Frontend (`front/`)
- React 19.3 + TypeScript 7
- Vite+ (`vite-plus` 1.0 RC: Vite, Oxlint, Oxfmt, Vitest)
- MUI 9 (Material UI) + Emotion
- React Router 8, TanStack Query, Zustand, Inversify
- `oidc-client-ts` for Keycloak auth
- `@microsoft/signalr` client
- API client generated via `openapi-generator-cli` (`pnpm refresh-api`)
- Playwright for e2e tests, Vitest (through `vp test`) for unit tests

### Deploy (`deploy/`)
- Docker-based deployment workspace (pnpm)
- Build and DB update scripts

## Requirements

- .NET 10 SDK (pinned to 10.0.400+ by `global.json`)
- Node.js >= 26 (`.nvmrc`)
- pnpm 12.5.1
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
- `pnpm build` — production build
- `pnpm check` — format check, Oxlint and type check (`vp check`)
- `pnpm lint` — run Oxlint
- `pnpm fmt` — format with Oxfmt
- `pnpm test` — run the Vitest unit tests (`vp test`)
- `pnpm test:e2e` — run Playwright tests
- `pnpm refresh-api` — regenerate the OpenAPI client from the running API

### Backend tests

```bash
# from back/ (xunit.v3 on Microsoft.Testing.Platform, MongoDB through Testcontainers: Docker required)
dotnet test --solution SousMarinJaune.Api.slnx
```

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
All   -- Bump Aspire to 13.5.4
```
