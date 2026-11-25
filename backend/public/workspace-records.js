import { actions, api, back, badge, buttonLink, card, dataLink, date, deleteButton, details,
  el, empty, field, form, heading, link, table } from './workspace-ui.js';

const { t, count } = window.i18n; // interface language, see i18n.js
const roles = ['ADMIN', 'STAFF', 'ALUMNI', 'STUDENT'];
const statuses = ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'];
// Every label is a whole sentence, so it can be translated (Turkish word order differs).
const resources = {
  users: {
    title: 'Users', one: 'user', many: 'users', create: 'New user', edit: 'Edit user #{id}',
    back: 'Back to the user', all: 'All users', none: 'No users yet.'
  },
  announcements: {
    title: 'Announcements', one: 'announcement', many: 'announcements', create: 'New announcement',
    edit: 'Edit announcement #{id}', back: 'Back to the announcement', all: 'All announcements', none: 'No announcements yet.'
  },
  'job-postings': {
    title: 'Job postings', one: 'job posting', many: 'job postings', create: 'New job posting',
    edit: 'Edit job posting #{id}', back: 'Back to the job posting', all: 'All job postings', none: 'No job postings yet.'
  }
};

function recordActions(type, id, detail = false) {
  const base = '/' + type;
  const path = base + '/' + id;
  let prompt = 'Delete this announcement?';
  if (type === 'users') prompt = 'Delete this user and their applications?';
  if (type === 'job-postings') prompt = 'Delete this job posting and its applications?';
  return actions(
    type === 'job-postings' ? link(path + '/applications', t('Applications'), detail ? 'btn' : undefined) : null,
    link(path + '/edit', t('Edit'), detail ? 'btn quiet' : undefined), deleteButton(path, base, t(prompt)));
}

function userRows(records) {
  const labels = ['ID', 'E-mail', 'Role', 'Status', 'Created', 'Actions'].map(label => t(label));
  return table(t('User records'), labels, records.map(user => [
    user.id, el('div', { class: 'person' }, el('span', { class: 'initial', 'aria-hidden': 'true' }, user.email.charAt(0).toUpperCase()),
      link('/users/' + user.id, user.email)),
    badge(user.role, true), badge(user.status), date(user.createdAt), recordActions('users', user.id)
  ]));
}

function entries(type, records) {
  return el('ol', { class: 'entries' }, records.map(record => {
    const title = el('h3', {}, link('/' + type + '/' + record.id, record.title));
    if (type === 'announcements') {
      const preview = record.content.length > 160 ? record.content.slice(0, 160) + '…' : record.content;
      return el('li', {}, title, date(record.createdAt), el('p', {}, preview), recordActions(type, record.id));
    }
    return el('li', {}, title,
      el('p', {}, record.company, record.location ? ' · ' + record.location : '',
        record.deadline ? [' · ' + t('Apply by') + ' ', date(record.deadline, true)] : ' · ' + t('Open until removed')),
      el('div', { class: 'tags' }, badge(record.workType, true), badge(record.employmentType, true)), recordActions(type, record.id));
  }));
}

export async function listRecords(type) {
  const path = '/' + type;
  const labels = resources[type];
  const records = await api(path);
  const total = count(records.length, labels.one, labels.many);
  const create = buttonLink(path + '/create', t(labels.create));
  return [heading(t(labels.title), total + (type === 'users' ? '' : ', ' + t('newest first')), create),
    records.length ? (type === 'users' ? userRows(records) : entries(type, records)) : empty(t(labels.none)),
    dataLink(path)];
}

function jobFields(record) {
  return [
    field(t('Title'), 'title', record.title, { required: true, maxlength: 120 }),
    field(t('Company'), 'company', record.company, { required: true }),
    field(t('City (optional)'), 'location', record.location),
    field(t('Work type'), 'workType', record.workType, { required: true, choices: ['ONSITE', 'HYBRID', 'REMOTE'] }),
    field(t('Employment type'), 'employmentType', record.employmentType,
      { required: true, choices: ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'] }),
    field(t('Description (optional)'), 'description', record.description, { multiline: true }),
    field(t('Apply link (optional)'), 'applyUrl', record.applyUrl, { placeholder: 'https://example.com/careers' }),
    field(t('Deadline (optional)'), 'deadline', record.deadline, { type: 'date' })
  ];
}

export async function editRecord(type, id) {
  const labels = resources[type];
  const base = '/' + type;
  const path = id ? base + '/' + id : base;
  const record = id ? await api(path) : {};
  let fields;
  let hint;
  if (type === 'job-postings') {
    fields = jobFields(record);
    hint = t('Leave the deadline empty to keep the posting open until it is removed.');
  } else if (type === 'announcements') {
    fields = [field(t('Title'), 'title', record.title, { required: true, maxlength: 120 }),
      field(t('Content'), 'content', record.content, { multiline: true, required: true, maxlength: 2000 })];
    hint = t('Use up to 120 characters for the title and 2,000 for the content.');
  } else {
    fields = [field(t('E-mail'), 'email', record.email, { type: 'email', required: true }),
      field(t('Role'), 'role', record.role, { choices: roles, required: true })];
    if (id) fields.push(field(t('Status'), 'status', record.status, { choices: statuses, required: true }));
    else hint = t('New users start with pending status.');
  }
  const label = id ? t(labels.edit, { id }) : t(labels.create);
  return el('div', { class: 'narrow' }, back(path, t(id ? labels.back : labels.all)),
    heading(label, hint), card(form({
      path, method: id ? 'PUT' : 'POST', fields, submit: t(id ? 'Save changes' : (type === 'users' ? 'Create' : 'Publish')),
      cancel: path, onSaved: saved => base + '/' + saved.id
    })));
}

function userDetails(user, path) {
  return [heading(user.email, t('User #{id}', { id: user.id }), recordActions('users', user.id, true)),
    el('div', { class: 'split' },
      card(el('h2', {}, t('Details')), details([
        [t('ID'), user.id], [t('E-mail'), user.email], [t('Role'), badge(user.role, true)],
        [t('Status'), badge(user.status)], [t('Created'), date(user.createdAt)]
      ])),
      card(el('h2', {}, t('Change status')), form({ path, method: 'PATCH',
        fields: [field(t('Status'), 'status', user.status, { choices: statuses, required: true })],
        submit: t('Save status'), onSaved: () => path })))];
}

function applyLink(job, path) {
  if (job.applyUrl) {
    try {
      const url = new URL(job.applyUrl);
      if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
        return el('a', { href: url.href, rel: 'noopener noreferrer' }, job.applyUrl);
      }
    } catch { /* Older records can contain an incomplete address. */ }
  }
  return link(path + '/applications', t('Apply in ATS'));
}

function jobDetails(job, path) {
  return [heading(job.title, [job.company, job.location].filter(Boolean).join(' · '), recordActions('job-postings', job.id, true)),
    el('div', { class: 'split' },
      card(el('h2', {}, t('Description')), el('p', { class: 'content' }, job.description || t('No description'))),
      card(el('h2', {}, t('Details')), details([
        [t('Work type'), badge(job.workType, true)], [t('Employment'), badge(job.employmentType, true)],
        [t('City'), job.location || t('Not stated')], [t('Deadline'), job.deadline ? date(job.deadline, true) : t('Open until removed')],
        [t('Apply'), applyLink(job, path)], [t('Posted'), date(job.createdAt)]
      ])))];
}

export async function showRecord(type, id) {
  const base = '/' + type;
  const path = base + '/' + id;
  const record = await api(path);
  const returnLink = back(base, t(resources[type].all));
  if (type === 'users') return [returnLink, ...userDetails(record, path)];
  if (type === 'job-postings') return [returnLink, ...jobDetails(record, path)];
  return el('div', { class: 'narrow' }, returnLink,
    card(el('article', { class: 'stack' }, el('h1', {}, record.title),
      el('p', { class: 'meta' }, date(record.createdAt),
        record.createdAt === record.updatedAt ? null : [' · ' + t('Edited') + ' ', date(record.updatedAt)]),
      el('p', { class: 'content' }, record.content), recordActions(type, id, true))));
}
