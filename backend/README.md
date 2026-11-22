# Backend

NestJS serves the public landing, workspace pages and JSON API. Services apply the business rules and models access PostgreSQL through Prisma. The browser and Postman use the same API.

## Structure

| Folder | Contents |
|---|---|
| `public/` | Landing and workspace HTML, CSS, JavaScript, local fonts, photographs and GSAP |
| `src/<feature>/` | JSON controllers, services and models for users, announcements, job postings and job applications |
| `src/common/` | Shared HTTP helpers, request logging and the 404 and 5xx exception filters |
| `src/app.controller.ts` | Landing, workspace page routes, generic `/404` page and week 2 demos |
| `src/prisma/`, `src/database/` | Shared database connection and synthetic seed data |
| `prisma/` | Schema, committed migrations and seed entry point |
| `logs/` | Runtime error log, excluded from Git |

The landing starts at `/`. The workspace starts at `/platform`. API feature prefixes are in `src/app.routes.ts`. Swagger is at `/api/swagger`. Request `/api/health?format=json` for process liveness and an API collection such as `/api/announcements` to check data access.

## Browser entry points

| Source in [public](public/) | Purpose |
|---|---|
| [index.html](public/index.html), landing and chapter CSS/JS | Public landing with local photographs, fonts and animations |
| [workspace.html](public/workspace.html), `workspace.css` | Shared workspace navigation and layout |
| `workspace.js` | Selects the workspace page for the current browser URL |
| `workspace-records.js`, `workspace-applications.js` | Resource lists, detail pages, forms and application actions |
| `workspace-ui.js` | Shared request, form and DOM helpers |

Open `/users`, `/announcements`, `/job-postings` or `/job-applications` directly or through the workspace. A static preview can display the landing. Use the running NestJS application for workspace deep links and PostgreSQL-backed CRUD.

## Build and run

From this directory on a fresh host checkout:

```bash
npm ci
npx prisma generate
npm run build
```

For the complete system, run `docker compose up --build` from the repository root. The default host port is 3000. The root `.env` can override it with `BACKEND_PORT`. Follow the [quick start](../README.md#2-quick-start) and [delivery checks](../README.md#verify-a-delivery). See [DDD.md](../DDD.md) for the database design and [Errors and logging](../README.md#errors-and-logging) for error formats and log locations.
