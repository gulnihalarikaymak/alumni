# Backend

NestJS (TypeScript) REST API with Prisma and PostgreSQL. The whole project is described in the
[main README](../README.md); the database design is in [DDD.md](../DDD.md).

Scaffolded in week 02 (routing). Structure follows Module → Controller → Service → Model.

## What is where

| Folder | Content |
|---|---|
| `src/<feature>/` | One folder per feature (`users`, `announcements`, `job-postings`, `job-applications`): module, web and API controllers, service, model, DTOs |
| `src/common/` | Shared helpers: views setup, method override, the request logger, the 404 and 5xx filters, the error log file, the redirect to `/404` |
| `src/not-found/` | `GET /404`, the generic "Page not found" page |
| `src/prisma/`, `src/database/` | The one database connection, and the demo data loaded into an empty database |
| `views/` | Handlebars templates (layout, partials, one folder per feature, `not-found.hbs`, `server-error.hbs`) |
| `prisma/` | `schema.prisma`, migrations, seed |
| `logs/` | `error.logs`, written by the app (git-ignored) |

## Errors and logging (week 7)

- Every request gets one terminal line: `10:20:30 POST /api/users 201 18 ms`.
- Every `404` has a reason; a browser is redirected to `/404`, the API gets JSON.
- A `5xx` is logged in full and answered with a fixed message.
- Every failed request (status `400` and above) is added to `logs/error.logs`.

Details and examples: [main README, "Errors and logging"](../README.md#errors-and-logging).

## Build

```bash
npm run build     # type check + compile; run after every change
```

Prisma client is generated code (git-ignored): after a fresh `npm ci` run `npx prisma generate` before building.
