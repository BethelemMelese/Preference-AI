# Architecture

## Guiding principles

1. **User selections are the source of truth.** AI output is stored separately and never overwrites a `UserPreference`.
2. **Secrets and AI calls stay on the server.** The browser never sees the OpenAI key or calls OpenAI directly.
3. **Thin routes, logic in `lib/`.** Route handlers validate input, call a function, and shape the response.
4. **AI logic is separate from normal business logic** (`lib/ai` vs `lib/services`), and each AI feature is one readable file, with no generic "AI engine" hiding the calls.
5. **No dependency without a reason.** Every package is listed below with its purpose.

## System overview

```
┌──────────────────────────── Browser ────────────────────────────┐
│  React components (Client Components for interactive UI)        │
│  Dashboard · Discovery cards · Suggestions · Reports · History  │
└───────────────┬─────────────────────────────────────────────────┘
                │ fetch() JSON over HTTPS (+ guest-id cookie)
┌───────────────▼──────────── Next.js server (Vercel) ────────────┐
│  app/ pages (Server Components) ──┐                              │
│  app/api/* Route Handlers ────────┤  ← thin: validate, call      │
│                                   ▼    service, shape response   │
│  ┌─────────── lib/services ───────────┐  ┌──── lib/ai ─────────┐ │
│  │ preferences · categories · reports │  │ client.ts (OpenAI)  │ │
│  │ (business rules, Prisma queries)   │  │ prompts/*.ts        │ │
│  └───────────────┬────────────────────┘  │ schemas/*.ts (Zod)  │ │
│                  │                       │ generate-items.ts…  │ │
│  ┌───────────────▼────────┐              └─────────┬───────────┘ │
│  │ lib/db.ts (Prisma)     │   lib/rate-limit.ts ◄──┤             │
│  └───────────────┬────────┘   (reads AIRequestLog) │             │
└──────────────────┼─────────────────────────────────┼─────────────┘
                   ▼                                 ▼
            PostgreSQL                     OpenAI Responses API
```

## Reads vs. writes

- **Page loads** read data directly in Server Components through `lib/services`. There's no HTTP round-trip to our own API.
- **Mutations and AI actions** go through REST route handlers (`app/api/*`), called with `fetch()` from Client Components.
- Both paths call the **same** service functions, so logic is never duplicated.

## Identity (before authentication)

An anonymous **guest user** is created on first visit, and its id is stored in a secure, httpOnly cookie that browser JavaScript can't read. Auth.js will later attach a login to that same `User` row, so no data migration is needed. `name` and `email` are optional to avoid collecting unnecessary personal data.

## Key decisions log

| # | Decision | Reason |
|---|---|---|
| 1 | Guest users via cookie before auth | Every record needs an owner from day one |
| 2 | `AIRequestLog` table for rate limits and cost | In-memory counters don't work across serverless instances; also gives cost visibility |
| 3 | 3-layer duplicate prevention (prompt exclusion list → code normalization → DB unique constraint) | Prompts are probabilistic; constraints are guarantees |
| 4 | Context rebuilt from Postgres for every AI call | Database is the source of truth; no reliance on OpenAI-side conversation state |
| 5 | Report fingerprint (`inputHash`) cache | Avoid paying for a report when preferences haven't changed |
| 6 | Accepting a suggestion = new item (`source = AI_SUGGESTION`) + explicit LIKE | The LIKE is a real user click; rejecting never creates a DISLIKE |
| 7 | Model name in `OPENAI_MODEL` env var | Model choice is configuration, not code |
| 8 | shadcn/ui on Radix, "nova" preset | Mature, widely documented, works well with jsdom testing |
| 9 | Local Postgres in Docker | Isolated, reproducible, easy to reset; same major version as production |

## Dependencies

| Package | Purpose | Added |
|---|---|---|
| `next`, `react`, `react-dom` | Framework, UI and server | Phase 1 |
| `typescript`, `@types/*` | Static type checking | Phase 1 |
| `tailwindcss`, `@tailwindcss/turbopack` | Utility-class CSS; Tailwind 4 plugs into Turbopack directly (no PostCSS config) | Phase 1 |
| `eslint`, `eslint-config-next` | Linting | Phase 1 |
| `shadcn` | CLI + shared base CSS (`shadcn/tailwind.css`) | Phase 1 |
| `radix-ui` | Accessible headless primitives behind shadcn components | Phase 1 |
| `class-variance-authority` | Declares component variants (e.g. button `variant`/`size`) | Phase 1 |
| `cn` | Merges Tailwind class names, resolving conflicts (replaces clsx + tailwind-merge) | Phase 1 |
| `tw-animate-css` | Animation utilities used by shadcn components | Phase 1 |
| `lucide-react` | Icons | Phase 1 |
| `prisma`, `@prisma/client` | Schema, migrations, typed DB client | Phase 3 |
| `zod` | Runtime validation of requests and AI output | Phase 3 |
| `openai` | Official OpenAI SDK | Phase 4 |
| `vitest`, Testing Library, `jsdom` | Tests | Phase 8 |

## Folder structure (current)

```
src/
├── app/            routes only (pages, layouts, route handlers)
├── components/
│   └── ui/         shadcn components (owned source code)
└── lib/            non-UI logic (utils now; services, ai, db later)
docs/               project documentation
```
