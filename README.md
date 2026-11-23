# PreferenceAI

An AI-powered personal preference discovery app. Users explore categories, mark items as **Like**, **Dislike**, or **Not sure**, and receive AI-generated suggestions, analyses, and reports. Those AI outputs are always built from, and kept separate from, the choices the user actually made.

> **Status:** Phase 1 (project setup) complete. See [docs/DEVELOPMENT_PROGRESS.md](docs/DEVELOPMENT_PROGRESS.md).

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix), Lucide icons |
| Backend | Next.js Route Handlers (Node.js runtime), REST |
| AI | OpenAI Responses API via the official `openai` SDK, Structured Outputs, Zod *(Phase 4+)* |
| Database | PostgreSQL 17 (Docker locally) + Prisma *(Phase 3+)* |
| Testing | Vitest, React Testing Library *(Phase 8)* |
| Deployment | GitHub → Vercel, hosted PostgreSQL *(Phase 8)* |

## Prerequisites

- Node.js 20.9 or newer (developed on 22.15)
- npm
- Git
- Docker Desktop (from Phase 3)

## Getting started

```powershell
npm install                       # install dependencies from package-lock.json
Copy-Item .env.example .env       # then fill in real values (never commit .env)
npm run dev                       # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (what Vercel runs) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate Next.js route types, then run the TypeScript compiler without emitting files |

## Documentation

| Document | Contents |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, layers, request flow, key decisions |
| [DATABASE.md](docs/DATABASE.md) | Models, relationships, constraints |
| [OPENAI_INTEGRATION.md](docs/OPENAI_INTEGRATION.md) | How the OpenAI integration works, step by step |
| [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Every endpoint: request, response, errors |
| [LEARNING_NOTES.md](docs/LEARNING_NOTES.md) | Technical learning journal |
| [DEVELOPMENT_PROGRESS.md](docs/DEVELOPMENT_PROGRESS.md) | Completed and remaining work |
