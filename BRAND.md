# BRAND.md

Who the Alumni Tracking System is and how it speaks. [DESIGN.md](DESIGN.md) turns these decisions into colours,
type, spacing and components. When the two disagree, this file decides the intent and DESIGN.md is fixed.

## 1. Name

| Use | Form |
|---|---|
| Full name, first mention, page titles | **Alumni Tracking System** |
| Short name, after the first mention | **ATS** |
| Institution line under the name | Istanbul University |

The product name is never translated or abbreviated differently ("Alumni System", "AT-S" ...).

## 2. Who it is for

| Audience | What they come for |
|---|---|
| Alumni | News from the university, open positions, staying in touch |
| Students | Jobs and internships, mentors among the alumni |
| Staff and admins | Publishing announcements and postings, approving and managing users |

## 3. Personality

**Academic, warm, calm, with one moment of ceremony.** It feels like a printed university brochure, not a
social network and not a sales page. The one moment of ceremony is the way in: at night, through the
historic Beyazıt gate, into the warm light of the campus by day.

| We are | We are not |
|---|---|
| Clear and plain | Clever or full of slogans |
| Warm and personal ("Through this gate once. Part of it for life.") | Corporate ("Leverage our alumni synergies") |
| Calm: one accent colour, a lot of space, one meaningful animation (the gate) | Loud: gradients, many colours, effects everywhere |
| Trustworthy: real data, exact status | Vague: "something went wrong" with no next step |

## 4. Voice and copy rules

- Interface language: **English**. Sentence case for headings and buttons ("Read announcements", not "Read Announcements").
  The design may show small labels (nav, buttons, eyebrows) in capitals; that is done with CSS, the text stays in sentence case.
- Buttons start with a verb and say what happens: **Browse open positions**, **Save posting**, **Delete user**.
- Link text names the destination: "All announcements →", never "click here".
- Error messages give the reason and the next step: "This e-mail is already used. Sign in or use another e-mail."
- Status values from the database are shown as written in the API (`PENDING`, `ACTIVE` ...) only inside badges;
  in sentences they are written in plain words ("waiting for approval").
- Dates: `18 Nov 2026` (day, short month, year). Times: 24-hour, `14:30`.
- Navigation names are fixed: **Announcements · Jobs · Applications · Users**. "Jobs" is the menu word for
  job postings; the code and the API keep `job-postings`.

## 5. Logo

- **The gate is the brand.** The full mark is a single-weight line drawing of Istanbul University's main gate
  in Beyazıt (the Seraskerat gate), traced from a photo. The small mark (32 px, in the nav) keeps only the
  central arch and two towers.
- Next to the mark: "Alumni Tracking System" in the sans-serif. The drawing is cream on dark and espresso on light.
- The official university logo may be used where it helps (for example next to the ATS mark).

## 6. Colour meaning

| Colour | Meaning | Rule |
|---|---|---|
| Night `#000000` | The way in: the intro before the gate | Only in the intro. |
| Espresso `#3C261C` | Structure: text, the nav bar, the footer | Replaces black everywhere after the intro. |
| Linen `#F9F8F0` | Daylight: the page itself | Pages are never pure white. |
| Terracotta `#E97451` | "Do this": the main action, the active page | One accent only. Never as a large surface. As text on linen it is too light: use the darker `#A8482A`. |
| Green `#2F7A4D` | Something works or is approved | Only for status (health dot, `ACTIVE`), never for buttons. |

Exact values and contrast checks are in [DESIGN.md](DESIGN.md#2-colour-palette-and-roles).

## 7. Type character

A **thin serif** for display headings (Cormorant Garamond Light) gives the engraved, editorial tone of a
printed brochure; one **sans-serif** for everything else (Geist) keeps nav, forms, tables and lists crisp.
Both are free Google Fonts.

## 8. Imagery

- Real photos of real places, with their licence and author named next to them. No stock photos of
  smiling people in suits.
- The intro uses a night photo of the gate: "İstanbul Üniversitesi (54510564100).jpg" by Jorge Franganillo,
  [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), from Wikimedia Commons.
- Line drawings: one stroke weight, no fills, in the text colour.
- All demo data (names, companies, e-mails) is synthetic.
