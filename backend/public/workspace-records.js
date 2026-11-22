import { actions, api, back, badge, buttonLink, card, dataLink, date, deleteButton, details,
  el, empty, field, form, heading, link, table } from './workspace-ui.js';

const roles = ['ADMIN', 'STAFF', 'ALUMNI', 'STUDENT'];
const statuses = ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'];
const resources = {
  users: { title: 'Users', singular: 'user' },
  announcements: { title: 'Announcements', singular: 'announcement' },
  'job-postings': { title: 'Job postings', singular: 'job posting' }
};

function recordActions(type, id, detail = false) {
  const base = '/' + type;
  const path = base + '/' + id;
  let prompt = 'Delete this announcement?';
  if (type === 'users') prompt = 'Delete this user and their applications?';
  if (type === 'job-postings') prompt = 'Delete this job posting and its applications?';
  return actions(
    type === 'job-postings' ? link(path + '/applications', 'Applications', detail ? 'btn' : undefined) : null,
    link(path + '/edit', 'Edit', detail ? 'btn quiet' : undefined), deleteButton(path, base, prompt));
}

function userRows(records) {
  return table('User records', ['ID', 'E-mail', 'Role', 'Status', 'Created', 'Actions'], records.map(user => [
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
        record.deadline ? [' · Apply by ', date(record.deadline, true)] : ' · Open until removed'),
      el('div', { class: 'tags' }, badge(record.workType, true), badge(record.employmentType, true)), recordActions(type, record.id));
  }));
}

export async function listRecords(type) {
  const path = '/' + type;
  const { title, singular } = resources[type];
  const records = await api(path);
  const count = records.length + ' ' + singular + (records.length === 1 ? '' : 's');
  const create = buttonLink(path + '/create', 'New ' + singular);
  return [heading(title, count + (type === 'users' ? '' : ', newest first'), create),
    records.length ? (type === 'users' ? userRows(records) : entries(type, records)) : empty('No ' + title.toLowerCase() + ' yet.'),
    dataLink(path)];
}

function jobFields(record) {
  return [
    field('Title', 'title', record.title, { required: true, maxlength: 120 }),
    field('Company', 'company', record.company, { required: true }),
    field('City (optional)', 'location', record.location),
    field('Work type', 'workType', record.workType, { required: true, choices: ['ONSITE', 'HYBRID', 'REMOTE'] }),
    field('Employment type', 'employmentType', record.employmentType,
      { required: true, choices: ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'] }),
    field('Description (optional)', 'description', record.description, { multiline: true }),
    field('Apply link (optional)', 'applyUrl', record.applyUrl, { placeholder: 'https://example.com/careers' }),
    field('Deadline (optional)', 'deadline', record.deadline, { type: 'date' })
  ];
}

export async function editRecord(type, id) {
  const { title, singular } = resources[type];
  const base = '/' + type;
  const path = id ? base + '/' + id : base;
  const record = id ? await api(path) : {};
  let fields;
  let hint;
  if (type === 'job-postings') {
    fields = jobFields(record);
    hint = 'Leave the deadline empty to keep the posting open until it is removed.';
  } else if (type === 'announcements') {
    fields = [field('Title', 'title', record.title, { required: true, maxlength: 120 }),
      field('Content', 'content', record.content, { multiline: true, required: true, maxlength: 2000 })];
    hint = 'Use up to 120 characters for the title and 2,000 for the content.';
  } else {
    fields = [field('E-mail', 'email', record.email, { type: 'email', required: true }),
      field('Role', 'role', record.role, { choices: roles, required: true })];
    if (id) fields.push(field('Status', 'status', record.status, { choices: statuses, required: true }));
    else hint = 'New users start with pending status.';
  }
  const label = id ? 'Edit ' + singular + ' #' + id : 'New ' + singular;
  return el('div', { class: 'narrow' }, back(path, id ? 'Back to the ' + singular : 'All ' + title.toLowerCase()),
    heading(label, hint), card(form({
      path, method: id ? 'PUT' : 'POST', fields, submit: id ? 'Save changes' : (type === 'users' ? 'Create' : 'Publish'),
      cancel: path, onSaved: saved => base + '/' + saved.id
    })));
}

function userDetails(user, path) {
  return [heading(user.email, 'User #' + user.id, recordActions('users', user.id, true)),
    el('div', { class: 'split' },
      card(el('h2', {}, 'Details'), details([
        ['ID', user.id], ['E-mail', user.email], ['Role', badge(user.role, true)],
        ['Status', badge(user.status)], ['Created', date(user.createdAt)]
      ])),
      card(el('h2', {}, 'Change status'), form({ path, method: 'PATCH',
        fields: [field('Status', 'status', user.status, { choices: statuses, required: true })],
        submit: 'Save status', onSaved: () => path })))];
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
  return link(path + '/applications', 'Apply in ATS');
}

function jobDetails(job, path) {
  return [heading(job.title, [job.company, job.location].filter(Boolean).join(' · '), recordActions('job-postings', job.id, true)),
    el('div', { class: 'split' },
      card(el('h2', {}, 'Description'), el('p', { class: 'content' }, job.description || 'No description')),
      card(el('h2', {}, 'Details'), details([
        ['Work type', badge(job.workType, true)], ['Employment', badge(job.employmentType, true)],
        ['City', job.location || 'Not stated'], ['Deadline', job.deadline ? date(job.deadline, true) : 'Open until removed'],
        ['Apply', applyLink(job, path)], ['Posted', date(job.createdAt)]
      ])))];
}

export async function showRecord(type, id) {
  const base = '/' + type;
  const path = base + '/' + id;
  const record = await api(path);
  const returnLink = back(base, 'All ' + resources[type].title.toLowerCase());
  if (type === 'users') return [returnLink, ...userDetails(record, path)];
  if (type === 'job-postings') return [returnLink, ...jobDetails(record, path)];
  return el('div', { class: 'narrow' }, returnLink,
    card(el('article', { class: 'stack' }, el('h1', {}, record.title),
      el('p', { class: 'meta' }, date(record.createdAt),
        record.createdAt === record.updatedAt ? null : [' · Edited ', date(record.updatedAt)]),
      el('p', { class: 'content' }, record.content), recordActions(type, id, true))));
}
