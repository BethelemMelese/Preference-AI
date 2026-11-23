# Database

> **Status:** Planned design. The Prisma schema is written and explained in **Phase 3**; this file will then document the final models.

PostgreSQL 17 + Prisma ORM. Local development runs Postgres in Docker.

## Planned models

| Model | Purpose | Key constraints |
|---|---|---|
| `User` | Owner of all data. Starts as an anonymous guest. `name`/`email` optional | `email` unique (nullable) |
| `Category` | The 10 predefined categories (custom ones later) | `slug` unique, `sortOrder` |
| `PreferenceItem` | Something a user can rate, shared across users | unique `(categoryId, normalizedName)`; `source` enum |
| `UserPreference` | **The source of truth:** one user's decision on one item | unique `(userId, itemId)`; `decision` enum |
| `AISuggestion` | AI-proposed item + reasoning, awaiting accept/reject | `status` enum |
| `AIReport` | Stored analysis or full report (JSON) | `type` enum; `inputHash` for caching |
| `AIRequestLog` | One row per OpenAI call: tokens, latency, outcome | indexed on `(userId, createdAt)` for rate limiting |

## Planned enums

- `Decision`: `LIKE`, `DISLIKE`, `NOT_SURE` (Skip is *not* stored; it means "no decision")
- `ItemSource`: `SEED`, `AI_GENERATED`, `USER_CREATED`, `AI_SUGGESTION`
- `SuggestionStatus`: `PENDING`, `ACCEPTED`, `REJECTED`, `IGNORED`
- `ReportType`: `ANALYSIS`, `REPORT`

## Rules

- AI writes go only to `PreferenceItem` (new items), `AISuggestion`, `AIReport`, and `AIRequestLog`. **Never to `UserPreference`.**
- Deleting a `User` cascades to all of their data (the "delete my data" feature).
