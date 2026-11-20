# ATS İÜ frontend

The public home at `/` presents *Beyond the Years*, a photographic journey from campus life to the alumni network. The working frontend runs in the existing NestJS application. Its landing page uses plain HTML, CSS and JavaScript. The workspace and data pages use Handlebars and the existing controllers.

Start the stack using the [repository instructions](../README.md). Open [the landing page](http://localhost:3000/) or [the ATS workspace](http://localhost:3000/platform). The workspace links to live profiles, career opportunities, announcements and applications. Sign-in and self-registration are planned in the project's roadmap.

## Source

- [Landing page and local assets](../backend/views/landing/index.html)
- [Workspace layout](../backend/views/layout.hbs) and [shared workspace styles](../backend/views/landing/workspace.css)
- [Original Gate-A prototype](prototype/gate-a.html), retained for comparison

[The original prototype entry point](prototype/index.html) opens the new landing page for static preview. Links to data and workspace pages in this preview assume the local NestJS server is running on port 3000. Serving the landing through NestJS uses the application's own origin and port.

The WebP scenes are original AI-generated illustrations of university life. They do not identify actual graduates. Instrument Serif and Inter are self-hosted with licenses in the fonts directory. GSAP 3.13.0 and ScrollTrigger are vendored for local playback. The four chapters remain readable when JavaScript is disabled or the visitor requests reduced motion.
