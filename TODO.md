# TODO

Tasks given in class, week by week. A task is ticked (`[x]`) in the same commit that finishes it.
When every task of a week is ticked, the week is marked ✅ in the [README roadmap](README.md#6-roadmap).

## Week 01 — Project inception ✅
- [x] Public repository named `alumni`
- [x] README: what the system is, stack, how it runs
- [x] Back-end language and database chosen, with a reason and one weakness

## Week 02 — Routing ✅
- [x] NestJS project scaffold and `docker compose up` for `db` + `backend`
- [x] Demo routes: `/`, `/hello`, `/hello/:name`, `/sum/:a/:b`, `/about`
- [x] Health route: `GET /api/health`

## Week 03 — HTTP methods and CRUD ✅
- [x] Users CRUD: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` on `/api/users`
- [x] Correct status codes and error cases (`400`, `404`, `409`)
- [x] Swagger docs at `/api/swagger`
- [x] Postman collection

## Week 04 — MVC ✅
- [x] `UserModel` with in-memory CRUD functions
- [x] Service / controller split; web pages and JSON API share one service
- [x] Route map in `app.routes.ts`
- [x] Handlebars views for the user pages

## Week 05 — Database and ORM ✅
- [x] The forgetting test: create a user in Postman, run `docker compose down` then `up`, check if the user is still there
- [x] Data design documentation: collect the schema and tables in `DDD.md` and link it from the README
- [x] Update `docker-compose.yml` so the database data persists (named volume `alumni-db-data`)
- [x] Environment variables: `.env` is git-ignored, `.env.example` lists every variable with its default
- [x] Migration: Prisma schema for every table in `DDD.md` and the first migration, applied when the backend starts
- [x] Factory and seed: factories for every table and `npx prisma db seed` that adds synthetic demo data
- [x] CRUD on the database: users and announcements models use Prisma (PostgreSQL) instead of in-memory arrays

## Week 06 — Database integration ✅
- [x] Update `DDD.md`: add the job postings table (`job_postings`)
- [x] Migration: add `job_postings` to the Prisma schema and create its migration
- [x] `JobPostingModel` with Prisma CRUD
- [x] Define direct (`/api/job-postings/:id`) and nested (`/api/users/:userId/job-postings`) routes
  (the nested route was removed with the `users` → `job_postings` relation, see the last task)
- [x] Repeat steps 1–4 for job applications (`job_applications`):
  - [x] Update `DDD.md`: add the job applications table
  - [x] Migration: add `job_applications` to the Prisma schema and create its migration
  - [x] `JobApplicationModel` with Prisma CRUD and its relationships
  - [x] Define direct (`/api/job-applications/:id`) and nested routes (under a posting and under a user)
- [x] Seed the job postings table: `jobPostingFactory` and job postings in `npx prisma db seed`
- [x] Remove the `users` → `job_postings` relation; users reach postings only through `job_applications`

## Week 07 — Errors and logging ✅
- [x] Try invalid requests on Postman: error-case requests for announcements, job postings and job applications
- [x] Update `DDD.md` with the JobPosting rules: title required (max 120 characters), company required, city and description optional
- [x] Logger middleware: write one log line per request on the terminal, e.g. `10:20:30 POST /user 201 18 ms` (time, method, route, status, duration)
- [x] 404 Guardian: return every 404 error with a reason (JSON for the API, a "Page not found" page for browsers)
- [x] 5xx Guardian: catch every server error, log the details on the terminal and return a safe message (JSON for the API, a "Something went wrong" page for browsers)
- [x] Logs -> `logs/error.logs`: write every error response (4xx and 5xx) to this file, with the reason and, for a 5xx, the stack
- [x] Define a generic 404 page (`/404`) and redirect invalid web requests to it (unknown URL, missing record, bad id)
- [x] Update `README.md` and the other `.md` files with today's work

## Week 08 — Web design ✅
- [x] Create a temporary branch and design the home page on it
  (branch `temp/home-design`, pushed for review and never merged; the design comes from Figma "Home · Notion-style")
- [x] Return to the `main` branch
- [x] Create `BRAND.md` and link it from the README
- [x] Create `DESIGN.md` from a reference on styles.refero.design or github.com/VoltAgent/awesome-design-md
  (first based on the Notion entry of awesome-design-md; replaced by the "Gate-A" concept: Apollo and basement.studio from styles.refero.design)
- [x] Check that the README links to both `BRAND.md` and `DESIGN.md`
- [x] Deliver the week 8 home-page design prototype (Gate-A).
  The assignment called for redesigning the web pages one at a time. The
  midterm deliverable was the home-page study. Later work introduced the
  Beyond the Years landing and a JavaScript workspace using the JSON API.
  The React assignment remains on the week 10 roadmap.

## Week 09 — Middleware
- [x] Update `DDD.md` for users and their roles in the system

## Homework 1 — Announcements (no database) ✅
- [x] Create the Announcement model
- [x] Create 2 controllers (web pages + JSON API)
- [x] Create routes for both controllers
- [x] Create an interface to manage announcements

## Homework 2 — Job postings and applications UI ✅
- [x] Prepare a basic UI for job postings and applications, in the style of the existing pages

## Repository maintenance after week 08

These owner-requested improvements maintain the topics already implemented in weeks 2–8.

- [x] Fix host-port configuration and document one full-stack startup workflow.
- [x] Align the design, architecture and task documentation for the Beyond the Years delivery.
- [x] Place active public assets in `backend/public/`.
- [x] Install Docker dependencies from the lockfile with `npm ci`.
- [x] Document and verify basic navigation, CRUD, errors and persistence.

Verification on 21 November 2026 passed the NestJS build, Docker image build,
custom host port 3111, application routes and public assets, synthetic
announcement create/update/delete, 400 and 404 responses, persistence across
Compose down/up, and desktop/mobile browser navigation with reduced motion.

Dependency follow-up for separate review
- [ ] Review the existing dependency advisories reported by npm during Docker installation (18 in the production install, including 2 critical), and the Node engine warning from `@prisma/streams-local`.
