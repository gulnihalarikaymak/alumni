import { api, badge, buttonLink, card, date, details, el, heading, link, table } from './workspace-ui.js';

// "My account" at /account (task 7): a page about the logged-in user only.
// GET /api/account returns { user, alumniProfile, applications }; the sections
// shown depend on the role:
//   every role       → account details
//   ALUMNI           → alumni profile
//   ALUMNI, STUDENT  → my job applications
//   STAFF            → shortcuts to publish news and openings
//   ADMIN            → shortcut to the admin panel
const { t, count } = window.i18n; // interface language, see i18n.js

function accountCard(user) {
  return card(el('h2', {}, t('Account')), details([
    [t('E-mail'), user.email],
    [t('Role'), badge(user.role, true)],
    [t('Status'), badge(user.status)],
    [t('Member since'), date(user.createdAt, true)]
  ]));
}

function profileCard(profile) {
  return card(el('h2', {}, t('Alumni profile')), details([
    [t('Full name'), profile.fullName],
    [t('Graduation year'), String(profile.graduationYear)],
    [t('City'), profile.city || '—']
  ]));
}

function applicationsCard(applications) {
  const title = el('h2', {}, t('My applications'));
  if (!applications.length) {
    return card(title, el('p', { class: 'meta' }, t('No applications yet.')),
      el('div', { class: 'actions' }, buttonLink('/job-postings', t('Browse job postings'))));
  }
  const rows = applications.map(application => [
    [link('/job-postings/' + application.jobPosting.id, application.jobPosting.title),
      el('p', { class: 'meta' }, application.jobPosting.company)],
    badge(application.status),
    date(application.createdAt),
    link('/job-applications/' + application.id, t('Open'))
  ]);
  return card(title, el('p', { class: 'meta' }, count(applications.length, 'application', 'applications')),
    table(t('My applications'), [t('Job posting'), t('Status'), t('Applied'), t('Actions')], rows));
}

function shortcutsCard(user) {
  const links = user.role === 'ADMIN'
    ? [buttonLink('/admin', t('Open the admin panel'))]
    : [buttonLink('/announcements/create', t('New announcement')), buttonLink('/job-postings/create', t('New job posting'), true)];
  return card(el('h2', {}, t('Shortcuts')), el('div', { class: 'actions' }, links));
}

export async function accountPage() {
  const { user, alumniProfile, applications } = await api('/account');
  return [
    heading(t('My account'), t('Logged in as {email}', { email: user.email })),
    accountCard(user),
    alumniProfile ? profileCard(alumniProfile) : null,
    applications ? applicationsCard(applications) : null,
    user.role === 'STAFF' || user.role === 'ADMIN' ? shortcutsCard(user) : null
  ].filter(Boolean);
}
