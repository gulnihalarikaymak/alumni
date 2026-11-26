# Beyond the Years design

The current ATS interface is served by NestJS. The public home at `/` uses
`backend/public/index.html`, `landing.css`, `landing.js`, `chapters.css` and
`chapters.js`. The workspace at `/platform` and resource pages share
`backend/public/workspace.html` and `workspace.css`. Browser JavaScript loads
records and submits changes through the JSON API.

## Visual direction

The landing follows four chapters of university life, graduation, professional
growth and lasting connection. Golden-hour photography, generous spacing and
editorial headings lead visitors into the working ATS pages.

| Token | Value | Use |
|---|---|---|
| Background | `#F4F1EB` | Warm ivory page |
| Surface | `#FFFFFF` | Light surface |
| Ink | `#15191E` | Main text |
| Muted | `#777E86` | Secondary decoration, verify contrast for text |
| Deep | `#101B2A` | Platform section and primary actions |
| Accent | `#9D4653` | Burgundy emphasis |
| Highlight | `#D8BDA2` | Champagne detail on dark backgrounds |
| Border | `rgba(21,25,30,0.12)` | Dividers |

Instrument Serif, including italic, is the display font. Inter is used for
navigation, body copy, forms and tables. Fonts and licenses are in
`backend/public/fonts/`. The landing (`landing.css`) and the workspace
(`workspace.css`) each define light and dark theme variables. The dark theme uses
midnight navy surfaces, ivory text and a light rose accent for readable links.

## Components and motion

- The landing and the workspace share one menu, with the same links in the same order:
  Home, Workspace, Opportunities, Announcements, Applications, About (by role). On the
  right a visitor sees Log in and Register (Register hidden on phones), an admin sees
  the burgundy Admin button, and everyone has the ☰ button at the far right. ☰ opens
  one panel (`account.js`): who is logged in, My account, the admin panel, the settings
  (language and theme as two-way switches) and Log out, or Log in and Register for a
  visitor. Each setting is saved once (`localStorage` keys `lang` and `theme`) and
  applies to every page; without a saved choice the page follows the browser's
  language and the system theme. Each header keeps its own look, but both use three
  columns (logo, centred menu, buttons), so the menu sits in the same place on every
  page and buttons that appear or change cannot move it. Below 1200px the menu links
  move into the ☰ panel. The panel closes with Esc (focus returns to ☰) or a click outside.
- The fixed landing navigation changes from light text over the photograph to
  dark text on an ivory surface.
- The hero uses word reveals, a photographic gallery, restrained scale motion
  and a desktop pointer light.
- GSAP ScrollTrigger pins the four chapters on suitable desktop viewports.
  Mobile and reduced-motion layouts show the chapters as readable articles.
- Community photography uses an asymmetrical layout. Feature links lead to
  existing user, job, announcement and application routes.
- The workspace shares its masthead, navigation, form controls, tables, badges
  and error presentation. Preserve the user's input when validation fails and
  keep the submitted action and its outcome clear to keyboard users.

Keep visible focus, meaningful alternative text and readable contrast.
Verify narrow screens, keyboard navigation and reduced motion after changes.
All content must remain accessible when decorative animation is unavailable.

## Assets and history

The current WebP photographs are AI-generated illustrations. They represent
university life without identifying actual graduates or achievements.
The mark in `emblem.svg` is a project illustration. See [BRAND.md](BRAND.md)
for naming and copy.

The week 8 home-page study explored the Beyazıt gate. The coursework record
in [TODO.md](TODO.md) describes that earlier design.
