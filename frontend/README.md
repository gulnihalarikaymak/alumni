# Frontend

React + TypeScript single-page application (Vite, Tailwind, shadcn/ui).

The UI is based on a design I made earlier for the Web Design course with Figma Make:
https://github.com/gulnihalarikaymak/AlumniTrackingSystem

It is brought into this repository after cleanup (removing the Figma-specific imports and the
Supabase backend) and connected to this project's API in week 10.

## Week 8: home page prototype (`prototype/`)

A static prototype of the home page in the new design, **Gate-A** (see [DESIGN.md](../DESIGN.md)):
at night the Istanbul University gate draws itself over a photo, the visitor scrolls through its lit arch,
and arrives at the home page by day.

- Plain HTML, CSS and JavaScript: no build step, no packages. Open `prototype/index.html` in a browser.
- The content is synthetic demo data; the prototype does not call the API yet.
- `app.js` builds the gate drawing as SVG paths in the photo's own coordinates (960 × 640), so the lines
  lie on the photo, and drives the scroll intro. `styles.css` holds the tokens of DESIGN.md.
- Photo `gate-night.jpg`: "İstanbul Üniversitesi (54510564100).jpg" by Jorge Franganillo,
  [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via
  [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%C4%B0stanbul_%C3%9Cniversitesi_(54510564100).jpg),
  resized to 2400 × 1600.
- The same prototype runs in Figma Make: https://www.figma.com/make/47X7D1RMyvkJGkJPwjOHKn
