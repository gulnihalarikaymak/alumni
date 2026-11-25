// The header's menu and account button, on the landing and on every workspace page.
// In the HTML the menu holds the visitor's links and the account button is a
// "Log in" link to /login, so both work without JavaScript.
// GET /api/auth/me says who is logged in and which menu links their role gets
// (task 6, backend/src/auth/navigation.ts): the menu is drawn from that list,
// and "Log in" becomes "Log out" for a logged-in user.
(async () => {
  const { t } = window.i18n;

  let me;
  try {
    const response = await fetch('/api/auth/me', { headers: { Accept: 'application/json' }, cache: 'no-store' });
    me = await response.json();
  } catch {
    return; // The API cannot be reached: keep the visitor menu and the "Log in" link.
  }

  drawMenu(me.menu ?? []);
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
        await fetch('/api/auth/logout', { method: 'POST' });
      } finally {
        location.reload(); // the page reloads without the session
      }
    });
    login.replaceWith(logout);
  }
})();
