import { api, badge, buttonLink, date, el, heading, link, table } from './workspace-ui.js';

// The admin panel at /admin (task 5). Its data comes from GET /api/admin/summary
// and GET /api/users; it changes users with PATCH and DELETE /api/users/:id.
// The auth middleware lets only ADMIN users use those routes, so anyone else
// gets a 403 from the API and sees "Only admins can open this page".
const { t } = window.i18n; // interface language, see i18n.js
const roles = ['ADMIN', 'STAFF', 'ALUMNI', 'STUDENT'];
const statuses = ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'];

// Shows an API error (for example "You cannot delete your own account") above the page.
function showError(error) {
  const notice = document.querySelector('#action-error');
  notice.textContent = error.message;
  notice.hidden = false;
  notice.focus();
}

// Runs one change and reloads the panel, so every count and table is up to date.
async function change(button, path, method, data) {
  button.disabled = true;
  try {
    await api(path, method, data);
    location.reload();
  } catch (error) {
    showError(error);
    button.disabled = false;
  }
}

function smallButton(label, style, onClick) {
  const button = el('button', { class: 'btn small ' + style, type: 'button' }, label);
  button.addEventListener('click', () => onClick(button));
  return button;
}

function stats(summary) {
  const items = [
    [t('Users'), summary.users.total, '/users'],
    [t('Waiting for approval'), summary.users.byStatus.PENDING, '#pending'],
    [t('Announcements'), summary.announcements, '/announcements'],
    [t('Job postings'), summary.jobPostings, '/job-postings'],
    [t('Applications'), summary.jobApplications, '/job-applications']
  ];
  return el('div', { class: 'stats' }, items.map(([label, value, href]) =>
    el('a', { class: 'stat', href }, el('span', { class: 'stat-value' }, value), el('span', { class: 'stat-label' }, label))));
}

function pendingCard(users) {
  const pending = users.filter(user => user.status === 'PENDING');
  const rows = pending.map(user => [
    link('/users/' + user.id, user.email), badge(user.role, true), date(user.createdAt),
    el('div', { class: 'actions' },
      smallButton(t('Approve'), '', button => change(button, '/users/' + user.id, 'PATCH', { status: 'ACTIVE' })),
      smallButton(t('Reject'), 'danger', button => change(button, '/users/' + user.id, 'PATCH', { status: 'REJECTED' })))
  ]);
  return el('section', { class: 'card', id: 'pending', 'aria-labelledby': 'pending-title' },
    el('h2', { id: 'pending-title' }, t('Waiting for approval')),
    pending.length
      ? table(t('Waiting for approval'), [t('E-mail'), t('Role'), t('Created'), t('Actions')], rows)
      : el('p', { class: 'meta' }, t('No accounts are waiting for approval.')));
}

function contentCard() {
  return el('section', { class: 'card', 'aria-labelledby': 'content-title' },
    el('h2', { id: 'content-title' }, t('Manage content')),
    el('div', { class: 'form-actions' },
      buttonLink('/announcements/create', t('New announcement')), buttonLink('/job-postings/create', t('New job posting'), true),
      link('/announcements', t('Manage announcements')), link('/job-postings', t('Manage job postings')),
      link('/job-applications', t('Review applications'))));
}

function select(name, value, choices, label, disabled) {
  const node = el('select', { name, 'aria-label': label, disabled }, choices.map(choice => el('option', { value: choice }, choice)));
  node.value = value;
  return node;
}

// Every user with a role and a status control. The admin's own row is read-only:
// the API refuses to let an admin lock themselves out (UsersService).
function usersCard(users, me) {
  const rows = users.map(user => {
    const self = user.id === me.id;
    const role = select('role', user.role, roles, t('Role for {email}', { email: user.email }), self);
    const status = select('status', user.status, statuses, t('Status for {email}', { email: user.email }), self);
    const actions = self
      ? badge(t('You'), true)
      : el('div', { class: 'actions' },
          smallButton(t('Save'), 'quiet', button => change(button, '/users/' + user.id, 'PATCH', { role: role.value, status: status.value })),
          smallButton(t('Delete'), 'danger', button => {
            if (window.confirm(t('Delete {email} and their applications?', { email: user.email }))) change(button, '/users/' + user.id, 'DELETE');
          }));
    return [user.id, link('/users/' + user.id, user.email), role, status, actions];
  });
  return el('section', { class: 'admin-users', 'aria-labelledby': 'users-title' },
    el('h2', { id: 'users-title' }, t('All users')),
    table(t('All users'), [t('ID'), t('E-mail'), t('Role'), t('Status'), t('Actions')], rows));
}

function forbidden(user) {
  return el('section', { class: 'card narrow stack' },
    el('h1', {}, t('Only admins can open this page')),
    el('p', {}, t('Your account is {role}. Ask an admin to give you the ADMIN role.', { role: user.role })),
    el('div', {}, buttonLink('/platform', t('Enter the workspace'))));
}

export async function adminPage() {
  const { user } = await api('/auth/me');
  let summary;
  let users;
  try {
    [summary, users] = await Promise.all([api('/admin/summary'), api('/users')]);
  } catch (error) {
    if (error.status === 403) return forbidden(user);
    throw error;
  }
  return [
    heading(t('Admin panel'), t('Logged in as {email}', { email: user.email }) + ' · ' +
      t('Approve accounts, assign roles and manage the records.')),
    stats(summary),
    pendingCard(users),
    contentCard(),
    usersCard(users, user)
  ];
}
