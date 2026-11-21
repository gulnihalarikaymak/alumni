// ATS · Gate-A prototype v2: the Beyazıt gate drawn over a night photo, and the scroll intro.
//
// The drawing uses the photo's own coordinate space (960 x 640), so it lies exactly on the photo.
// Photo: "İstanbul Üniversitesi (54510564100).jpg" by Jorge Franganillo, CC BY 2.0, Wikimedia Commons.

// ---------- The gate drawing (traced from the photo's proportions) ----------
function buildGatePaths() {
  const out = [];
  const P = (d) => out.push(d);
  const R = (v) => Math.round(v * 10) / 10;
  const line = (x1, y1, x2, y2) => P(`M${R(x1)} ${R(y1)} L${R(x2)} ${R(y2)}`);
  const hl = (x1, x2, y) => P(`M${x1} ${y} H${x2}`);
  const vl = (x, y1, y2) => P(`M${x} ${y1} V${y2}`);
  const rect = (x, y, w, h) => P(`M${x} ${y} H${x + w} V${y + h} H${x} Z`);
  const round = (cx, s, r, b) => P(`M${cx - r} ${b} V${s} A${r} ${r} 0 0 1 ${cx + r} ${s} V${b}`);
  const pointed = (x1, x2, s, b) => {
    const w = x2 - x1, r = R(0.75 * w), apex = R(s - 0.707 * w), mid = (x1 + x2) / 2;
    P(`M${x1} ${b} V${s} A${r} ${r} 0 0 1 ${mid} ${apex} A${r} ${r} 0 0 1 ${x2} ${s} V${b}`);
  };
  const circle = (cx, cy, r) => P(`M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy}`);
  const lattice = (x, y, w, h, step) => {
    for (let k = -h + step / 2; k < w; k += step) {
      let x1 = x + k, y1 = y + h, x2 = x + k + h, y2 = y;
      if (x1 < x) { y1 -= x - x1; x1 = x; }
      if (x2 > x + w) { y2 += x2 - (x + w); x2 = x + w; }
      if (x2 > x1) line(x1, y1, x2, y2);
      let a1 = x + k, b1 = y, a2 = x + k + h, b2 = y + h;
      if (a1 < x) { b1 += x - a1; a1 = x; }
      if (a2 > x + w) { b2 -= a2 - (x + w); a2 = x + w; }
      if (a2 > a1) line(a1, b1, a2, b2);
    }
  };
  const stripes = (cx, s, r1, r2, step) => {
    for (let a = 180 + step; a < 360; a += step) {
      const t = (a * Math.PI) / 180;
      line(cx + r1 * Math.cos(t), s + r1 * Math.sin(t), cx + r2 * Math.cos(t), s + r2 * Math.sin(t));
    }
  };
  const bars = (x1, x2, top, bottom, step) => { for (let x = x1 + step; x < x2; x += step) vl(x, top, bottom); };

  // Central block: crest, medallion, friezes, inscription panels, lattice panels
  vl(299, 94, 468); vl(661, 94, 468);
  rect(294, 88, 372, 6);
  P("M420 88 V64 H434 V56 H446 V64 H462 V54 H472 L476 46 L480 41 L484 46 L488 54 H498 V64 H514 V56 H526 V64 H540 V88");
  P("M459 106 A21 13 0 1 0 501 106 A21 13 0 1 0 459 106");
  P("M465 106 A15 8 0 1 0 495 106 A15 8 0 1 0 465 106");
  hl(299, 661, 124);
  for (let x = 303; x + 10 <= 657; x += 12) P(`M${x} 124 V129 A5 5 0 0 0 ${x + 10} 129 V124`);
  hl(299, 661, 138);
  hl(299, 661, 172);
  for (let x = 303; x <= 657; x += 6) vl(x, 172, 178);
  hl(299, 661, 178); hl(299, 661, 186);
  rect(330, 196, 56, 34); rect(334, 200, 48, 26);
  rect(402, 196, 156, 34); rect(406, 200, 148, 26);
  rect(574, 196, 56, 34); rect(578, 200, 48, 26);
  hl(299, 661, 238); hl(299, 661, 243);
  rect(332, 250, 54, 92); lattice(335, 253, 48, 86, 10);
  rect(574, 250, 54, 92); lattice(577, 253, 48, 86, 10);

  // Main arch: striped voussoirs, opening, recess, lamp, iron gate
  P("M402 352 V338 A78 78 0 0 1 558 338 V352");
  round(480, 338, 56, 468); stripes(480, 338, 56, 78, 12);
  P("M436 352 A44 44 0 0 1 524 352");
  vl(480, 282, 314); P("M474 322 Q474 314 480 314 Q486 314 486 322 Z");
  P("M424 404 Q480 372 536 404"); hl(424, 536, 414);
  for (let x = 432; x < 536; x += 8) { const t = (x - 424) / 112; vl(x, R(404 - 64 * t * (1 - t)), 468); }

  // Side openings of the central block
  for (const cx of [360, 600]) {
    round(cx, 372, 24, 468);
    P(`M${cx - 30} 380 V372 A30 30 0 0 1 ${cx + 30} 372 V380`);
    stripes(cx, 372, 24, 30, 20);
    hl(cx - 24, cx + 24, 412); bars(cx - 24, cx + 24, 412, 468, 8);
  }

  // Column pairs
  const column = (x1, x2, cap) => {
    rect(x1 - 2, cap, x2 - x1 + 4, 8); vl(x1 + 3, cap + 8, 460); vl(x2 - 3, cap + 8, 460); rect(x1 - 2, 460, x2 - x1 + 4, 8);
  };
  column(386, 400, 352); column(560, 574, 352); column(318, 332, 380); column(628, 642, 380);

  // Towers: the left one, and the right one as its mirror image
  const tower = (X) => {
    const span = (a, b) => [Math.min(X(a), X(b)), Math.max(X(a), X(b))];
    const H = (a, b, y) => { const [p1, p2] = span(a, b); hl(p1, p2, y); };
    P(`M${X(143)} 468 V230 H${X(299)}`);
    for (let x = 148; x + 10 <= 297; x += 17) { const [a, b] = span(x, x + 10); P(`M${a} 230 V220 H${b} V230`); }
    H(143, 299, 238);
    for (let x = 146; x + 10 <= 296; x += 12) { const [a, b] = span(x, x + 10); P(`M${a} 238 V244 A5 5 0 0 0 ${b} 244 V238`); }
    H(143, 299, 254); H(143, 299, 368);
    vl(X(190), 254, 468); vl(X(256), 254, 468);
    circle(X(223), 278, 12); circle(X(223), 278, 9);
    line(X(223), 278, X(223), 271); line(X(223), 278, X(228), 278);
    for (const [cx, w, s] of [[223, 20, 312], [282, 16, 318], [166, 12, 318]]) {
      const c = X(cx);
      P(`M${c - w / 2} 356 V${s} A${w / 2} ${w / 2} 0 0 1 ${c + w / 2} ${s} V356 Z`);
      hl(c - w / 2 - 3, c + w / 2 + 3, 360);
    }
    for (const [a, b, s] of [[199, 247, 412], [266, 298, 420], [152, 180, 420]]) { const [p1, p2] = span(a, b); pointed(p1, p2, s, 468); }
    const [g1, g2] = span(199, 247); hl(g1, g2, 432); bars(g1, g2, 432, 468, 6);
  };
  tower((x) => x);
  tower((x) => 960 - x);

  // Ground and steps
  hl(120, 840, 468); hl(300, 660, 476); hl(316, 644, 484);
  return out;
}

const GATE_PATHS = buildGatePaths();
const ARCH_LIGHT = "M424 468 V338 A56 56 0 0 1 536 338 V468 Z";
const pathsSvg = (list) => list.map((d) => `<path d="${d}"/>`).join("");

// Drawing only, cropped to the gate (hero and footer)
const drawingSvg = () =>
  `<svg class="gate" viewBox="120 36 720 452" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
  pathsSvg(GATE_PATHS) +
  `<text x="480" y="160" text-anchor="middle">T.C. İSTANBUL ÜNİVERSİTESİ</text></svg>`;

// Photo + light + drawing, covering the whole screen (intro)
const introSvg = () =>
  `<svg class="gate" viewBox="0 0 960 640" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
  `<image class="photo" href="gate-night.jpg" width="960" height="640" preserveAspectRatio="xMidYMid slice"/>` +
  `<path class="light" d="${ARCH_LIGHT}"/>` +
  `<g class="lines">${pathsSvg(GATE_PATHS)}</g></svg>`;

const MARK_SVG =
  `<svg class="gate" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
  pathsSvg(["M4 36 H36", "M7 36 V12 H12", "M33 36 V12 H28", "M12 36 V14 H28 V36", "M15.5 36 V25 A5 5 0 1 1 24.5 25 V36",
    "M6 12 C6 9 9.5 8.5 9.5 6 C9.5 8.5 13 9 13 12", "M27 12 C27 9 30.5 8.5 30.5 6 C30.5 8.5 34 9 34 12"]) + `</svg>`;

document.querySelectorAll("[data-gate]").forEach((el) => { el.innerHTML = el.dataset.gate === "intro" ? introSvg() : drawingSvg(); });
document.querySelectorAll("[data-mark]").forEach((el) => { el.innerHTML = MARK_SVG; });

// ---------- Intro ----------
const intro = document.getElementById("intro");
const wrap = intro.querySelector(".gate-wrap");
const shade = intro.querySelector(".shade");
const nightNav = intro.querySelector(".nav--night");
const place = intro.querySelector(".place");
const hint = intro.querySelector(".hint");
const welcome = intro.querySelector(".welcome");
const dawn = intro.querySelector(".dawn");
const credit = intro.querySelector(".credit");
const stage = intro.querySelector(".stage");
const light = wrap.querySelector(".light");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (v) => Math.min(1, Math.max(0, v));
const range = (p, from, to) => clamp((p - from) / (to - from)); // 0 before "from", 1 after "to"
const easeIn = (t) => t * t * t;

// Where the arch is on screen. The photo covers the screen like background-size: cover,
// so one photo unit is "s" screen pixels and the photo is centred.
let origin = { x: 0, y: 0 }, maxScale = 14, unit = 1;
function measure() {
  const vw = stage.clientWidth, vh = stage.clientHeight; // the stage, not the window: no scrollbar
  unit = Math.max(vw / 960, vh / 640);
  const ox = (vw - 960 * unit) / 2, oy = (vh - 640 * unit) / 2;
  origin = { x: ox + 480 * unit, y: oy + 400 * unit };
  wrap.style.transformOrigin = `${origin.x}px ${origin.y}px`;
  // Smallest zoom at which the inside of the arch (50 units each side, 70 up, 68 down) covers the screen
  maxScale = 1.08 * Math.max(origin.x / (50 * unit), (vw - origin.x) / (50 * unit), origin.y / (70 * unit), (vh - origin.y) / (68 * unit));
}

// 1. On load the lines draw themselves; then the photo comes up behind them (CSS, class "is-lit").
function drawOn() {
  const strokes = wrap.querySelectorAll(".lines path");
  strokes.forEach((s, i) => {
    const len = Math.ceil(s.getTotalLength() * unit * 1.15) + 4;
    s.style.strokeDasharray = len;
    s.style.strokeDashoffset = len;
    s.style.transition = `stroke-dashoffset 1.3s cubic-bezier(.6,.1,.2,1) ${0.15 + (i / strokes.length) * 1.4}s`;
  });
  requestAnimationFrame(() => requestAnimationFrame(() => strokes.forEach((s) => { s.style.strokeDashoffset = 0; })));
  setTimeout(() => intro.classList.add("is-lit"), 1600);
  // The dashes only serve the drawing; remove them so the lines stay solid while the gate grows.
  setTimeout(() => strokes.forEach((s) => { s.style.strokeDasharray = "none"; s.style.transition = "none"; }), 3200);
}

// 2. On scroll the gate grows around its arch, light fills the arch, "Welcome back." appears inside it.
function render() {
  const max = intro.offsetHeight - window.innerHeight;
  const p = max > 0 ? clamp(-intro.getBoundingClientRect().top / max) : 0;

  wrap.style.transform = `scale(${1 + (maxScale - 1) * easeIn(range(p, 0.04, 0.78))})`;

  const ui = 1 - range(p, 0.02, 0.14);
  for (const el of [nightNav, place, hint, shade]) el.style.opacity = ui;
  nightNav.style.visibility = ui === 0 ? "hidden" : "visible";

  light.style.opacity = range(p, 0.2, 0.55);
  dawn.style.opacity = range(p, 0.6, 0.72);        // the light takes the whole screen, whatever its shape
  credit.style.opacity = 1 - range(p, 0.55, 0.68); // the photo credit stays while the photo is visible

  const appear = range(p, 0.66, 0.78);
  welcome.style.opacity = appear * (1 - range(p, 0.92, 0.99));
  welcome.style.transform = `translateY(${(1 - appear) * 16}px)`;
}

measure();
if (reduceMotion) {
  intro.classList.add("is-static", "is-lit"); // one still screen: photo and drawing, no zoom
} else {
  drawOn();
  let queued = false;
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; render(); }); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { measure(); render(); });
  render();
}
