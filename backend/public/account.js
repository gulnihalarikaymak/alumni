// The header's right side, on the landing and on every workspace page:
//   - the menu links, drawn from GET /api/auth/me for the user's role
//     (task 6, backend/src/auth/navigation.ts);
//   - an Admin button for an ADMIN, with the number of accounts waiting for approval;
//   - the ☰ button, which opens one panel with the account and the settings:
//     who is logged in, My account, Admin, language, theme, Log out
//     (Log in and Register for a visitor). On narrow screens the panel also
//     holds the menu links, so ☰ is the only menu button.
// In the HTML the menu holds the visitor's links and the header has "Log in" and
// "Register" links, so a page still works without JavaScript.
(async () => {
  const { t, lang, setLanguage } = window.i18n;
  const root = document.documentElement;
  const nav = document.querySelector('#workspace-nav, #primary-nav');
  const actions = document.querySelector('.bar-actions, .header-actions');
  const menuButton = document.querySelector('.menu-button');
  const panel = document.querySelector('#site-menu');
  // The header buttons use bar-action (workspace) or platform-link (landing)
  const buttonClass = actions.querySelector('.bar-action') ? 'bar-action' : 'platform-link';
  // A shield: the admin button's icon (a fixed string, no user data)
  const SHIELD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
    '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>';

  setUpMenuButton();

  // The last menu of this browser tab session: drawn at once, so a logged-in user's
  // longer menu does not appear (and move the header) only after the request below.
  let menu = [];
  try { menu = JSON.parse(sessionStorage.getItem('menu')) ?? []; } catch { /* no saved menu */ }
  drawMenu(menu);
  drawPanel(menu, null, 0);

  let me;
  try {
    const response = await fetch('/api/auth/me', { headers: { Accept: 'application/json' }, cache: 'no-store' });
    me = await response.json();
  } catch {
    return; // The API cannot be reached: keep the visitor menu and the "Log in" link.
  }
  drawMenu(me.menu ?? []);
  try { sessionStorage.setItem('menu', JSON.stringify(me.menu ?? [])); } catch { /* storage blocked */ }

  let pending = 0;
  if (me.user) {
    // Log in and Register leave the header; Log out is in the ☰ panel
    actions.querySelectorAll('.account-action, .register-action').forEach(link => link.remove());
    if (me.user.role === 'ADMIN') pending = await showAdmin();
  }
  drawPanel(me.menu ?? [], me.user, pending);

  // ---- the menu links in the header ----

  function drawMenu(items) {
    if (!nav || items.length === 0) return;
    // Reuse the links the page already has (on the landing, Home is "#home"); create the others.
    const pageLinks = new Map(Array.from(nav.querySelectorAll('a'), a =>
      [a.getAttribute('href') === '#home' ? '/' : a.getAttribute('href'), a]));
    nav.replaceChildren(...items.map(item => pageLinks.get(item.href) ?? newLink(item)));
  }

  function newLink(item) {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = t(item.label);
    if (location.pathname.split('/')[1] === item.href.slice(1)) link.setAttribute('aria-current', 'page');
    return link;
  }

  // ---- the Admin button (ADMIN only) ----

  // Returns the number of accounts waiting for approval (0 when it cannot be read).
  async function showAdmin() {
    const admin = document.createElement('a');
    admin.href = '/admin';
    admin.className = buttonClass + ' admin-action';
    admin.insertAdjacentHTML('afterbegin', SHIELD_ICON);
    admin.append(el('span', 'admin-label', t('Admin')));
    if (location.pathname === '/admin') admin.setAttribute('aria-current', 'page');
    menuButton.before(admin);
    try {
      const response = await fetch('/api/admin/summary', { headers: { Accept: 'application/json' }, cache: 'no-store' });
      const count = (await response.json()).users.byStatus.PENDING;
      if (count > 0) {
        admin.append(el('span', 'count', String(count)));
        admin.setAttribute('aria-label', t('Admin') + ', ' + t('{count} waiting for approval', { count }));
      }
      return count;
    } catch {
      return 0; // no badge when the summary cannot be read
    }
  }

  // ---- the ☰ panel ----

  function setUpMenuButton() {
    menuButton.hidden = false;
    menuButton.addEventListener('click', () => setOpen(panel.hidden));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        menuButton.focus();
      }
    });
    // A click or the keyboard focus outside the header buttons closes the panel
    document.addEventListener('click', event => { if (!actions.contains(event.target)) setOpen(false); });
    actions.addEventListener('focusout', event => {
      if (event.relatedTarget && !actions.contains(event.relatedTarget)) setOpen(false);
    });
  }

  function setOpen(open) {
    panel.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', t(open ? 'Close menu' : 'Open menu'));
  }

  // Draws the panel for this user (null for a visitor) from scratch.
  function drawPanel(items, user, count) {
    const parts = [];

    // The menu links: shown in the panel only on narrow screens (CSS), where the header has no room
    const panelNav = el('nav', 'site-menu-nav');
    panelNav.setAttribute('aria-label', t('Main navigation'));
    panelNav.append(...(items.length ? items : visitorMenu()).map(item => {
      const link = row('a', t(item.label));
      link.href = item.href;
      if (location.pathname === item.href) link.setAttribute('aria-current', 'page');
      return link;
    }));
    parts.push(panelNav);

    // The account
    if (user) {
      const who = el('p', 'site-menu-who');
      who.append(el('span', '', t('Logged in as')), el('strong', '', user.email), el('span', 'badge role', user.role));
      parts.push(who);
      parts.push(linkRow('/account', t('My account')));
      if (user.role === 'ADMIN') {
        const admin = linkRow('/admin', t('Admin panel'));
        if (count > 0) admin.append(el('span', 'count', String(count)));
        parts.push(admin);
      }
    } else {
      parts.push(linkRow('/login', t('Log in')), linkRow('/register', t('Register')));
    }

    // The settings: two-way switches, each saved in localStorage like before
    parts.push(el('p', 'site-menu-heading', t('Settings')));
    parts.push(choice(t('Language'), [['tr', 'Türkçe'], ['en', 'English']], lang, value => setLanguage(value)));
    parts.push(choice(t('Theme'), [['light', t('Light')], ['dark', t('Dark')]], root.dataset.theme, value => {
      root.dataset.theme = value;
      try { localStorage.setItem('theme', value); } catch { /* storage blocked */ }
    }));

    if (user) {
      const logout = row('button', t('Log out'));
      logout.type = 'button';
      logout.classList.add('site-menu-logout');
      logout.addEventListener('click', async () => {
        logout.disabled = true;
        try {
          sessionStorage.removeItem('menu'); // the next page starts with the visitor menu
          await fetch('/api/auth/logout', { method: 'POST' });
        } finally {
          location.reload(); // the page reloads without the session
        }
      });
      parts.push(logout);
    }
    panel.replaceChildren(...parts);
  }

  // The visitor's links, read from the header before any menu was drawn
  function visitorMenu() {
    return Array.from(nav?.querySelectorAll('a') ?? [], a =>
      ({ label: a.textContent, href: a.getAttribute('href') === '#home' ? '/' : a.getAttribute('href') }));
  }

  // A labelled pair of buttons; the pressed one is the current value.
  function choice(label, options, current, onChoose) {
    const group = el('div', 'site-menu-choice');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', label);
    const buttons = options.map(([value, text]) => {
      const button = el('button', '', text);
      button.type = 'button';
      if (value === 'tr' || value === 'en') button.lang = value;
      button.setAttribute('aria-pressed', String(value === current));
      button.addEventListener('click', () => {
        buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        onChoose(value);
      });
      return button;
    });
    group.append(el('span', 'site-menu-label', label), el('span', 'site-menu-options'));
    group.lastChild.append(...buttons);
    return group;
  }

  function linkRow(href, text) {
    const link = row('a', text);
    link.href = href;
    if (location.pathname === href) link.setAttribute('aria-current', 'page');
    return link;
  }

  function row(tag, text) {
    return el(tag, 'site-menu-row', text);
  }

  // A small element helper; text always goes in as text, never as HTML.
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
})();
