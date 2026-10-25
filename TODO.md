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

## Homework 1 — Announcements (no database) ✅
- [x] Create the Announcement model
- [x] Create 2 controllers (web pages + JSON API)
- [x] Create routes for both controllers
- [x] Create an interface to manage announcements

## Homework 2 — Job postings and applications UI ✅
- [x] Prepare a basic UI for job postings and applications, in the style of the existing pages
