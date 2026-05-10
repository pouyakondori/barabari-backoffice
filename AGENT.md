# AGENT.md — Barabari Backoffice

## Project Description

Barabari Backoffice is the admin panel for the Barabari constitutional analysis platform. It provides management interfaces for all platform content including users, countries, constitutions, topics, comments, votes, podcasts, timeline events, and sandboxes.

## Quick Start

```bash
npm install
cp .env.example .env    # Set VITE_GRAPHQL_URL
npm run dev             # Start at http://localhost:5173
```

## Prerequisites

- Node.js 20+
- Backend API running (barabari-backend at http://localhost:4000)

## Key Technologies

- Vite 8 + React 19
- Ant Design 6 (RTL, Persian locale)
- Apollo Client 4 (GraphQL)
- react-router-dom 7 (lazy-loaded routes)
- TypeScript 6 (ESM, strict)
- Zod (validation)

## Project Structure

- `src/App.tsx` — Route definitions (lazy-loaded, protected)
- `src/layouts/` — AdminLayout (sidebar + header), AuthLayout
- `src/pages/` — Admin pages organized by domain (users, countries, constitutions, etc.)
- `src/components/` — Shared components (common, constitution, dashboard)
- `src/graphql/queries/` — GraphQL query documents
- `src/graphql/mutations/` — GraphQL mutation documents
- `src/hooks/` — Custom hooks (useDebounce, useNotification, usePagination)
- `src/types/index.ts` — Shared TypeScript types
- `src/auth/` — AuthProvider, ProtectedRoute, useAuth
- `src/locale/` — i18n (fa.json, en.json)
- `src/utils/` — Constants, formatters, validators

## Important Rules

1. **Never push or commit code.** Agents must never run `git commit`, `git push`, or any command that creates commits or pushes to a remote. Leave all version control operations to the developer.
2. Use `@/*` path aliases for all imports (maps to `src/*`).
3. All pages must be lazy-loaded with `React.lazy()` and wrapped in `<ProtectedRoute>`.
4. Use Ant Design as the sole UI library — do not add alternative component libraries.
5. RTL-first layout with `ConfigProvider direction="rtl" locale={faIR}`.
5. All user-facing strings must use `useTranslation` hook.
6. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Environment Variables

Key variables in `.env`:
- `VITE_GRAPHQL_URL` — Backend GraphQL endpoint
- `VITE_UPLOAD_URL` — File upload endpoint
- `VITE_APP_TITLE` — Application title
