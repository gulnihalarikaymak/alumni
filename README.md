# Alumni Tracking System (ATS)

A web system that helps a university stay in touch with its graduates: who they are, where they work, and how they can help the students who come after them.

| | |
|---|---|
| **Course** | Web Programming (YBSB3001), Istanbul University, Faculty of Economics, MIS, Fall 2026 |
| **Author** | [@gulnihalarikaymak](https://github.com/gulnihalarikaymak) |
| **Stack** | NestJS (TypeScript) · PostgreSQL + Prisma · React + Vite |
| **Run it with** | `docker compose up` |
| **AI assistant** | Claude Code |
| **Status** | Users CRUD (web pages + JSON API) in MVC, in memory. Database comes in week 5. |

## Contents

1. [What the system is](#1-what-the-system-is)
2. [Quick start](#2-quick-start)
3. [Stack and why](#3-stack-and-why)
4. [How the code is organised](#4-how-the-code-is-organised)
5. [Roadmap](#5-roadmap)
6. [Working with an AI assistant](#6-working-with-an-ai-assistant)
7. [Security and privacy](#7-security-and-privacy)
8. [Conventions](#8-conventions)
9. [Limitations](#9-limitations)
10. [Credits and license](#10-credits-and-license)

---

## 1. What the system is

Universities lose sight of their students at graduation: contact details go stale, career outcomes live in spreadsheets, and students who would gain from an alumnus's advice never meet one. ATS is one place for all of that.

| Role | What they can do *(planned)* |
|---|---|
| **Student** | Search the alumni directory, request mentorship, register for events |
| **Alumni** | Keep profile and career history current, choose who sees what, offer mentorship |
| **Staff** | Organise events, read aggregate reports on where graduates work |
| **Admin** | Approve sign-ups, manage accounts and roles |

Visitors who are not signed in see only aggregate figures, never an individual's profile.

**Scope.** The core (weeks 3–8) is alumni records, career and education history, a searchable directory and events. After the midterm come accounts and roles, access rules, mentorship, connections, notifications and reports. A map view, messaging, CSV import and e-mail are extras if time allows. Payments, a job board, mobile apps and integration with real university systems are out of scope.

---

## 2. Quick start

**Requirements:** Git and Docker with Compose v2. Nothing else: no local Node.js, PostgreSQL or `.env` file needed.

```bash
git clone https://github.com/gulnihalarikaymak/alumni.git
cd alumni
docker compose up
```

| Address | What it is |
|---|---|
| `http://localhost:3000/users` | Web pages: list, create, edit and delete users |
| `http://localhost:3000/api/users` | JSON API for the same users |
| `http://localhost:3000/api/swagger` | Interactive API docs |
| `http://localhost:3000/api/health` | Health check (JSON for curl, a status page in a browser) |

Only `db` (PostgreSQL) and `backend` (NestJS) run so far. The React front end joins in week 10 on port `8080`. A Postman collection covering every route, including error cases, is in `postman/`.

| Task | Command |
|---|---|
| Rebuild after code changes | `docker compose up --build` |
| Follow the API logs | `docker compose logs -f backend` |
| Stop, keep the data | `docker compose down` |
| Stop and **delete the database** | `docker compose down -v` |

Settings (database name, user, password, ports) have defaults in `docker-compose.yml`. To change one, copy `.env.example` to `.env`. If a port is taken, set `DB_PORT` or `BACKEND_PORT` there.

---

## 3. Stack and why

| Layer | Choice | Why | Weakness |
|---|---|---|---|
| Back end | TypeScript, Node.js, NestJS | One language with the front end. NestJS gives each weekly topic its own building block: controllers (routing), services (business rules), middleware, guards, pipes | CPU-heavy work blocks the single thread unless moved to a worker |
| Database | PostgreSQL 18 | The data is relational: people, degrees, careers, events, mentorships. Foreign keys, constraints and transactions do real work | Scaling writes across servers is hard; needs routine backups and maintenance |
| Data access | Prisma *(week 5)* | Readable schema, migrations as files in git, type-safe queries | Weak support for geospatial types |
| Front end | React, TypeScript, Vite *(week 10)* | A UI was already designed in the Web Design course (Figma → React) | A single-page app is worse for search engines; irrelevant for a signed-in app |
| Packaging | Docker Compose | Required by the course; same environment for everyone | Slow first build, memory-hungry on Windows/macOS |

Alternatives considered: ASP.NET Core (a second language to defend), Django (its admin would do the work I am supposed to build), Express (too unstructured), MySQL (weaker constraints), MongoDB (the data is relational).

---

## 4. How the code is organised

### MVC in NestJS

| Layer | Job | File in `backend/src/users/` |
|---|---|---|
| **Model** | The `User` type and in-memory CRUD: `create`, `findAll`, `findById`, `findByEmail`, `update`, `delete` | `user.model.ts` |
| **Service** | Business rules: validation, unique e-mail, new users start as `PENDING`, missing record → `404` | `users.service.ts` |
| **Controller** | HTTP only: route, verb, status code. One line per method, calling the service | `user.controller.ts` (pages), `api-user.controller.ts` (JSON) |
| **View** | Handlebars templates for the pages, DTO shapes for the JSON | `backend/views/users/*.hbs`, `user.dto.ts` |

The rule: **controller → service → model**, never the other way. Both controllers share one `UsersService`, so a user created through the API shows up on the web pages immediately, and the rules are written once. When the in-memory array is replaced by PostgreSQL in week 5, only `UserModel` changes.

### Routes

All URL prefixes live in one file, `backend/src/app.routes.ts`.

| CRUD | Web page (`/users`) | JSON API (`/api/users`) |
|---|---|---|
| List | `GET /users` | `GET /api/users` → `200` |
| Create | `GET /users/create` (form), `POST /users` | `POST /api/users` → `201` |
| Read one | `GET /users/:id` | `GET /api/users/:id` → `200` |
| Replace | `GET /users/:id/edit` (form), `PUT /users/:id` | `PUT /api/users/:id` → `200` |
| Update some fields | `PATCH /users/:id` | `PATCH /api/users/:id` → `200` |
| Delete | `DELETE /users/:id` | `DELETE /api/users/:id` → `204` |

Errors: invalid input → `400`, e-mail already used → `409`, unknown id → `404`. Pages show the form again with the messages; the API returns JSON.

HTML forms can only send `GET` and `POST`, so they post with `?_method=PUT|PATCH|DELETE`, and `src/common/method-override.ts` rewrites the method before routing. A `GET` is never rewritten.

### Folders

```
alumni/
├── docker-compose.yml       db + backend
├── .env.example             optional overrides
├── backend/
│   ├── views/               Handlebars templates (layout, partials, users/)
│   └── src/
│       ├── main.ts          bootstrap: views, method override, Swagger, port
│       ├── app.routes.ts    route map
│       ├── common/          shared helpers (views setup, method override)
│       ├── users/           model, service, controllers, DTOs, modules
│       └── health/          GET /api/health
├── frontend/                React app (week 10)
└── postman/                 request collection, including error cases
```

### Known gaps

- Validation is hand-written in the service; `class-validator` DTOs replace it.
- Data lives in memory and is lost on restart until week 5.
- `AppController` still holds the week 2 demo routes (`/hello`, `/sum/...`) with inline HTML; removed in week 10.

---

## 5. Roadmap

| Week | Topic | What ATS gets | Status |
|---|---|---|---|
| 01 | Project inception | Public repo, README, stack decisions | ✅ |
| 02 | Routing | NestJS project, route map, health route, `docker compose up` | ✅ |
| 03 | HTTP methods and CRUD | Users CRUD with correct verbs, status codes and validation | ✅ |
| 04 | MVC | Model, service and controller split; web pages and JSON API share one service | ✅ |
| 05 | Database and ORM | Prisma schema, first migration, synthetic seed data | 🗓️ |
| 06 | Database integration | CRUD on PostgreSQL, transactions, DB errors mapped to HTTP | 🗓️ |
| 07 | Relational data | Career and education history, event registrations, directory search and pagination | 🗓️ |
| 08 | **Midterm** | Core features running on PostgreSQL, documented and tested | 🗓️ |
| 09 | Middleware | Logging, request ids, security headers, rate limiting, one error format | 🗓️ |
| 10 | Front end | React app served by nginx; full stack from one command | 🗓️ |
| 11 | Auth | Sign-up with approval, sessions, role and ownership checks | 🗓️ |
| 12 | Service layers | Mentorship, connections, notifications, reports | 🗓️ |
| 13 | Deployment and CI/CD | GitHub Actions, production compose file, backups | 🗓️ |
| 14 | **Final** | A stranger can run and understand the system from this README | 🗓️ |

✅ done · 🚧 in progress · 🗓️ planned

The tasks given in class each week, and which are done, are tracked in [`TODO.md`](TODO.md).

---

## 6. Working with an AI assistant

I use **Claude Code**. The assistant writes syntax; the intent, the architecture and every bug are mine.

1. I decide what a change should do before prompting.
2. I read every diff. Code I cannot explain is not committed.
3. A route is tested (Postman or curl) before it is committed.
4. No secrets or real personal data go into prompts.
5. Commits are small and made when the work is done, never a bulk import of generated code.

---

## 7. Security and privacy

*(Mostly planned, weeks 9 and 11.)*

- **Deny by default.** Every route will check: signed in? right role? owner of this record?
- **Per-field visibility.** Alumni choose who sees each field: only themselves, their connections, or all signed-in users.
- **Passwords** hashed with argon2id; sessions in an `HttpOnly` cookie, revocable on the server.
- **Minimum data** (KVKK). No national ID, birth date, grades or home address. Location is city level only. Reports hide groups smaller than five.
- **No real data until week 11.** The API is open until authentication lands, so demo data is synthetic and `.env` is never committed.

---

## 8. Conventions

- **Commits:** small and frequent, Conventional Commits with the module as scope, e.g. `feat(users): add PATCH /api/users/:id`.
- **`main` always runs.** A week never ends with a broken `docker compose up`.
- **Code:** strict TypeScript, English identifiers, one folder per feature.
- **Migrations** are never edited once committed.
- A commit that changes behaviour updates this README in the same commit.

---

## 9. Limitations

- The instructor's core requirements will be merged into the scope once announced.
- No authentication before week 11.
- No connection to the university's real student systems or single sign-on.
- A student project, not an official Istanbul University system; uses no university data.

---

## 10. Credits and license

- **UI design:** made earlier in the Web Design course with Figma Make: [AlumniTrackingSystem](https://github.com/gulnihalarikaymak/AlumniTrackingSystem), prototype at [ats.figma.site](https://ats.figma.site/).
- **Open source:** NestJS, Prisma, PostgreSQL, React, Vite, each under its own license.
- **License:** [MIT](LICENSE).
