# Frontend

The active interface runs in the NestJS application. Start the complete stack
using the [root README](../README.md#2-quick-start) and open the configured
application address. The default is http://localhost:3000. With
`BACKEND_PORT=3111` in the root `.env`, it is http://localhost:3111.

| Location | Purpose |
|---|---|
| [backend/public](../backend/public/) | Landing HTML, CSS, JavaScript, photographs, fonts and GSAP |
| [backend/views](../backend/views/) | Handlebars workspace, resource pages and shared layout |
| [archive/gate-a](archive/gate-a/) | Historical static prototype and original design documents |

The landing is served at `/`, and the workspace at `/platform`. Announcements,
users, jobs and applications require the running backend and PostgreSQL.
Opening an HTML file alone previews only its static content.

Current visual guidance is in [DESIGN.md](../DESIGN.md) and [BRAND.md](../BRAND.md).
React remains a week 10 roadmap item. The archived prototype preserves the
earlier coursework and its image attribution.
