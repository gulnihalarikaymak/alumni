> Historical Gate-A design. The current design is documented in [DESIGN.md](../../../DESIGN.md).

# DESIGN.md

How the Alumni Tracking System looks. Read by people and by the AI assistant before any page is built in
`frontend/`. The intent behind it (name, voice, colour meaning) is in [BRAND.md](BRAND.md).

**Concept "Gate-A": night â†’ gate â†’ day.** The site opens at night in front of Istanbul University's historic
main gate in BeyazÄ±t. The gate draws itself, the visitor scrolls through its lit arch, and arrives in the warm
daylight of the campus, where the actual system lives. The footer returns to night.

- **References** (from [styles.refero.design](https://styles.refero.design), the DESIGN.md collection the course
  points to, like [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)):
  - **Apollo** (apolloworkspace.com): warm linen canvas, espresso instead of black, a thin display serif,
    uppercase labels with wide tracking, hairline rules, one rationed terracotta accent. â†’ the **day**.
  - **basement.studio**: a pitch-black opening, one accent used as a signal, zero radius, collapsed-border
    grids, one sans-serif for all UI. â†’ the **night** and the **grids**.
  - Where ATS differs from both is listed in Â§11.
- **Photo:** "Ä°stanbul Ãœniversitesi (54510564100).jpg" by Jorge Franganillo,
  [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via Wikimedia Commons. Credited on the page.
- **Figma:** [ATS â€“ Alumni Tracking System](https://www.figma.com/design/PFlMDz2nPbM2YKGVzAFraa), page
  "Home â€“ Gate concept (A)": variables "ATS tokens", mode `Gate-A`, and the components named below.
  Working prototype: [ATS â€“ Gate concept v2 (Make)](https://www.figma.com/make/47X7D1RMyvkJGkJPwjOHKn).
- **Code:** the week 8 prototype of the home page is [`frontend/prototype/`](index.html).

## 1. Visual theme and atmosphere

A printed membership brochure for a university, read at golden hour; entered at night.

- **Night (intro only):** absolute black, a real night photo of the gate, cream line drawing on top.
- **Day (everything else):** linen canvas, espresso text and nav, hairline grey rules, no shadows, square corners.
- **One accent**, terracotta, rationed to the main action and the active page.
- **Type contrast** carries the hierarchy: a thin, large serif against small, tracked, uppercase sans labels.

## 2. Colour palette and roles

Token names are the Figma variable names; in CSS they are custom properties (`color/page` â†’ `--page`).

| Token | Value | Role |
|---|---|---|
| `color/night` | `#000000` | Intro background only |
| `color/espresso` | `#3C261C` | Nav bar and footer surface |
| `color/on-night` | `#F9F8F0` | Text and line drawing on night and espresso |
| `color/on-night-muted` | `#B9AFA6` | Secondary text on night and espresso |
| `color/page` | `#F9F8F0` | Page background (linen). Never pure white. |
| `color/text` | `#3C261C` | Headings and body text on linen |
| `color/muted` | `#6E5A50` | Supporting text, metadata, numbers |
| `color/line` | `#DDDEDF` | Hairlines: grid borders, row dividers |
| `color/line-strong` | `#8A7B72` | Borders that must be seen: tags, form fields |
| `color/accent` | `#E97451` | Primary button fill, active nav item |
| `color/accent-ink` | `#A8482A` | Accent as text on linen (eyebrows, links) |
| `color/on-accent` | `#3C261C` | Text on `color/accent` |
| `--hover` | `#FCEDE8` | Hover surface of grid tiles (blush) |
| `color/success` | `#2F7A4D` | Status only: health dot, `ACTIVE` |

### 2.1 Contrast (WCAG 2.1 AA)

| Pair | Ratio | Needed |
|---|---|---|
| `text` on `page` | 13.3 : 1 | 4.5 |
| `muted` on `page` | 6.1 : 1 | 4.5 |
| `accent-ink` on `page` | 5.4 : 1 | 4.5 |
| `on-accent` on `accent` (primary button) | 4.8 : 1 | 4.5 |
| `on-night` on `espresso` | 13.3 : 1 | 4.5 |
| `on-night-muted` on `espresso` | 6.6 : 1 | 4.5 |
| `accent` on `espresso` (active nav item) | 4.8 : 1 | 4.5 |
| `line-strong` on `page` (tag border) | 3.8 : 1 | 3 |

`color/accent` as text on linen is only about 2.6 : 1, so it is **never** used as text on light backgrounds;
`color/accent-ink` is. White on terracotta is 3 : 1, so the primary button uses espresso text.

## 3. Typography

| Role | Font | Size / line height | Weight | Letter spacing |
|---|---|---|---|---|
| Display (hero, one per page) | Cormorant Garamond | 44â€“76 px (fluid) / 0.98 | Light 300, *italic* for one phrase | âˆ’1 % |
| Welcome (intro) | Cormorant Garamond | 48â€“88 px / 1 | Light 300 | 0 |
| Footer sign-off | Cormorant Garamond | 32â€“44 px / 1.05 | Light 300 | 0 |
| Section title | Geist | 30â€“38 px / 1.05 | SemiBold 600 | âˆ’3 % |
| Tile title | Geist | 24 / 1.2 | SemiBold 600 | âˆ’2 % |
| List heading | Geist | 20 / 1.3 | SemiBold 600 | âˆ’2 % |
| Lead | Geist | 18 / 1.55 | Regular 400 | 0 |
| Body, row title | Geist | 16 / 1.4â€“1.55 | Regular 400 / Medium 500 | 0 |
| Meta, description | Geist | 14â€“15 / 1.45â€“1.5 | Regular 400 | 0 |
| Eyebrow | Geist, UPPER CASE | 12 / 1.4 | SemiBold 600 | +12 % |
| Nav link, button, link | Geist, UPPER CASE | 12 / 1.4 | Medium 500 | +8â€“10 % |
| Tag | Geist, UPPER CASE | 11 / 1.4 | Medium 500 | +8 % |

Both are free Google Fonts. Upper case is applied with CSS (`text-transform`), never typed in the source.

## 4. Component stylings

| Component (Figma) | Style |
|---|---|
| **Button / Primary** | `accent` fill and border, `on-accent` text, padding 12 Ã— 24, radius 0. Hover: espresso fill, linen text. One per view. |
| **Button / Outline** | 1 px `text` border, no fill. Hover: espresso fill, linen text. |
| **Button / Outline on dark** | 1 px `on-night` border and text, on night or espresso. |
| **Nav (night)** | Transparent over the intro: wordmark, links in `on-night-muted`, active link in `accent`. Fades out on scroll. |
| **Nav (day)** | Sticky espresso bar: gate mark + wordmark, links, outline-on-dark button. Active link: `accent` text with a 1 px `accent` underline. |
| **Area tile** | Cell of a collapsed-border grid (the grid draws top/left lines, each tile right/bottom). Padding 32, min height 248. Number, title, description; link at the bottom. Hover: `--hover` surface. |
| **List row** | Padding 20 vertical, 1 px `line` divider below; optional lead column (date, 64 px), title over meta, optional **Tag**. The list starts with a 1 px `text` rule. |
| **Tag** | 1 px `line-strong` border, no fill, 11 px uppercase, padding 4 Ã— 8, radius 0. |
| **Gate / line drawing v2 (traced)** | The gate, traced in the photo's own 960 Ã— 640 coordinates, single stroke (1.2â€“1.5 px, non-scaling), no fills. |
| **Gate / mark** | 32 px simplified gate (central arch and two towers) for the nav. |
| **Footer** | Espresso: serif sign-off, uppercase links, the gate drawing in cream; a thin rule; course line, photo credit, status dot. |

## 5. Layout principles

- **Container:** 1200 px max, side gutter `max(24px, (100% âˆ’ 1200px) / 2)`.
- **Spacing:** multiples of 4: 4 Â· 8 Â· 12 Â· 16 Â· 20 Â· 24 Â· 28 Â· 32 Â· 40 Â· 48 Â· 56 Â· 64 Â· 80 Â· 96 Â· 112.
- **Rhythm:** hero 112 top and bottom; sections 96 apart; the last section 112 above the footer.
- **Grids:** area tiles 4-up with collapsed borders; lists side by side with 48 gap.
- **Radius:** 0 everywhere. **Shadows:** none; separation comes from hairlines and the espresso/linen contrast.

## 6. Depth and elevation

Flat. Depth exists only in the intro, where it is real: the photo, and the movement through the arch.

## 7. Motion (the intro)

| Step | When | What happens |
|---|---|---|
| 1. Draw | on load, ~1.5 s | Each stroke of the gate draws itself (stroke-dashoffset), left to right in drawing order. |
| 2. Light up | from 1.6 s, ~2 s | The night photo fades in under the lines; the lines step back to 38 % opacity. |
| 3. Enter | scroll 0â€“78 % of the intro | The photo and lines scale up around the centre of the main arch (ease-in). Nav, place label and hint fade out in the first 14 %. |
| 4. Daylight | scroll 20â€“72 % | The arch fills with linen light, then the whole screen does. |
| 5. Welcome | scroll 66â€“99 % | "Welcome back." rises 16 px and fades in, then out; the day page follows. |

- The intro is 340 vh tall with a sticky 100 vh stage; nothing else on the site animates beyond hover colours.
- **Reduced motion:** with `prefers-reduced-motion: reduce` the intro is one still screen (photo and drawing), no zoom.
- **Keyboard:** a "Skip the intro" link is the first focusable element.
- Only the home page has the intro; the other pages start in daylight.

## 8. Do's and don'ts

**Do**
- Use `accent` only for the main action and the active page; use `accent-ink` for accent-coloured text on linen.
- Keep pages on linen and structure on espresso; reserve black for the intro.
- Use the collapsed-border grid and the list row for collections; keep radius 0.
- Credit every photo next to it (author, licence, link).

**Don't**
- Add a second accent colour, gradients, shadows or rounded corners.
- Put `accent` text on linen, or white text on `accent`.
- Animate anything else the way the intro does; it is the one moment of ceremony.
- Use photos without a licence that allows it.

## 9. Responsive behaviour

| Width | Layout |
|---|---|
| â‰¥ 1080 px | As designed: hero text and drawing side by side, tiles 4-up, lists side by side |
| 761 â€“ 1079 px | Hero stacked (drawing below), tiles 2-up |
| â‰¤ 760 px | Nav links in a horizontally scrolling row (intro nav hides its links); tiles and lists 1 column; buttons full width |
| height â‰¤ 600 px | The place label of the intro is hidden |

## 10. Agent prompt guide

1. Use the tokens of Â§2 through CSS custom properties; never hard-code a colour, size or radius in a page.
2. Reuse the components of Â§4; add a new one only when none fits, and add it here and in Figma in the same change.
3. Cormorant Garamond Light only for display text (Â§3); Geist for everything else.
4. Copy follows [BRAND.md](BRAND.md#4-voice-and-copy-rules).
5. Check Â§2.1 contrast, Â§7 reduced motion and Â§9 at 360 px before calling a page done.

## 11. Where ATS differs from the references

| Topic | Apollo | basement.studio | ATS |
|---|---|---|---|
| Canvas | Warm linen | Absolute black | Black only for the intro, linen for the system |
| Accent | Terracotta, borders only | Ember orange, active nav only | Terracotta for the primary action fill and the active page; darker `accent-ink` for text |
| Display type | paradigm-pro 300 (paid) | Geist 600, 87 px | Cormorant Garamond Light (free) |
| UI type | MonaSans | Geist | Geist |
| Radius | 3 px | 0 | 0 |
| Imagery | Lifestyle photography | Project imagery, logo grid | One real photo of the gate + its line drawing |
| Spacing | Measured values (17, 23, 45 â€¦) | 4 px base | 4 px base (Â§5) |
