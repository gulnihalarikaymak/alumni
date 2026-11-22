import { actions, api, back, badge, buttonLink, card, dataLink, date, deleteButton, details,
  el, empty, field, form, heading, link, table } from './workspace-ui.js';

const base = '/job-applications';

function applicationsTable(records, users, jobs) {
  if (!records.length) return empty('No applications yet.', jobs ? buttonLink('/job-postings', 'Browse job postings') : null);
  const people = new Map(users.map(user => [user.id, user]));
  const postings = new Map((jobs || []).map(job => [job.id, job]));
  const headers = ['ID', 'Applicant', 'Status'];
  if (jobs) headers.push('Job posting');
  headers.push('Applied', 'Actions');
  return table('Applications', headers, records.map(application => {
    const path = base + '/' + application.id;
    const applicant = people.get(application.applicantId);
    const row = [application.id, link('/users/' + application.applicantId,
      applicant?.email || 'User #' + application.applicantId), badge(application.status)];
    if (jobs) {
      const job = postings.get(application.jobPostingId);
      row.push([link('/job-postings/' + application.jobPostingId, job?.title || 'Posting #' + application.jobPostingId),
        job ? el('p', { class: 'meta' }, job.company) : null]);
    }
    row.push(date(application.createdAt), actions(link(path, 'Open'),
      jobs ? deleteButton(path, base, 'Withdraw this application?', 'Withdraw') : null));
    return row;
  }));
}

export async function listApplications() {
  const [applications, users, jobs] = await Promise.all([api(base), api('/users'), api('/job-postings')]);
  const count = applications.length + ' application' + (applications.length === 1 ? '' : 's');
  return [heading('Job applications', [count + ', newest first. To apply, open a ', link('/job-postings', 'job posting'), '.']),
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
        fields: [field('Applicant', 'applicantId', '', { choices, required: true }),
          field('Cover letter (optional)', 'coverLetter', '', { multiline: true, maxlength: 2000 })],
        submit: 'Submit application', onSaved: () => path })
    : el('p', {}, 'Alumni and students can apply. ', link('/users/create', 'Add a user'), ' to get started.');
  const count = applications.length + ' application' + (applications.length === 1 ? '' : 's');
  return [back(posting, 'Back to the job posting'), heading('Applications', job.title + ' at ' + job.company + ' · ' + count),
    el('div', { class: 'split' }, applicationsTable(applications, users), card(el('h2', {}, 'Apply'), applicationForm))];
}

export async function showApplication(id) {
  const path = base + '/' + id;
  const application = await api(path);
  const posting = '/job-postings/' + application.jobPostingId;
  const person = '/users/' + application.applicantId;
  const [job, applicant] = await Promise.all([api(posting), api(person)]);
  const update = form({ path, method: 'PATCH', fields: [
    field('Status', 'status', application.status, { choices: ['SUBMITTED', 'REVIEWED', 'ACCEPTED', 'REJECTED'], required: true }),
    field('Cover letter', 'coverLetter', application.coverLetter, { multiline: true, maxlength: 2000 })],
    submit: 'Save', onSaved: () => path });
  return [back(posting + '/applications', 'All applications to this posting'),
    heading(applicant.email, ['Application #' + id + ' to ', link(posting, job.title)],
      deleteButton(path, base, 'Withdraw this application?', 'Withdraw')),
    el('div', { class: 'split' },
      card(el('h2', {}, 'Details'), details([
        ['Status', badge(application.status)], ['Job posting', [link(posting, job.title), ', ' + job.company]],
        ['Applicant', [link(person, applicant.email), ' ', badge(applicant.role, true)]],
        ['Applied', date(application.createdAt)], ['Updated', date(application.updatedAt)],
        ['Cover letter', el('p', { class: 'content' }, application.coverLetter || 'None')]
      ])), card(el('h2', {}, 'Update'), update))];
}
