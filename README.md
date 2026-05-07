# Barabari Backoffice

> Admin panel for managing the Barabari constitutional analysis and comparison platform.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## About

Barabari is a platform dedicated to empowering citizens through constitutional literacy. It provides deep-dive analysis of the Iranian Constitution, interactive comparisons with constitutions from around the world, and collaborative tools for civic engagement.

This repository contains the **backoffice (admin panel)** — a single-page application where administrators can:

- View dashboard analytics (users, votes, comments, growth charts)
- Manage users (roles, bans, verification)
- Manage countries (CRUD with bilingual content)
- Manage constitutions (hierarchical tree editor: chapters → articles → clauses)
- Tag clauses with comparison topics
- **Moderate comments** (approve, reject, bulk actions — all comments require approval before publishing)
- View vote analytics and export data
- Manage podcasts and timeline events
- Oversee user constitution sandboxes/remixes
- Configure featured content, heatmap scores, and interesting facts
- Edit static pages (About, Privacy, Terms)
- View audit logs of all admin actions

## Tech Stack

| Technology | Purpose |
|---|---|
| [Vite 5](https://vitejs.dev/) | Build tool & dev server |
| [React 18](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Ant Design 5](https://ant.design/) | Admin UI component library |
| [Apollo Client 3](https://www.apollographql.com/docs/react/) | GraphQL client |
| [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) | Typed GraphQL hooks |
| [React Router 6](https://reactrouter.com/) | Client-side routing |
| [Recharts](https://recharts.org/) | Dashboard charts |
| [TipTap](https://tiptap.dev/) | Rich text editor (bilingual content) |
| [Zod](https://zod.dev/) | Form validation |

## Related Repositories

| Repository | Description |
|---|---|
| [barabari-frontend](https://github.com/pouyakondori/barabari-frontend) | Public website (Next.js, React, Tailwind) |
| [barabari-backend](https://github.com/pouyakondori/barabari-backend) | GraphQL API server (Node.js, TypeGraphQL, MongoDB) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running (see [barabari-backend](https://github.com/pouyakondori/barabari-backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/pouyakondori/barabari-backoffice.git
cd barabari-backoffice

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate GraphQL types
npm run codegen

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_UPLOAD_URL=http://localhost:4000/upload
VITE_APP_TITLE=Barabari Admin
```

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Router + providers
├── apollo/               # Apollo Client config
├── auth/                 # Auth context, route guards
├── graphql/
│   ├── queries/          # GraphQL query documents
│   ├── mutations/        # GraphQL mutation documents
│   └── generated/        # Auto-generated types & hooks
├── layouts/              # AdminLayout, AuthLayout
├── pages/                # All admin pages
│   ├── Dashboard.tsx
│   ├── users/
│   ├── countries/
│   ├── constitutions/
│   ├── topics/
│   ├── comments/         # Comment approval & moderation
│   ├── votes/
│   ├── podcasts/
│   ├── timeline/
│   ├── sandboxes/
│   ├── settings/
│   └── audit/
├── components/
│   ├── common/           # BilingualInput, DataTable, ImageUpload, ...
│   ├── dashboard/        # StatCard, charts
│   └── constitution/     # ChapterTree, ClauseEditor, TopicTagSelect
├── hooks/                # useDebounce, usePagination, useNotification
├── utils/                # Formatters, validators, constants
└── types/
```

## Key Features

### Comment Approval Workflow

All user comments on the public site require admin approval before becoming visible:

- **Approval Queue** — Default view shows pending comments, sorted newest first
- **Quick Actions** — Approve, reject, or delete with one click
- **Bulk Moderation** — Select multiple comments and approve/reject in batch
- **Sidebar Badge** — Live count of pending comments for quick visibility
- **Re-approval** — Edited comments automatically return to pending status

### Constitution Tree Editor

Manage constitution content in a hierarchical tree:

- Chapters → Articles → Clauses
- Inline create/edit/delete at each level
- Drag-and-drop reorder
- Bilingual content (Persian + English) for all text fields
- Topic tagging on clauses for comparison features

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run codegen` | Generate GraphQL types from schema |

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
4. Push and open a Pull Request

This project uses **semantic-release** — version bumps and changelogs are automated based on commit messages.

## License

This project is licensed under the [MIT License](./LICENSE).
