(() => {
  const hero = document.querySelector(".hero");
  const masthead = document.querySelector("#masthead");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const progress = document.querySelector(".page-progress");
  // The historical double-click preview can still open the real local ATS pages.
  if (location.protocol === "file:" || location.pathname.endsWith("/backend/public/index.html")) {
    for (const link of document.querySelectorAll('a[href^="/"]')) {
      link.href = new URL(link.getAttribute("href"), "http://localhost:3000").href;
    }
  }
  const frames = [
    { title: "The Beginning" },
    { title: "The Milestone", src: "media/milestone.webp", alt: "Graduates tossing their caps into the air" },
    { title: "The Journey Forward", src: "media/forward.webp", alt: "Two designers working on a model in an architecture studio" },
    { title: "The Connection", src: "media/connection.webp", alt: "Friends talking over tea around an outdoor table" },
  ];
  const gallery = document.querySelector("#gallery-cover");
  const cover = document.querySelector("#hero-cover");
  const frameControls = document.querySelector(".frame-controls");
  const frameNumber = document.querySelector(".frame-number b");
  const frameName = document.querySelector(".frame-name");
  const compact = matchMedia("(max-width: 1080px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const gsap = window.gsap;
  let frame = 0;
  let visibleFrame = 0;
  let frameRequest = 0;
  let displayTween;
  let previousLayer;
  let scrollFrame = 0;

  function setMenu(open, returnFocus = false) {
    masthead.classList.toggle("menu-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (returnFocus) menu.focus();
  }

  // Light / dark theme, shared with the workspace pages through localStorage "theme".
  const themeButton = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  function setThemeLabel() {
    themeButton.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  themeButton.hidden = false;
  setThemeLabel();
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    setThemeLabel();
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  });

  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });
  document.addEventListener("click", event => {
    if (!masthead.contains(event.target)) setMenu(false);
  });
  masthead.addEventListener("focusout", event => {
    if (event.relatedTarget && !masthead.contains(event.relatedTarget)) setMenu(false);
  });
  compact.addEventListener("change", () => setMenu(false));

  function updateScroll() {
    scrollFrame = 0;
    const y = window.scrollY;
    const headerHeight = masthead.offsetHeight;
    const atHome = y + headerHeight < hero.offsetHeight;
    masthead.classList.toggle("is-paper", !atHome);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? Math.max(0, Math.min(1, y / max)) : 0) + ")";
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener("resize", scheduleScroll);
  window.addEventListener("pageshow", scheduleScroll);
  window.addEventListener("load", scheduleScroll);
  updateScroll();

  async function changeFrame(step) {
    const request = ++frameRequest;
    frame = (frame + step + frames.length) % frames.length;
    const chosen = frames[frame];
    if (chosen.src) {
      const preload = new Image();
      preload.src = chosen.src;
      try { await preload.decode(); }
      catch { if (request === frameRequest) frame = visibleFrame; return; }
    }
    if (request !== frameRequest) return;
    displayTween?.kill();
    previousLayer?.remove();
    gallery.style.removeProperty("opacity");
    const animate = gsap && !reduced.matches;
    if (animate && !gallery.hidden) {
      previousLayer = new Image();
      previousLayer.src = gallery.src;
      previousLayer.alt = "";
      gallery.before(previousLayer);
    }
    const showGallery = Boolean(chosen.src);
    if (showGallery) {
      gallery.src = chosen.src;
      gallery.alt = chosen.alt;
    }
    gallery.hidden = !showGallery;
    cover.setAttribute("aria-hidden", String(showGallery));
    frameNumber.textContent = String(frame + 1).padStart(2, "0");
    frameName.textContent = chosen.title;
    visibleFrame = frame;
    if (animate) {
      const finish = () => previousLayer?.remove();
      if (showGallery) {
        displayTween = gsap.fromTo(gallery, { opacity: 0 }, { opacity: 1, duration: .48, clearProps: "opacity", onComplete: finish });
      } else if (previousLayer?.isConnected) {
        displayTween = gsap.to(previousLayer, { opacity: 0, duration: .48, onComplete: finish });
      }
    }
  }
  frameControls.hidden = false;
  frameControls.addEventListener("click", event => {
    const button = event.target.closest("[data-frame]");
    if (button) changeFrame(Number(button.dataset.frame));
  });

  if (!gsap) return;
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const photo = document.querySelector(".hero-photo");
    const visible = hero.getBoundingClientRect().bottom > 0;
    const breath = gsap.fromTo(photo, { scale: 1 }, {
      scale: 1.03, duration: 14, yoyo: true, repeat: -1, ease: "sine.inOut", paused: true, immediateRender: false
    });
    let inView = visible;
    let introDone = false;
    function playWhenVisible() {
      if (introDone) breath.paused(!inView || document.hidden);
    }
    const intro = gsap.timeline({ onComplete: () => { introDone = true; playWhenVisible(); } });
    if (visible) {
      intro.fromTo(photo, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "power2.out" }, 0)
        .from(".hero-kicker", { opacity: 0, y: 18, duration: .7 }, .15)
        .from(".hero .clip > *", { yPercent: 110, duration: .9, stagger: .08, ease: "expo.out" }, .3)
        .from([".hero-description", ".hero-actions", ".hero-foot"], { opacity: 0, y: 18, stagger: .12, duration: .7 }, .55);
    } else { introDone = true; }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      playWhenVisible();
    });
    observer.observe(hero);
    document.addEventListener("visibilitychange", playWhenVisible);
    if (window.ScrollTrigger) {
      gsap.from(".feature", {
        scrollTrigger: { trigger: ".feature-grid", start: "top 95%", once: true },
        y: 16, duration: .55, stagger: .07, ease: "power2.out"
      });
    }
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", playWhenVisible);
      displayTween?.kill();
      previousLayer?.remove();
      gallery.style.removeProperty("opacity");
    };
  });
  media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
    const light = document.querySelector(".light-field");
    let x = 0, y = 0, targetX = 0, targetY = 0, raf = 0;
    function follow() {
      raf = 0;
      x += (targetX - x) * .08;
      y += (targetY - y) * .08;
      light.style.transform = "translate3d(" + (x - 250) + "px," + (y - 250) + "px,0)";
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .35) raf = requestAnimationFrame(follow);
    }
    function move(event) {
      const rect = hero.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      if (!light.style.opacity) { x = targetX; y = targetY; }
      light.style.opacity = ".08";
      if (!raf) raf = requestAnimationFrame(follow);
    }
    function leave() {
      cancelAnimationFrame(raf);
      raf = 0;
      light.style.removeProperty("opacity");
    }
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      leave();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  });
  window.addEventListener("pagehide", e => {
    if (!e.persisted) { media.revert(); displayTween?.kill(); cancelAnimationFrame(scrollFrame); }
  });
})();
