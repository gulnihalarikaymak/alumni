# CLAUDE.md

Alumni Tracking System (ATS): a course project for Web Programming (YBSB3001), built one topic per week.
The student owns the intent, the architecture and every bug. You write code she must be able to explain in class.

## Stack

- `backend/`: NestJS 10, TypeScript, Express, Handlebars (`hbs`) views, Swagger. Data is **in memory** until week 5.
- `db`: PostgreSQL 18 in Docker (not used by the code yet). Prisma arrives in week 5.
- `frontend/`: empty until week 10. Do not add a front end before then.

## Commands

```bash
docker compose up --build                 # whole system; must always work on main
docker compose logs -f backend
cd backend && npm run build               # type check + compile; run after every change
curl http://localhost:3000/api/health     # smoke test
```

There are no automated tests or linter yet. Verify by building and by calling the changed routes
(curl, or the Postman collection in `postman/`). Report what you ran and what came back.

## Architecture rules (do not break)

- **Controller → service → model.** Never the other way.
  - Controller: route, verb, status code only. One service call per method. No validation, no storage.
  - Service: all business rules and HTTP errors (`BadRequestException`, `NotFoundException`, `ConflictException`).
  - Model (`*.model.ts`): data shape + CRUD only. No HTTP, no validation. Returns `undefined`/`false` for "not found".
- **One folder per feature** (`src/users/`, later `src/events/` …) with `*.module.ts`, `*.controller.ts`,
  `api-*.controller.ts`, `*.service.ts`, `*.model.ts`, `*.dto.ts`.
- **Web and API controllers share one service.** A rule is written once.
- **All URL prefixes live in `src/app.routes.ts`.** No global prefix. Controllers declare only the rest of the path.
- **Views** (`backend/views/**/*.hbs`) only format. Use `{{ }}` (escaped); never `{{{ }}}` except `body` in the layout.
- Forms send `PUT/PATCH/DELETE` via `?_method=`; never let a `GET` change data.
- Status codes: `201` create, `204` delete, `400` invalid, `404` missing, `409` conflict.

## How to work

- **Stay inside the week's topic.** Do not pull in later-week tech (Prisma, auth, class-validator, React …)
  unless the task asks for it. If a task seems to need it, say so and ask.
- **Small diffs.** Change only what the task needs. No drive-by refactors, renames or formatting of untouched files.
- **No new dependency** without saying why and asking first.
- **Explain non-obvious code** in 2–3 sentences after the change, so it can be defended in class.
- If a request is ambiguous, ask one short question instead of guessing.
- Never commit `.env`, real personal data, or secrets. Demo data is synthetic.

## Task tracking (TODO.md)

Tasks are given live in class, e.g. "5. haftadayız, task 1: ...".

1. Add each task to `TODO.md` under `## Week NN — <topic>` as `- [ ] <short task, in English>`.
   Create the heading if missing (topics are in the README roadmap). Keep the given order.
2. Do the task, build, verify (see Commands).
3. Tick it (`- [x]`) **in the same commit** as the code. Never tick a task whose code is not in that commit.
4. When every task of a week is ticked: add ✅ to the week heading in `TODO.md` and set the week to ✅
   in the README roadmap, in the same commit.

## Commits

- One task = one commit, Conventional Commits with the module as scope:
  `feat(users): add PATCH /api/users/:id`, `fix(users): return 409 on duplicate e-mail`, `docs(readme): ...`.
- Only commit after `npm run build` passes and the changed routes were exercised.
- If behaviour described in README.md changes (routes, run steps, status), update README in the same commit.
  Keep README short: no new long sections, no diagrams unless asked.
- Do not push unless asked.
