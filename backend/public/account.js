// The header's account button, on the landing and on every workspace page.
// In the HTML it is a "Log in" link to /login, which also works without JavaScript.
// When someone is logged in (GET /api/auth/me), it becomes a "Log out" button.
(async () => {
  const { t } = window.i18n;
  const login = document.querySelector('.account-action');
  if (!login) return;

  let user = null;
  try {
    const response = await fetch('/api/auth/me', { headers: { Accept: 'application/json' }, cache: 'no-store' });
    user = (await response.json()).user;
  } catch { /* The API cannot be reached: keep the "Log in" link. */ }
  if (!user) return;

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
})();
