import { api, badge, buttonLink, details, el, link } from './workspace-ui.js';

// The login page at /login. It sends JSON to POST /api/auth/login; the server
// answers with the user and sets the ats_session cookie (HttpOnly, so this
// script never sees the token). Only ACTIVE accounts can log in (DDD 4.11).
const { t } = window.i18n; // interface language, see i18n.js

// The page to open after login: "?next=/users" when the auth middleware sent the
// visitor here. Only a path on this site is accepted ("//evil.example" is not).
function nextPage() {
  const next = new URLSearchParams(location.search).get('next');
  return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login') ? next : '/platform';
}

function loggedIn(user) {
  const logout = el('button', { class: 'btn quiet', type: 'button' }, t('Log out'));
  logout.addEventListener('click', async () => {
    logout.disabled = true;
    try { await api('/auth/logout', 'POST'); } finally { location.reload(); }
  });
  return el('div', { class: 'stack' },
    el('h2', { id: 'login-form-title' }, t('You are logged in')),
    details([[t('E-mail'), user.email], [t('Role'), badge(user.role, true)], [t('Status'), badge(user.status)]]),
    el('div', { class: 'form-actions' }, buttonLink('/platform', t('Enter the workspace')), logout));
}

function loginForm() {
  const errorBox = el('p', { class: 'form-error', role: 'alert', hidden: true, tabindex: '-1' });
  const submit = el('button', { class: 'btn', type: 'submit' }, t('Log in'));
  const formNode = el('form', { class: 'stack' }, errorBox,
    el('label', {}, t('E-mail'), el('input', { name: 'email', type: 'email', autocomplete: 'email', required: true })),
    el('label', {}, t('Password'), el('input', { name: 'password', type: 'password', autocomplete: 'current-password', required: true })),
    el('div', { class: 'form-actions' }, submit),
    el('p', { class: 'meta' }, t('No account yet?') + ' ', link('/register', t('Create an account'))));

  formNode.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    formNode.setAttribute('aria-busy', 'true');
    errorBox.hidden = true;
    const values = new FormData(formNode);
    try {
      await api('/auth/login', 'POST', { email: values.get('email'), password: values.get('password') });
      location.assign(nextPage());
    } catch (error) {
      // 401: one message for a wrong e-mail or password; 403: the API says which status the account has
      errorBox.textContent = error.status === 401 ? t('E-mail or password is incorrect.') : error.message;
      errorBox.hidden = false;
      errorBox.focus();
      formNode.elements.password.value = '';
      submit.disabled = false;
      formNode.removeAttribute('aria-busy');
    }
  });
  return formNode;
}

export async function loginPage() {
  const { user } = await api('/auth/me');
  const card = el('section', { class: 'card', 'aria-labelledby': 'login-form-title' },
    user ? loggedIn(user) : [el('h2', { id: 'login-form-title' }, t('Log in to your account')),
      new URLSearchParams(location.search).has('next') ? el('p', { class: 'notice', role: 'status' }, t('Log in to open this page.')) : null,
      loginForm()]);
  return el('div', { class: 'register' },
    el('div', { class: 'register-intro' },
      el('p', { class: 'kicker' }, t('Welcome back')),
      el('h1', {}, t('Log in to the') + ' ', el('em', {}, t('alumni network.'))),
      el('p', {}, t('Use the e-mail and password you registered with. Only approved (ACTIVE) accounts can log in.')),
      el('img', { src: '/media/connection.webp', width: 1600, height: 1000, alt: t('Friends talking over tea around an outdoor table') })),
    card);
}
