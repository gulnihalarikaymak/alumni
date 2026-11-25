import { actions, api, back, badge, buttonLink, card, dataLink, date, deleteButton, details,
  el, empty, field, form, heading, link, table } from './workspace-ui.js';

const { t, count } = window.i18n; // interface language, see i18n.js
const base = '/job-applications';

function applicationsTable(records, users, jobs) {
  if (!records.length) return empty(t('No applications yet.'), jobs ? buttonLink('/job-postings', t('Browse job postings')) : null);
  const people = new Map(users.map(user => [user.id, user]));
  const postings = new Map((jobs || []).map(job => [job.id, job]));
  const headers = ['ID', 'Applicant', 'Status'];
  if (jobs) headers.push('Job posting');
  headers.push('Applied', 'Actions');
  return table(t('Applications'), headers.map(label => t(label)), records.map(application => {
    const path = base + '/' + application.id;
    const applicant = people.get(application.applicantId);
    const row = [application.id, link('/users/' + application.applicantId,
      applicant?.email || t('User #{id}', { id: application.applicantId })), badge(application.status)];
    if (jobs) {
      const job = postings.get(application.jobPostingId);
      row.push([link('/job-postings/' + application.jobPostingId, job?.title || t('Posting #{id}', { id: application.jobPostingId })),
        job ? el('p', { class: 'meta' }, job.company) : null]);
    }
    row.push(date(application.createdAt), actions(link(path, t('Open')),
      jobs ? deleteButton(path, base, t('Withdraw this application?'), t('Withdraw')) : null));
    return row;
  }));
}

export async function listApplications() {
  const [applications, users, jobs] = await Promise.all([api(base), api('/users'), api('/job-postings')]);
  const total = count(applications.length, 'application', 'applications');
  return [heading(t('Job applications'), [total + ', ' + t('newest first') + '. ', link('/job-postings', t('To apply, open a job posting.'))]),
    applicationsTable(applications, users, jobs), dataLink(base)];
}

export async function postingApplications(id) {
  const posting = '/job-postings/' + id;
  const path = posting + '/applications';
  const [job, applications, users] = await Promise.all([api(posting), api(path), api('/users')]);
  const choices = users.filter(user => ['STUDENT', 'ALUMNI'].includes(user.role))
    .map(user => [user.id, user.email + ' (' + user.role + ')']);
  const applicationForm = choices.length
    ? form({ path, method: 'POST',
        fields: [field(t('Applicant'), 'applicantId', '', { choices, required: true }),
          field(t('Cover letter (optional)'), 'coverLetter', '', { multiline: true, maxlength: 2000 })],
        submit: t('Submit application'), onSaved: () => path })
    : el('p', {}, t('Alumni and students can apply.') + ' ', link('/users/create', t('Add a user to get started.')));
  const total = count(applications.length, 'application', 'applications');
  return [back(posting, t('Back to the job posting')),
    heading(t('Applications'), t('{title} at {company}', { title: job.title, company: job.company }) + ' · ' + total),
    el('div', { class: 'split' }, applicationsTable(applications, users), card(el('h2', {}, t('Apply')), applicationForm))];
}

export async function showApplication(id) {
  const path = base + '/' + id;
  const application = await api(path);
  const posting = '/job-postings/' + application.jobPostingId;
  const person = '/users/' + application.applicantId;
  const [job, applicant] = await Promise.all([api(posting), api(person)]);
  const update = form({ path, method: 'PATCH', fields: [
    field(t('Status'), 'status', application.status, { choices: ['SUBMITTED', 'REVIEWED', 'ACCEPTED', 'REJECTED'], required: true }),
    field(t('Cover letter'), 'coverLetter', application.coverLetter, { multiline: true, maxlength: 2000 })],
    submit: t('Save'), onSaved: () => path });
  return [back(posting + '/applications', t('All applications to this posting')),
    heading(applicant.email, [t('Application #{id} to', { id }) + ' ', link(posting, job.title)],
      deleteButton(path, base, t('Withdraw this application?'), t('Withdraw'))),
    el('div', { class: 'split' },
      card(el('h2', {}, t('Details')), details([
        [t('Status'), badge(application.status)], [t('Job posting'), [link(posting, job.title), ', ' + job.company]],
        [t('Applicant'), [link(person, applicant.email), ' ', badge(applicant.role, true)]],
        [t('Applied'), date(application.createdAt)], [t('Updated'), date(application.updatedAt)],
        [t('Cover letter'), el('p', { class: 'content' }, application.coverLetter || t('None'))]
      ])), card(el('h2', {}, t('Update')), update))];
}
