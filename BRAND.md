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

**Academic, warm, calm.** It feels like a well-kept university notice board, not a social network and not
a sales page.

| We are | We are not |
|---|---|
| Clear and plain | Clever or full of slogans |
| Warm and personal ("Stay connected with ...") | Corporate ("Leverage our alumni synergies") |
| Calm: one accent colour, a lot of white space | Loud: gradients, many colours, animations |
| Trustworthy: real data, exact status | Vague: "something went wrong" with no next step |

## 4. Voice and copy rules

- Interface language: **English**. Sentence case for headings and buttons ("Read announcements", not "Read Announcements").
- Buttons start with a verb and say what happens: **Browse open positions**, **Save posting**, **Delete user**.
- Link text names the destination: "All announcements →", never "click here".
- Error messages give the reason and the next step: "This e-mail is already used. Sign in or use another e-mail."
- Status values from the database are shown as written in the API (`PENDING`, `ACTIVE` ...) only inside badges;
  in sentences they are written in plain words ("waiting for approval").
- Dates: `18 Nov 2026` (day, short month, year). Times: 24-hour, `14:30`.
- Navigation names are fixed: **Announcements · Jobs · Applications · Users**. "Jobs" is the menu word for
  job postings; the code and the API keep `job-postings`.

## 5. Logo

- The mark is a capital **A** in the heading serif, white on the accent colour, in a rounded square
  (`radius/sm`), 34 × 34 px in the header. Next to it: "Alumni Tracking System" over "Istanbul University".
- The official Istanbul University logo and seal are **not** used: this is a course project, not an official
  university service.

## 6. Colour meaning

| Colour | Meaning | Rule |
|---|---|---|
| Academic blue `#2B5C8A` | "Do this": the main action, links, focus | One structural accent only. Never for decoration. |
| Paper `#FBFAF8` and white | Calm background, cards on top of it | Pages are never pure white; cards are. |
| Ink `#2F2D29` | Text | Near-black, warm, not `#000`. |
| Green `#2F7A4D` | Something works or is approved | Only for status (health dot, `ACTIVE`), never for buttons. |

Exact values, dark mode and contrast checks are in [DESIGN.md](DESIGN.md#2-colour-palette-and-roles).

## 7. Type character

A **serif** for headings (Source Serif 4) gives the academic, editorial tone; a **sans-serif** for everything
else (Inter) keeps forms, tables and lists easy to read. Both are free Google Fonts.

## 8. Imagery

- No stock photos of smiling people in suits. If photos are used later (events, profiles), they are real or
  clearly marked as demo images.
- Icons: simple line icons, one weight, in the text colour.
- All demo data (names, companies, e-mails) is synthetic.
