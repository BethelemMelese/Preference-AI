# API Documentation

> **Status:** Planned. Endpoints are implemented from **Phase 3** (normal) and **Phase 4+** (AI). Each entry will get its request body, response shape, and error codes as it is built.

All endpoints accept and return JSON and identify the user via the guest-id cookie.

## Normal endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/categories` | List categories |
| GET | `/api/preferences` | List the user's decisions (filterable by category) |
| POST | `/api/preferences` | Record or change a decision (upsert) |
| PATCH | `/api/preferences/:id` | Edit decision or explanation |
| DELETE | `/api/preferences/:id` | Remove one decision |
| GET | `/api/suggestions` | List AI suggestions |
| PATCH | `/api/suggestions/:id` | Accept / reject / ignore a suggestion |
| GET | `/api/reports` | List reports |
| GET | `/api/reports/:id` | One report |
| GET | `/api/dashboard` | Dashboard totals |
| DELETE | `/api/me` | Delete all of the user's data |

## AI endpoints (rate-limited)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/ai/generate-items` | Generate new items for a category |
| POST | `/api/ai/suggestions` | Personalized suggestions from recorded preferences |
| POST | `/api/ai/analyze` | Short preference analysis |
| POST | `/api/ai/generate-report` | Full 9-section report (cached by input fingerprint) |

## Error format (planned)

```json
{ "error": { "code": "RATE_LIMITED", "message": "Too many AI requests. Try again in a few minutes." } }
```
