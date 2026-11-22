# Codex guide for the Alumni Tracking System

ATS is a Web Programming course project. Keep each change small enough for the student to explain in class. Read [README.md](README.md) for setup, API contracts and the roadmap, [TODO.md](TODO.md) for assigned coursework, and [DDD.md](DDD.md) before changing data relationships.

## Where to work

- NestJS serves the Beyond the Years home at `/` from `backend/public/`. Its images, fonts, GSAP and ScrollTrigger are local assets. Preserve keyboard navigation and the readable reduced-motion layout.
- The working ATS starts at `/platform`. NestJS serves `backend/public/workspace.html` for workspace pages. Its JavaScript reads and changes records through the same-origin JSON API. Keep public links and deep links on the existing web routes.
- Check the implemented page routes and JSON controllers before linking or describing a feature. React and authentication are separate roadmap items. A standalone static server can preview the landing. Use the running NestJS application for the workspace.
- API feature prefixes are in `backend/src/app.routes.ts`. Keep business rules in services, Prisma storage in models and shared HTTP error handling in `backend/src/common/`. Insert record values into the browser DOM as text.
- Keep committed migrations intact. When changing the data model, update the Prisma schema and DDD together and generate a new migration.

## Build and verify

From the repository root, `docker compose up --build` starts the normal stack on port 3000 with the default settings. Set BACKEND_PORT=3111 in the root .env to use port 3111. Compose maps that host port to the container's fixed port 3000. Check the configured port before sharing a link.

From `backend/` run `npm ci` on a fresh checkout, then `npx prisma generate` and `npm run build`. Exercise changed pages on the running NestJS application with PostgreSQL connected. Check `/api/health?format=json` and the affected web and JSON routes. Use the collections in `postman/` for API scenarios. Use only synthetic records for mutations.

For landing changes, check the gallery, chapter controls, mobile menu, reduced motion and links to database-backed pages. Report what was actually verified.

## Coursework and delivery

Track classroom tasks in English under their week or homework heading in TODO.md. Tick a task with the commit that completes it. Update the README roadmap when a week closes and update affected documentation when routes or startup steps change.

Use scoped Conventional Commits. Review the diff and exclude credentials, local configuration, logs and personal data. Ask the owner before pushing, and use the reviewed branch as the destination unless the owner specifies another.
