// The header's menu and account button, on the landing and on every workspace page.
// In the HTML the menu holds the visitor's links and the account button is a
// "Log in" link to /login next to a "Register" link, so both work without JavaScript.
// GET /api/auth/me says who is logged in and which menu links their role gets
// (task 6, backend/src/auth/navigation.ts): the menu is drawn from that list,
// and for a logged-in user "Log in" becomes "Log out" and "Register" disappears.
(async () => {
  const { t } = window.i18n;
  // A shield: the admin button's icon (a fixed string, no user data)
  const SHIELD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
    '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>';

  // The last menu of this browser tab session: drawn at once, so a logged-in user's
  // longer menu does not appear (and move the header) only after the request below.
  try { drawMenu(JSON.parse(sessionStorage.getItem('menu')) ?? []); } catch { /* no saved menu */ }

  let me;
  try {
    const response = await fetch('/api/auth/me', { headers: { Accept: 'application/json' }, cache: 'no-store' });
    me = await response.json();
  } catch {
    return; // The API cannot be reached: keep the visitor menu and the "Log in" link.
  }

  drawMenu(me.menu ?? []);
  try { sessionStorage.setItem('menu', JSON.stringify(me.menu ?? [])); } catch { /* storage blocked */ }
  if (me.user) showLogout(me.user);

  function drawMenu(items) {
    const nav = document.querySelector('#workspace-nav, #primary-nav');
    if (!nav || items.length === 0) return;
    // Reuse the links the page already has (on the landing, Home is "#home"); create the others.
    const pageLinks = new Map(Array.from(nav.querySelectorAll('a'), a =>
      [a.getAttribute('href') === '#home' ? '/' : a.getAttribute('href'), a]));
    const links = items.map(item => pageLinks.get(item.href) ?? newLink(item));
    nav.querySelectorAll('a').forEach(a => a.remove());
    nav.prepend(...links); // the language button stays at the end of the menu
  }

  function newLink(item) {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = t(item.label);
    if (location.pathname.split('/')[1] === item.href.slice(1)) link.setAttribute('aria-current', 'page');
    return link;
  }

  function showLogout(user) {
    const login = document.querySelector('.account-action');
    if (!login) return;
    const logout = document.createElement('button');
    logout.type = 'button';
    logout.className = login.className;
    logout.textContent = t('Log out');
    logout.title = t('Logged in as {email}', { email: user.email });
    logout.addEventListener('click', async () => {
      logout.disabled = true;
      try {
        sessionStorage.removeItem('menu'); // the next page starts with the visitor menu
        await fetch('/api/auth/logout', { method: 'POST' });
      } finally {
        location.reload(); // the page reloads without the session
      }
    });
    login.replaceWith(logout);
    document.querySelector('.register-action')?.remove(); // a logged-in user does not register again
    if (user.role === 'ADMIN') showAdmin(logout);
  }

  // An ADMIN gets the admin panel as a button of its own before "Log out", not as one
  // more menu link, with the number of accounts waiting for approval as a badge.
  async function showAdmin(logout) {
    const admin = document.createElement('a');
    admin.href = '/admin';
    // the same button style as "Log out": bar-action (workspace) or platform-link (landing)
    admin.className = (logout.classList.contains('bar-action') ? 'bar-action' : 'platform-link') + ' admin-action';
    admin.insertAdjacentHTML('afterbegin', SHIELD_ICON);
    const label = document.createElement('span');
    label.className = 'admin-label';
    label.textContent = t('Admin');
    admin.append(label);
    if (location.pathname === '/admin') admin.setAttribute('aria-current', 'page');
    logout.before(admin);
    // On a phone the header has no room for it: the same link goes into the menu (CSS picks one)
    const menuLink = document.createElement('a');
    menuLink.href = '/admin';
    menuLink.className = 'admin-in-menu';
    menuLink.textContent = t('Admin');
    const nav = document.querySelector('#workspace-nav, #primary-nav');
    nav?.insertBefore(menuLink, nav.querySelector('.lang-in-menu'));

    try {
      const response = await fetch('/api/admin/summary', { headers: { Accept: 'application/json' }, cache: 'no-store' });
      const pending = (await response.json()).users.byStatus.PENDING;
      if (pending > 0) {
        const badge = document.createElement('span');
        badge.className = 'count';
        badge.textContent = pending;
        admin.append(badge);
        menuLink.textContent = t('Admin') + ' (' + pending + ')';
        admin.setAttribute('aria-label', t('Admin') + ', ' + t('{count} waiting for approval', { count: pending }));
      }
    } catch { /* no badge when the summary cannot be read */ }
  }
})();
