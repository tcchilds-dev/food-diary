# Food Diary MVP

This is a very simple food diary web app that allows users to make entries into
their food diary, and view the history of entries.

If you don't want to hear about my thoughts on the project itself,
skip to the next section.

Originally the scope had been much larger, with statistical tracking of correlations
between symptoms, food, and exercise. But as a new learner of programming, I felt
that the scale of work required wouldn't serve me best considering this was meant
to be a relatively small project that I could use to try out full stack development
and learn JavaScript + TypeScript.

I used a small amount of AI during this project, mostly to test out it's capabilities.
In almost all areas it was underwhelming, and I had to redo a lot of what it had done.
I did however find it helpful for giving me a baseline idea of what was expected
in many areas, so that I could use that as a template to build the things myself.
I purposefully engaged with all areas myself and made sure to fully understand them,
as I've heard of the detrimental effects of using AI, especially when learning.
Apart from the contents of the rest of this README, that was written by AI.

There were a lot of areas where this project fell short of what I was imagining
it would be. But they were largely down to available time. I spent two weeks on
this project, and I was learning almost all of the technology used as I went.
Considering those limitations, I would say I'm relatively content with how it
turned out. And I'm happy with how much I managed to learn through building it.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Repository Layout](#repository-layout)
4. [Prerequisites](#prerequisites)
5. [Initial Setup](#initial-setup)
6. [Running the App](#running-the-app)
7. [Available npm Scripts](#available-npm-scripts)
8. [Backend Details](#backend-details)
9. [Database & Prisma](#database--prisma)
10. [Frontend Details](#frontend-details)
11. [Testing & Quality](#testing--quality)
12. [Troubleshooting](#troubleshooting)
13. [Additional Documentation](#additional-documentation)

## Overview

This monorepo contains a TypeScript Express API (`backend/`) and a Svelte 5 +
Vite frontend (`frontend/`) connected through npm workspaces. The API handles
user authentication plus CRUD for food, symptom, and exercise entries stored in
a SQLite database via Prisma. The frontend provides a single-page dashboard with
authentication forms, entry creation flows, and history filtering.

## Tech Stack

- **Backend (`backend/`)**: Node.js 20, Express 4, TypeScript 5, Prisma 5
  (SQLite), bcrypt, jsonwebtoken, express-rate-limit, morgan, Nodemon, ts-node,
  Jest + ts-jest + jest-mock-extended + Supertest.
- **Frontend (`frontend/`)**: Svelte 5 runes, Vite 7, TypeScript, Tailwind CSS
  4, bits-ui/shadcn-style components.
- **Tooling**: npm workspaces (root `package.json`), shared `node_modules/`,
  Prisma CLI, Faker-based seed script, Vite dev server, SQLite dev/test
  databases checked into `backend/prisma/`.

## Repository Layout

```
.
├── backend/
│   ├── API.md
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── dev.db / test.db
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── client.ts
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── controllers/__tests__/
├── frontend/
│   ├── src/
│   │   ├── App.svelte
│   │   ├── app.css
│   │   └── lib/
│   │       ├── api.ts
│   │       ├── store/
│   │       ├── components/
│   │       └── hooks/
│   └── vite.config.ts
├── node_modules/
├── package.json
├── package-lock.json
├── requirements.txt
└── README.md
```

## Prerequisites

Install the following before working with the repo:

- **Node.js 20+** and npm 10+ (ships with Node 20).
- **SQLite 3.40+** so Prisma can create the `dev.db` and `test.db` files.
- **npx access to Prisma CLI** (installed via `backend/package.json`). No global
  install is required, but ensure `npx prisma -v` works.
- **Git** (already in use) and a POSIX-friendly shell if you plan to run the
  combined `npm run dev` script.

Optional but helpful: VS Code with the Svelte extension, Prisma VS Code
extension, and a REST client such as Thunder Client or Postman for exercising
the API.

## Initial Setup

1. **Install workspace dependencies**

   ```bash
   npm install
   ```

   Running `npm install` from the repo root installs the shared dependencies and
   both workspaces (`backend` and `frontend`). You can still scope installs
   later with `npm install --workspace backend <pkg>`.

2. **Configure backend environment variables**

   Create `backend/.env` with the secrets the API expects (`dotenv` loads it in
   `backend/src/server.ts`):

   ```bash
   PORT=3000
   JWT_SECRET=replace-with-a-long-random-string
   ```

   - `PORT` defaults to `3000` if omitted.
   - `JWT_SECRET` is required for signing tokens. Use a strong, random value.
   - If you move away from SQLite, add `DATABASE_URL` here and update
     `prisma/schema.prisma` accordingly.

3. **Run Prisma migrations and generate the client**

   ```bash
   npm run prisma:migrate --workspace backend
   npm run prisma:generate --workspace backend
   ```

   Migrations target the `backend/prisma/dev.db` SQLite database.
   `prisma:generate` refreshes the TypeScript client imported in
   `backend/src/client.ts`.

4. **(Optional) Seed sample data**

   The seed script in `backend/prisma/seed.ts` uses `@faker-js/faker` to create
   entries for `userId = 1`. Make sure that user exists (e.g., register one via
   the API) or edit the script to match your IDs, then run:

   ```bash
   npx ts-node --project backend/tsconfig.json backend/prisma/seed.ts
   ```

   Alternatively, from the repo root:

   ```bash
   (cd backend && npx ts-node prisma/seed.ts)
   ```

5. **Configure frontend environment variables**

   The frontend reads `import.meta.env.VITE_API_URL` in
   `frontend/src/lib/api.ts`. Create `frontend/.env` so local fetches hit the
   Express API:

   ```bash
   VITE_API_URL=http://localhost:3000/api
   ```

   If you rely on Vite's proxy in `frontend/vite.config.ts`, keep the value
   aligned with your backend origin (update both when changing ports or
   protocols).

## Running the App

- **Start both servers (POSIX shells):**

  ```bash
  npm run dev
  ```

  This runs `backend` (`nodemon` + `ts-node` on port 3000) and `frontend` (Vite
  on port 5173) in the same terminal via `&`. On Windows PowerShell/CMD, start
  them in separate terminals instead.

- **Start services individually:**

  ```bash
  npm run dev:backend
  npm run dev:frontend
  ```

- **Verify the stack:**
  - API health check: `curl http://localhost:3000/health`
  - Frontend: open `http://localhost:5173`

Use `Ctrl+C` in each terminal to stop the dev servers.

## Available npm Scripts

- **root** — `npm run dev`: Run backend and frontend dev servers concurrently
  (POSIX shells).
- **root** — `npm run dev:backend` / `npm run dev:frontend`: Run a single
  workspace dev server.
- **root** — `npm run build`: Run `npm run build` inside each workspace (backend
  TypeScript build + frontend Vite build).
- **backend** — `npm run dev`: Nodemon + ts-node watcher using
  `backend/nodemon.json`.
- **backend** — `npm run build` / `npm run start`: Compile TypeScript to
  `backend/dist/` and launch the compiled server.
- **backend** — `npm run prisma:migrate` / `npm run prisma:generate` / `npm run
prisma:studio`: Prisma database management helpers.
- **backend** — `npm run test` / `npm run test:watch` / `npm run test:coverage`:
  Jest unit/integration tests for controllers and middleware.
- **frontend** — `npm run dev` / `npm run build` / `npm run preview`: Standard
  Vite lifecycle commands.
- **frontend** — `npm run check`: Runs `svelte-check` (with `tsconfig.app.json`)
  plus TypeScript project checks.

## Backend Details

- **Application composition (`backend/src/app.ts`, `backend/src/server.ts`):**
  - Loads env vars via `dotenv` and starts Express on `process.env.PORT ||
3000`.
  - Applies `express-rate-limit` (100 requests/15 minutes/IP) and `morgan`
    logging.
  - Enforces CORS for `http://localhost:5173` with credentials.
  - Registers JSON parsing, `/health` heartbeat, `/api/auth`, `/api/entries`,
    and a catch-all error handler.

- **Controllers (`backend/src/controllers/`)**:
  - `authController.ts` handles register/login/profile using Prisma, bcrypt
    hashing, and JWT issuance (7-day expiry).
  - `entryController.ts` implements CRUD plus filtering by date range or entry
    type, enforcing ownership via `userId`.

- **Middleware (`backend/src/middleware/`)**:
  - `auth.ts` validates `Authorization: Bearer <token>` headers and stores
    `userId` on the request.
  - `validateEntry.ts` ensures each entry type includes the required domain
    fields (e.g., `foodName` for food entries).

- **Routing (`backend/src/routes/`)**:
  - `authRoutes.ts`: `/api/auth/register`, `/api/auth/login`,
    `/api/auth/profile` (profile protected by `authenticate`).
  - `entryRoutes.ts`: All routes protected; supports
    create/list/get/update/delete on `/api/entries`.

- **API overview** (full request/response examples live in `backend/API.md`):
  - **GET `/health`**: Service heartbeat for monitoring.
  - **POST `/api/auth/register`**: Create a user and return a JWT.
  - **POST `/api/auth/login`**: Authenticate and return a JWT.
  - **GET `/api/auth/profile`**: Return the authenticated user's profile.
  - **POST `/api/entries`**: Create a food/symptom/exercise entry (validated).
  - **GET `/api/entries`**: List entries with `date`, `startDate/endDate`, and
    `entryType` filters.
  - **GET `/api/entries/:id`**: Fetch a single entry by ID (must belong to the
    caller). (unused)
  - **PUT `/api/entries/:id`**: Update an existing entry with validation. (unused)
  - **DELETE `/api/entries/:id`**: Remove an entry owned by the caller.

- **Error handling**: Centralized middleware logs stack traces and returns JSON
  errors (`{ error: string }`). Authentication failures return HTTP 401;
  validation errors use 400/404 accordingly.

## Database & Prisma

- **Schema (`backend/prisma/schema.prisma`)**:
  - `User`: `id`, `email`, `password`, optional `name`, timestamps, and
    `entries` relation.
  - `Entry`: Polymorphic record keyed by `entryType` with optional fields for
    food, symptom, and exercise details. Indexed by `(userId, date)` and
    `(userId, entryType)` for faster filtering.
  - Default datasource is SQLite (`file:./dev.db`).

- **Migrations**: Stored under `backend/prisma/migrations/`; run `npm run
prisma:migrate --workspace backend` whenever the schema changes.

- **Generated client**: Imported from `backend/src/client.ts` and shared across
  controllers. If you tweak the schema, rerun `npm run prisma:generate
--workspace backend`.

- **Seeding**: `backend/prisma/seed.ts` populates example entries via Faker.
  Update the `userId` or extend it to create users if you need a fully
  bootstrapped database.

- **Inspection**: Launch Prisma Studio with `npm run prisma:studio --workspace
backend` to view/edit records through a UI.

- **SQLite files**: `dev.db` (local development) and `test.db` (Jest/misc) live
  alongside the schema. Treat them as disposable artifacts; delete and rerun
  migrations if you need a clean slate.

## Frontend Details

- **Entry point**: `frontend/src/main.ts` mounts `App.svelte` and imports
  `app.css`.
- **State management**: Uses Svelte 5 runes (`$state`, `$derived`, `$effect`)
  inside `App.svelte` plus an `AuthStore` class defined in
  `frontend/src/lib/store/auth.svelte.ts` to load/login/logout users via the
  API.
- **API client**: `frontend/src/lib/api.ts` centralizes fetch logic,
  automatically attaching `Authorization` headers when a JWT is stored in
  `localStorage`. All requests default to `VITE_API_URL` and `credentials:
"include"`.
- **UI components**: The `frontend/src/lib/components/` directory contains:
  - Authentication form shells (`login-form.svelte`, `signup-form.svelte`,
    `login-01/+page.svelte`, etc.).
  - Sidebar/navigation primitives (`app-sidebar.svelte`, `nav-*.svelte`).
  - A large `ui/` folder with composable bits-ui/shadcn-inspired components
    (buttons, tables, popovers, tabs, cards, etc.).
  - Visualization helpers such as `bar-chart.svelte` leveraging LayerChart +
    d3-scale animations.
- **Styling & theming**: Tailwind CSS 4 is configured inline in
  `frontend/src/app.css`, defining custom CSS variables for light/dark themes.
  The `mode-watcher` package plus `SunIcon`/`MoonIcon` toggles allow end-users
  to switch themes.
- **Features surfaced in `App.svelte`**:
  - Login/signup flows with inline validation and error messaging.
  - Entry creation forms for food, symptom, and exercise data, each gated by the
    `entryType` state and validated before hitting the API.
  - Entry history table with filters for type and time windows
    (day/week/month/year) plus derived statistics to drive the chart.
  - Basic chart/metric cards powered by `layerchart` and Lucide icons.
- **Dev server proxy**: `frontend/vite.config.ts` proxies `/api` calls to the
  backend (`https://localhost:3000` by default). Keep this in sync with
  `VITE_API_URL` or disable the proxy if you rely exclusively on the env
  variable.

## Testing & Quality

- **Backend unit tests** (`backend/src/controllers/__tests__/`):
  - Jest is configured via `backend/jest.config.js` with `ts-jest` presets.
  - `backend/src/singleton.ts` provides a mocked Prisma client (powered by
    `jest-mock-extended`) so controller tests do not hit the SQLite database.
  - Run `npm run test --workspace backend` for a single pass, `npm run
test:watch --workspace backend` while iterating, or `npm run test:coverage
--workspace backend` to emit coverage reports.
  - Supertest is available for future HTTP-level tests even though current
    suites focus on controller logic.

- **Frontend checks**:
  - Run `npm run check --workspace frontend` to execute `svelte-check` plus
    TypeScript project validation.
  - No dedicated UI/unit test harness is set up yet; add Vitest/Playwright if
    you need coverage beyond type safety.

- **Formatting/linting**: Tailwind 4 handles most styling concerns, and
  ESLint/Prettier are not configured. Adopt your preferred tooling if you need
  automated formatting or lint rules.

## Troubleshooting

- **JWT or auth errors**: Ensure `backend/.env` contains `JWT_SECRET` and that
  clients send `Authorization: Bearer <token>` headers. Tokens older than seven
  days will be rejected.
- **CORS or fetch failures**: Update `backend/src/app.ts` and `frontend/.env`
  when changing the frontend origin or API base URL. Remember that `cors`
  currently allows only `http://localhost:5173`.
- **Database lock or migration issues**: Delete `backend/prisma/dev.db`, rerun
  the migration commands, and regenerate the Prisma client. Make sure no other
  process (Prisma Studio, tests) is holding the file open.
- **Seed script foreign key errors**: The seeder assumes a `User` with `id = 1`.
  Insert a user first (via `/api/auth/register`) or adjust the script before
  running it.
- **`npm run dev` on Windows**: Because the root script uses the POSIX `&`
  operator, Windows users should open two terminals and run `npm run
dev:backend` and `npm run dev:frontend` separately.
- **Frontend cannot reach `/api`**: Verify that `VITE_API_URL` matches the
  backend protocol/host/port and that the Vite proxy target in
  `frontend/vite.config.ts` uses the same protocol (`http` vs `https`).

## Additional Documentation

- `backend/API.md` — Exhaustive request/response samples and parameter notes for
  every API endpoint.
- `backend/prisma/schema.prisma` — The authoritative data-contract for the API.
- `frontend/README.md` — The default Vite + Svelte template notes (only needed
  if you want to compare with upstream template settings).

Feel free to extend this README with deployment notes, architecture diagrams, or
screenshots once you add the project description at the top.
