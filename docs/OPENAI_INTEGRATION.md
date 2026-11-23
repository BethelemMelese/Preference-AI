# OpenAI Integration

> **Status:** Starts in **Phase 4**. This document grows with each AI feature and should end up as a guide you could follow to add OpenAI to any other app.

## Planned sections

1. API fundamentals: REST, authentication, API keys, environment variables
2. The Responses API: client setup, request structure, reading the response, `usage`
3. Model selection and cost
4. Structured Outputs: JSON Schema, `responses.parse` + Zod, refusals, incomplete responses
5. Prompt design: the four prompts (item generation, suggestions, analysis, report) and how they were tested
6. Context management: building context from Postgres; `previous_response_id` and `store` explained
7. Reliability: validation, timeouts, retries, rate limits, duplicate prevention
8. Security: server-only keys, prompt-injection defenses for user-written text
9. Testing AI code with a mocked client

## Ground rules (decided in planning)

- All OpenAI calls run on the server; the key lives only in `OPENAI_API_KEY`.
- The model name lives in `OPENAI_MODEL`.
- Every call is logged to `AIRequestLog` (tokens, latency, outcome).
- AI output is validated with Zod before it is stored or shown.
- AI output never overwrites a user's recorded preference.
