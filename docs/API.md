# API reference

All responses are JSON except successful logout (204). Requests with bodies use application/json.
Cookie sessions are set by registration/login. Mutation requests must send Origin equal to CORS_ORIGIN.
Example local API clients should retain the Set-Cookie value and send it as Cookie on later requests.

| Method | Path | Body / purpose |
| --- | --- | --- |
| GET | /api/health | Database readiness; 200 or 503 |
| POST | /api/users/register | name (3–100), username (1–50), email, password (8+ characters, max 72 UTF-8 bytes) |
| POST | /api/users/login | email, password; sets session cookie |
| GET | /api/users/me | Current profile; requires session |
| POST | /api/users/logout | Clears cookie, 204 |

Validation errors return 400 with `errors: string[]`; duplicate registrations return 409.
Unauthenticated requests return 401. Rejected origins return 403. Rate limits return 429 with Retry-After seconds.
Internal failures return a generic 500 message without database details.

## Tasks (session required)

| Method | Path | Body / behavior |
| --- | --- | --- |
| GET | /api/tasks | Active tasks with stable board positions |
| GET | /api/tasks/archived | page 1–100000, limit 1–50, search up to 100 characters |
| GET | /api/tasks/:id | Owned task or 404 |
| POST | /api/tasks | title 1–50, content 1–300, priority Low/Medium/High; optional state |
| PUT | /api/tasks/:id | Partial allowed fields: title, content, priority, state |
| PATCH | /api/tasks/:id/state | state Pending/In Progress/Completed; optional numeric position |
| PATCH | /api/tasks/:id/archive | archived: true or false (actual boolean) |
| DELETE | /api/tasks/:id | Deletes the owned task |

Archive lists return { tasks, currentPage, totalPages, totalTasks }. Out-of-range pages are clamped to the last page.
Unknown query fields are rejected. Foreign users' task IDs return 404.
