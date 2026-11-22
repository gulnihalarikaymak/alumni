# CLAUDE.md

ATS is a Web Programming course project (YBSB3001). Keep each change small enough for the student to explain in class. Follow the shared project guide in [AGENTS.md](AGENTS.md), the [setup and API documentation](README.md), and the weekly assignments in [TODO.md](TODO.md).

## Architecture

- NestJS 10, TypeScript and Express serve the pages and JSON API. The frontend uses HTML, CSS and JavaScript in `backend/public/`. The landing is at `/`, and `/platform` and the resource pages share `workspace.html`.
- Browser forms send JSON to the same API used by Postman. Render user-provided values as text and preserve error feedback and keyboard navigation. See [DESIGN.md](DESIGN.md) and [BRAND.md](BRAND.md) for interface guidance.
- Keep NestJS JSON controllers focused on HTTP, services on validation and business rules, and models on Prisma storage. Each feature lives in its own folder under `backend/src/`. API prefixes are in `backend/src/app.routes.ts`.
- Prisma 7 models use the shared `PrismaService` to reach PostgreSQL 18. For a data model change, update the schema and [DDD.md](DDD.md) together and generate a new migration. Keep committed migrations intact.
- The API returns `201` on creation, `204` on deletion, `400` on invalid input, `404` for missing records and `409` for conflicts. Keep error handling and request logging in `backend/src/common/`. Return safe messages for server failures and keep error stacks in server logs.
- React and authentication are future coursework. Implement features within the assigned week's scope.

## Build and verification

Start the full stack with `docker compose up --build` from the repository root. Use the configured host port (3000 by default). For a local compile, run `npm ci`, `npx prisma generate` and `npm run build` from `backend/` on a fresh checkout.

Check the changed pages against PostgreSQL, including direct links, record reads, forms and API error responses. Use [postman](postman/) for API scenarios. Keep test records synthetic. Report what was verified. Logs are available with `docker compose logs -f backend` and in the ignored `backend/logs/error.logs` file.

## Coursework and delivery

- Track assignments in English under their week or homework heading in [TODO.md](TODO.md).
- Tick a task in the commit that completes it. When the week's assigned work closes, update the corresponding README roadmap entry.
- Keep changes scoped. Discuss new dependencies with the owner and update affected README diagrams and instructions when behavior changes.
- Use scoped Conventional Commits. Review the diff, exclude local configuration, personal data and credentials, and ask before pushing.
