# Repository Guidelines

## Project Structure & Module Organization
- api/: Express server, routes, auth, storage, and DB wiring (e.g., api/index.ts, api/routes.ts, api/db.ts).
- client/: React + TypeScript app (Vite). Pages in client/src/pages, components in client/src/components, hooks in client/src/hooks, utilities in client/src/lib.
- shared/: Code shared by client and server (e.g., shared/schema.ts, shared/types.ts).
- dist/: Build output (client bundle + server bundle).
- attached_assets/: Static/media assets for docs and UI.
- Path aliases (see vite.config.ts): `@` → client/src, `@shared` → shared, `@assets` → attached_assets.

## Build, Test, and Development Commands
- npm run dev: Start Express with Vite middleware in dev. Serves API and client at http://localhost:5000.
- npm run build: Build client (Vite) and bundle server (esbuild) to dist/.
- npm run check: Type-check the full project with tsc.
- npm run db:push: Sync Drizzle schema to the Postgres database.
- npm run create-admin: Create a default admin user (reads .env).

## Coding Style & Naming Conventions
- TypeScript + ESM; use 2-space indentation and explicit types on public functions.
- Components: PascalCase files (e.g., NewsCard.tsx) under client/src/components; pages in client/src/pages.
- Hooks/utilities: camelCase (e.g., useAuth.ts, authUtils.ts).
- Server modules: camelCase files in api/; API routes live under /api.
- Imports: prefer aliases (`@/components/...`, `@shared/...`) over deep relative paths.

## Testing Guidelines
- No formal test runner is configured yet. Use npm run check and manual verification at http://localhost:5000.
- If adding tests, place client tests under client/src/__tests__ with *.test.tsx (Vitest/RTL recommended) and keep them fast and isolated.
- For bug fixes, include repro steps and before/after screenshots or sample API requests.

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits when possible (e.g., feat(client): add SaveArticleButton).
- PRs: Include a clear summary, linked issues, screenshots (UI), sample requests (API), and environment notes.
- Database changes: note required migrations and run npm run db:push locally before review.

## Security & Configuration Tips
- Required env vars (.env): DATABASE_URL, SESSION_SECRET, AUTH_MODE. Never commit secrets.
- Local dev: set AUTH_MODE=mock. For deploy (Vercel), configure env vars in the dashboard.
