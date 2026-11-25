import { api, badge, buttonLink, details, el } from './workspace-ui.js';

// The sign-up page at /register. It sends JSON to POST /api/register, the same
// route Postman uses. Admin accounts are never self-registered (DDD 4.1).
const roles = [
  ['STUDENT', 'Student', 'I am studying at İstanbul University.'],
  ['ALUMNI', 'Graduate', 'I completed a degree at İstanbul University.'],
  ['STAFF', 'Staff', 'I work at the university, for example at the career centre.']
];
const firstYear = 1950;
const lastYear = new Date().getFullYear();

// A text input with its label and an optional hint read by screen readers.
function input(label, name, attributes = {}, hint) {
  const hintId = hint ? name + '-hint' : undefined;
  return el('label', {}, label,
    hint ? el('span', { class: 'hint', id: hintId }, hint) : null,
    el('input', { name, type: 'text', 'aria-describedby': hintId, ...attributes }));
}

function roleChoices() {
  return el('fieldset', { class: 'choices' },
    el('legend', {}, 'I am joining as'),
    roles.map(([value, title, text]) => el('label', { class: 'choice' },
      el('input', { type: 'radio', name: 'role', value, required: true }),
      el('span', {}, el('strong', {}, title), el('span', { class: 'hint' }, text)))));
}

function alumniFields() {
  return el('fieldset', { class: 'stack', id: 'alumni-fields', hidden: true, disabled: true },
    el('legend', {}, 'Graduate details'),
    input('Full name', 'fullName', { autocomplete: 'name', required: true, minlength: 2, maxlength: 100 }),
    input('Graduation year', 'graduationYear',
      { type: 'number', inputmode: 'numeric', min: firstYear, max: lastYear, required: true },
      `From ${firstYear} to ${lastYear}.`),
    input('City (optional)', 'city', { autocomplete: 'address-level2', maxlength: 60 },
      'City only, no street address.'));
}

// Only the fields the API expects for the chosen role are sent.
function formData(formNode) {
  const values = new FormData(formNode);
  const data = {
    email: values.get('email'),
    role: values.get('role'),
    acceptPrivacy: formNode.elements.acceptPrivacy.checked
  };
  if (data.role === 'ALUMNI') {
    data.fullName = values.get('fullName');
    data.graduationYear = Number(values.get('graduationYear'));
    if (values.get('city')) data.city = values.get('city');
  }
  return data;
}

function welcome({ user, alumniProfile }) {
  const role = roles.find(([value]) => value === user.role)[1];
  const rows = [['E-mail', user.email], ['Joining as', badge(role, true)], ['Account', badge(user.status)]];
  if (alumniProfile) {
    rows.push(['Name', alumniProfile.fullName], ['Graduated', alumniProfile.graduationYear]);
    if (alumniProfile.city) rows.push(['City', alumniProfile.city]);
  }
  const title = el('h2', { tabindex: '-1' }, 'Welcome to the network');
  const panel = el('div', { class: 'stack', role: 'status' }, title,
    el('p', {}, 'Your account is saved and waiting for approval by an ATS administrator. ' +
      'Approval and sign-in are planned for a later release.'),
    details(rows),
    el('div', { class: 'form-actions' }, buttonLink('/job-postings', 'Browse opportunities'),
      buttonLink('/platform', 'Enter the workspace', true)));
  return { panel, title };
}

function registerForm(container) {
  const errorBox = el('p', { class: 'form-error', role: 'alert', hidden: true, tabindex: '-1' });
  const alumni = alumniFields();
  const submit = el('button', { class: 'btn', type: 'submit' }, 'Create account');
  const formNode = el('form', { class: 'stack' }, errorBox, roleChoices(),
    input('E-mail', 'email', { type: 'email', autocomplete: 'email', required: true },
      'Your account is created with this address.'),
    alumni,
    el('label', { class: 'check' },
      el('input', { type: 'checkbox', name: 'acceptPrivacy', required: true }),
      el('span', {}, 'I accept the privacy notice: ATS stores my e-mail and role and, for graduates, ' +
        'my name, graduation year and city. No ID number, birth date or home address is collected.')),
    el('div', { class: 'form-actions' }, submit));

  // The graduate fields appear, and are sent, only for the Graduate role.
  formNode.addEventListener('change', event => {
    if (event.target.name !== 'role') return;
    const isAlumni = event.target.value === 'ALUMNI';
    alumni.hidden = !isAlumni;
    alumni.disabled = !isAlumni;
  });

  formNode.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    formNode.setAttribute('aria-busy', 'true');
    errorBox.hidden = true;
    try {
      const { panel, title } = welcome(await api('/register', 'POST', formData(formNode)));
      container.replaceChildren(panel);
      title.focus();
    } catch (error) {
      // The typed values stay in the form so the visitor can correct them.
      errorBox.textContent = error.status === 409
        ? error.message + '. Use another e-mail address.'
        : error.message;
      errorBox.hidden = false;
      errorBox.focus();
      submit.disabled = false;
      formNode.removeAttribute('aria-busy');
    }
  });
  return formNode;
}

export function registerPage() {
  const container = el('section', { class: 'card', 'aria-labelledby': 'register-form-title' });
  container.append(el('h2', { id: 'register-form-title' }, 'Create your account'), registerForm(container));
  const title = el('h1', {}, 'Join the alumni ', el('em', {}, 'network.'));
  return el('div', { class: 'register' },
    el('div', { class: 'register-intro' },
      el('p', { class: 'kicker' }, 'Join ATS İÜ'), title,
      el('p', {}, 'Students, graduates and staff of İstanbul University share announcements, ' +
        'career opportunities and the people behind them.'),
      el('img', { src: '/media/milestone.webp', width: 1600, height: 1000, alt: 'Graduates in gowns throwing their caps into the air' })),
    container);
}
