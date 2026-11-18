# DESIGN.md

How the Alumni Tracking System looks. Read by people and by the AI assistant before any page is built in
`frontend/`. The intent behind it (name, voice, colour meaning) is in [BRAND.md](BRAND.md).

- **Reference:** the Notion entry of [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
  (MIT, an independent analysis of notion.so's public CSS, read at [getdesign.md/notion](https://getdesign.md/notion/design-md)).
  We took its structure and principles, not its brand: the colours, the heading font and the radii are ours (see §10).
- **Figma:** [ATS – Alumni Tracking System](https://www.figma.com/design/PFlMDz2nPbM2YKGVzAFraa), page
  "Home – style explorations", frame **Home · Notion-style ✓ chosen** (week 8). The variables of the
  "ATS tokens" collection, mode `Notion-style`, are the source of the values below.
- **Format:** the nine sections of the Stitch DESIGN.md format used by awesome-design-md.

## 1. Visual theme and atmosphere

A calm university notice board on warm paper.

- Off-white **paper canvas** with white cards on it; surfaces are separated by 1 px hairlines, not shadows.
- **One structural accent**, academic blue, only for the main action, links and focus.
- **Serif headings** for an editorial, academic tone; a neutral sans-serif for everything you read or fill in.
- Generous white space between sections; dense, tidy rows inside lists and tables.

## 2. Colour palette and roles

Token names are the Figma variable names; in code they become CSS custom properties (`color/page` → `--color-page`).

| Token | Light | Role |
|---|---|---|
| `color/page` | `#FBFAF8` | Page background (paper). Pages are never pure white. |
| `color/surface` | `#FFFFFF` | Cards, lists, form fields, secondary button |
| `color/text` | `#2F2D29` | Headings and body text |
| `color/muted` | `#6B675F` | Supporting text, metadata, nav links, footer |
| `color/line` | `#E6E2DA` | Hairlines: card borders, row dividers, header and footer rules |
| `color/line-strong` | `#8C877E` | Form field borders (needs 3:1 against white, see §2.1) |
| `color/accent` | `#2B5C8A` | Primary button fill, logo mark, focus ring |
| `color/accent-ink` | `#2B5C8A` | Links and accent text |
| `color/on-accent` | `#FFFFFF` | Text on `color/accent` |
| `color/accent-soft` | `#E8EEF5` | Tag and badge background |
| `color/success` | `#2F7A4D` | Status only: health dot, `ACTIVE` |

Status badges (`PENDING`, `ACTIVE`, `REJECTED`, `SUSPENDED` and the application statuses) get their own
soft-background / dark-text pairs when the Users and Applications pages are designed; they follow the
`accent-soft` / `accent-ink` pattern and each pair must pass §2.1.

**Dark mode:** not designed yet. It is planned (the Handlebars pages already had one) and gets its own
`Dark` mode on the same variables, so no component changes when it comes.

### 2.1 Contrast (WCAG 2.1 AA)

| Pair | Ratio | Needed |
|---|---|---|
| `text` on `page` | 13.2 : 1 | 4.5 |
| `muted` on `page` | 5.4 : 1 | 4.5 |
| `accent-ink` on `page` | 6.7 : 1 | 4.5 |
| `on-accent` on `accent` | 7.0 : 1 | 4.5 |
| `accent-ink` on `accent-soft` | 6.0 : 1 | 4.5 |
| `line-strong` on `surface` (field border) | 3.6 : 1 | 3 |
| `success` on `page` (status dot) | 5.0 : 1 | 3 |

`color/line` is decorative only (about 1.3 : 1); it never marks the edge of something you can type into or click.

## 3. Typography

Two free Google Fonts: **Source Serif 4** for headings, **Inter** for everything else.
Fallbacks: `Georgia, serif` and `system-ui, "Segoe UI", sans-serif`.

| Role | Font | Size / line height | Weight | Letter spacing |
|---|---|---|---|---|
| Display (hero, one per page) | Source Serif 4 | 58 / 108 % | SemiBold 600 | −1 % |
| Heading 2 (section) | Source Serif 4 | 30 / 125 % | SemiBold 600 | −0.5 % |
| Heading 3 (list or card group) | Source Serif 4 | 22 / 130 % | SemiBold 600 | 0 |
| Card title | Source Serif 4 | 19 / 130 % | SemiBold 600 | 0 |
| Lead (intro paragraph) | Inter | 18 / 155 % | Regular 400 | 0 |
| Body | Inter | 15 / 150 % | Regular 400 | 0 |
| Row title, nav, button | Inter | 15 or 14 / 140 % | Medium 500 | 0 |
| Small (meta, footer) | Inter | 13 / 140 % | Regular 400 | 0 |
| Eyebrow | Inter, UPPER CASE | 12 / 150 % | SemiBold 600 | +8 % |
| Tag | Inter | 12 / 140 % | Medium 500 | 0 |

Rules: body text is never bold; one display headline per page; lines of body text stay under ~70 characters.

## 4. Component stylings

These are the Figma components. Each becomes one React component with the same name.

| Component | Style |
|---|---|
| **Button / Primary** | `accent` fill, `on-accent` text, 14 px Medium, padding 8 × 16, `radius/md`. One per view. |
| **Button / Secondary** | `surface` fill, 1 px `line` border, `text` colour, same size. |
| **Feature card** | `surface`, 1 px `line`, `radius/lg`, padding 24, gap 8: card title, description (`muted`), link (`accent-ink`, ends with →). |
| **List row** | Padding 16 × 20, gap 16, 1 px `line` top divider (none on the first row); title (Medium 15) over meta (13 `muted`); a **Tag** on the right. Rows sit in a `surface` list with `line` border and `radius/lg`. |
| **Tag / badge** | `accent-soft` fill, `accent-ink` 12 px Medium, padding 4 × 8, `radius/full`. |
| **Header** | Logo mark + name on the left, nav (`muted`, Medium 14, gap 32) in the middle, secondary button on the right; padding 20 vertical; `line` rule below. |
| **Footer** | Small `muted` text on the left, status dot (`success`) + "All systems running" on the right; `line` rule above; padding 32 vertical. |
| **Text field** *(to design with the forms)* | `surface`, 1 px `line-strong`, `radius/sm`, padding 10 × 12, label above in Medium 14. Focus: 3 px `accent` outline. |

**States** (all interactive components): hover darkens the fill or underlines the link; focus shows a 3 px
`accent` outline with 2 px offset (never removed); disabled is 50 % opacity with no hover.

## 5. Layout principles

- **Spacing scale** (`space/*`): 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 96. No other values.
- **Container:** 1120 px content width, centred (160 px side padding on a 1440 px screen).
- **Vertical rhythm on the home page:** hero 96 top / 64 bottom; sections 64 apart; the last section 96 above the footer.
- **Grids:** feature cards 4-up with 16 gap; two lists side by side with 32 gap.
- Text-heavy blocks (hero, section headings) are left-aligned; nothing body-sized is centred.

## 6. Depth and elevation

- **Level 0 (default):** flat, 1 px `color/line` hairline. Cards, lists, header and footer use only this.
- **Level 1 (floating):** for menus, toasts and dialogs only: `0 4px 18px rgba(47,45,41,.06), 0 1px 3px rgba(47,45,41,.04)`.
- No heavy shadows, no gradients, no glass effects.

**Radii** (`radius/*`): `sm` 4 (logo mark, fields) · `md` 6 (buttons) · `lg` 10 (cards, lists) · `full` 999 (tags).

## 7. Do's and don'ts

**Do**
- Use `color/accent` only for the main action, links and focus.
- Keep the page on `color/page`; put content on white `color/surface` cards.
- Build every page from the components in §4 and the tokens in §2 to §6.
- Write every colour, space and radius as a token, never as a raw value.
- Show the reason and the next step in every error and empty state.

**Don't**
- Add a second accent colour or paint a button green, red or any colour except `accent`.
- Use `color/line` as a form field border (too light, see §2.1).
- Centre body text, or put two display headlines on one page.
- Use shadows on cards, or gradients anywhere.
- Use the official university logo or seal (see [BRAND.md](BRAND.md#5-logo)).

## 8. Responsive behaviour

| Width | Layout |
|---|---|
| ≥ 1080 px | As designed: 1120 container, cards 4-up, lists side by side |
| 768 – 1079 px | 32 px side padding; cards 2-up; lists side by side |
| ≤ 767 px | 16 px side padding; cards and lists stacked (1 column); nav collapses into a menu button; buttons full width; display headline 36 px |

Touch targets are at least 44 × 44 px on small screens. No page scrolls sideways at 360 px.
*The tablet and phone frames are not in Figma yet.*

## 9. Agent prompt guide

When building or changing a page in `frontend/`:

1. Use only the tokens of §2 to §6, through the CSS custom properties in one tokens file; never hard-code a colour, size or radius.
2. Reuse the components of §4 (`Button`, `FeatureCard`, `ListRow`, `Tag`, `Header`, `Footer`); add a new one only when no existing one fits, and add it to this file and to Figma in the same change.
3. Fonts: Source Serif 4 for headings, Inter for the rest; check the type table in §3.
4. Copy follows [BRAND.md](BRAND.md#4-voice-and-copy-rules): sentence case, verbs on buttons, dates as `18 Nov 2026`.
5. Check §2.1 contrast and §8 at 360 px before calling a page done.

## 10. Where we differ from the Notion reference

| Topic | Notion reference | ATS | Why |
|---|---|---|---|
| Accent | Notion blue `#0075de` | Academic blue `#2B5C8A` | Our own brand; calmer and more institutional |
| Canvas | `#f6f5f4` | `#FBFAF8` | A lighter paper so white cards still stand out |
| Headings | Inter, bold, tight tracking | Source Serif 4 SemiBold | Academic tone (BRAND.md §7) |
| Buttons | Pill (`9999px`) | `radius/md` 6 px | Fits forms and tables better than marketing pills |
| Decorative "sticker" colours | Six illustration colours | None | One accent keeps the admin screens calm |
| Dark hero band | Indigo band once per page | Not used | The home page is also the start page of a tool |
