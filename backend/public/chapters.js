/* GSAP enhances the native, linkable articles only when the viewport has room to pin them. */
(() => {
  const journey = document.querySelector('#journey');
  const { gsap, ScrollTrigger } = window;
  if (!journey || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  const scenes = Array.from(journey.querySelectorAll('.chapter'));
  const links = Array.from(journey.querySelectorAll('.journey__chapters a'));
  const controls = journey.querySelector('.journey__controls');
  const buttons = Array.from(controls.querySelectorAll('button'));
  const counter = controls.querySelector('b');
  const names = scenes.map(scene => scene.querySelector('.chapter__label').textContent.replace(/^\D*\d+\s*/, '').trim()); // drop "Chapter 01" / "Bölüm 01"
  const last = scenes.length - 1;
  let media;
  let loadChapter = () => {};

  function start() {
    media = gsap.matchMedia();
    media.add('(min-width: 821px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)', () => {
      journey.classList.add('journey--cinematic');
      controls.hidden = false;
      let active = -1;
      function setChapter(index) {
        if (index === active) return;
        active = index;
        counter.textContent = String(index + 1).padStart(2, '0');
        links.forEach((link, i) => {
          if (i === index) link.setAttribute('aria-current', 'step');
          else link.removeAttribute('aria-current');
        });
        buttons.forEach(button => {
          const direction = Number(button.dataset.chapterStep);
          const next = index + direction;
          button.disabled = next < 0 || next > last;
          const label = window.i18n.t(direction < 0 ? 'Previous chapter' : 'Next chapter');
          button.setAttribute('aria-label', names[next] ? label + ', ' + names[next] : label);
        });
      }
      const timeline = gsap.timeline({ defaults: { ease: 'power1.inOut' } });
      scenes.slice(1).forEach((scene, i) => {
        // A short hold before each dissolve leaves the previous image and its caption legible.
        const startTime = i + .32;
        const previous = scenes[i];
        timeline.fromTo(scene, { opacity: 0 }, { opacity: 1, duration: .65 }, startTime)
          .fromTo(scene.querySelector('.chapter__image'), {
            scale: i === 2 ? 1.12 : 1.06, xPercent: i === 1 ? 3 : 0
          }, { scale: 1, xPercent: 0, duration: .68 }, startTime)
          .to(previous.querySelector('.chapter__text'), { y: -14, opacity: 0, duration: .26 }, startTime)
          .fromTo(scene.querySelector('.chapter__text').children,
            { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: .055, duration: .32 }, startTime + .22);
        if (i === 0) {
          timeline.fromTo(previous.querySelector('.chapter__image'),
            { scale: 1.08, yPercent: 2 }, { scale: 1, yPercent: 0, duration: .95 }, 0)
            .fromTo(scene.querySelector('.chapter__image'), { '--chapter-wipe': '-10%' },
              { '--chapter-wipe': '115%', duration: .66 }, startTime);
        }
        const inset = scene.querySelector('.chapter__inset');
        if (inset) timeline.fromTo(inset, { xPercent: 32, rotation: 3, opacity: 0 },
          { xPercent: 0, rotation: 0, opacity: 1, duration: .62 }, startTime + .05);
      });

      timeline.eventCallback('onUpdate', () => setChapter(Math.min(last, Math.floor(timeline.time() + .35))));
      const trigger = ScrollTrigger.create({
        trigger: journey,
        start: 'top 76px',
        end: () => '+=' + Math.round(window.innerHeight * .8 * last),
        animation: timeline,
        pin: journey.querySelector('.journey__spread'),
        scrub: .45,
        invalidateOnRefresh: true
      });
      setChapter(0);

      function go(index, animate) {
        const fraction = index === last ? 1 : index / timeline.duration();
        const top = trigger.start + (trigger.end - trigger.start) * fraction;
        window.scrollTo({ top, behavior: animate ? 'smooth' : 'instant' });
      }
      function currentHash() {
        const index = scenes.findIndex(scene => '#' + scene.id === location.hash);
        if (index >= 0) go(index, false);
      }
      function navigate(event) {
        const link = event.target.closest('.journey__chapters a');
        const button = event.target.closest('[data-chapter-step]');
        if ((!link && !button) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const index = link ? links.indexOf(link) : active + Number(button.dataset.chapterStep);
        if (index < 0 || index > last) return;
        event.preventDefault();
        const hash = '#' + scenes[index].id;
        if (location.hash !== hash) history.pushState(null, '', hash);
        go(index, true);
      }
      journey.addEventListener('click', navigate);
      window.addEventListener('hashchange', currentHash);
      loadChapter = currentHash;
      if (document.readyState === 'complete') currentHash();

      return () => {
        loadChapter = () => {};
        journey.removeEventListener('click', navigate);
        window.removeEventListener('hashchange', currentHash);
        controls.hidden = true;
        journey.classList.remove('journey--cinematic');
        links.forEach(link => link.removeAttribute('aria-current'));
      };
    }, journey);
  }

  start();
  // Reload the deep-linked chapter after media and fonts have settled.
  window.addEventListener('load', () => { ScrollTrigger.refresh(); loadChapter(); }, { once: true });
  window.addEventListener('pagehide', () => media.revert());
  window.addEventListener('pageshow', event => { if (event.persisted) start(); });
})();
