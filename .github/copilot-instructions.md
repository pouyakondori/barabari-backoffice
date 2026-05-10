# Copilot Instructions — Barabari Backoffice

## Project Overview

Barabari Backoffice is the admin panel for the Barabari constitutional analysis platform. It provides management interfaces for users, countries, constitutions, topics, comments, votes, podcasts, timeline events, and sandboxes.

## Tech Stack

- **Build**: Vite 8 + `@vitejs/plugin-react`
- **Language**: TypeScript 6 (ESM, strict mode)
- **UI**: React 19, Ant Design 6 (RTL with `faIR` locale), `@ant-design/icons`
- **GraphQL**: Apollo Client 4
- **Routing**: react-router-dom 7 (BrowserRouter, lazy-loaded routes)
- **Validation**: Zod
- **Charts**: Recharts
- **Date**: dayjs
- **Lint**: ESLint 10 flat config (typescript-eslint + react-hooks + react-refresh)

## Architecture

```
src/
├── App.tsx                 # BrowserRouter with lazy-loaded admin routes
├── main.tsx                # ReactDOM.createRoot, ApolloProvider
├── apollo/client.ts        # Apollo Client with auth link
├── auth/                   # AuthProvider, ProtectedRoute, useAuth
├── config/env.ts           # Environment variables (VITE_GRAPHQL_URL, etc.)
├── layouts/                # AdminLayout (Ant Design Sider + Content), AuthLayout
├── pages/                  # Admin pages organized by domain
├── components/             # Shared components (common/, constitution/, dashboard/)
├── graphql/
│   ├── queries/            # GraphQL query documents
│   └── mutations/          # GraphQL mutation documents
├── hooks/                  # Custom hooks (useDebounce, useNotification, usePagination)
├── types/index.ts          # Shared TypeScript type definitions
├── locale/                 # fa.json, en.json, useTranslation hook
└── utils/                  # constants, formatters, validators
```

## Coding Conventions

### Naming
- **PascalCase** for React components and their files
- **camelCase** for hooks, utilities, and variables
- **kebab-case** for utility file names (`formatters.ts`, `validators.ts`)

### Components
- Use `React.lazy()` + `Suspense` for all page-level components (route-based code splitting)
- Use Ant Design components as the primary UI library — do not mix with other UI libraries
- RTL-first: `ConfigProvider direction="rtl" locale={faIR}`

### Routing
- Define all routes in `App.tsx` using react-router-dom `<Routes>` / `<Route>`
- Wrap admin routes with `<ProtectedRoute>` for auth enforcement
- Use `<AdminLayout>` as the layout wrapper for all admin pages

### GraphQL
- Queries go in `src/graphql/queries/`
- Mutations go in `src/graphql/mutations/`
- Use Apollo Client hooks (`useQuery`, `useMutation`) in components
- Apollo Client configured in `src/apollo/client.ts`

### Auth
- JWT stored in `localStorage`
- `AuthProvider` context manages auth state globally
- Admin role enforced via `ProtectedRoute` component

### Path Aliases
- `@/*` maps to `src/*` — always use `@/` for imports

### Types
- Shared type definitions in `src/types/index.ts`
- Includes `PaginatedResult<T>` generic for paginated responses

### i18n
- All user-facing strings use the `useTranslation` hook
- Translations in `src/locale/fa.json` and `src/locale/en.json`
- Persian (fa) is the default language

## Code Style

- **Never push or commit code.** Agents must never run `git commit`, `git push`, or any command that creates commits or pushes to a remote. Leave all version control operations to the developer.
- `strict: true` with `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`
- ESM module system (`"type": "module"`)
- Prefer `async/await` over raw promises
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)

## Common Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check + Vite build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```
