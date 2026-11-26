import { api, badge, buttonLink, details, el, link } from './workspace-ui.js';

// The sign-up page at /register. It sends JSON to POST /api/register, the same
// route Postman uses. Admin accounts are never self-registered (DDD 4.1).
const { t } = window.i18n; // interface language, see i18n.js
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
    el('legend', {}, t('I am joining as')),
    roles.map(([value, title, text]) => el('label', { class: 'choice' },
      el('input', { type: 'radio', name: 'role', value, required: true }),
      el('span', {}, el('strong', {}, t(title)), el('span', { class: 'hint' }, t(text))))));
}

function alumniFields() {
  return el('fieldset', { class: 'stack', id: 'alumni-fields', hidden: true, disabled: true },
    el('legend', {}, t('Graduate details')),
    input(t('Full name'), 'fullName', { autocomplete: 'name', required: true, minlength: 2, maxlength: 100 }),
    input(t('Graduation year'), 'graduationYear',
      { type: 'number', inputmode: 'numeric', min: firstYear, max: lastYear, required: true },
      t('From {first} to {last}.', { first: firstYear, last: lastYear })),
    input(t('City (optional)'), 'city', { autocomplete: 'address-level2', maxlength: 60 },
      t('City only, no street address.')));
}

// Only the fields the API expects for the chosen role are sent.
function formData(formNode) {
  const values = new FormData(formNode);
  const data = {
    email: values.get('email'),
    role: values.get('role'),
    password: values.get('password'),
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
  const rows = [[t('E-mail'), user.email], [t('Joining as'), badge(t(role), true)], [t('Account'), badge(user.status)]];
  if (alumniProfile) {
    rows.push([t('Name'), alumniProfile.fullName], [t('Graduated'), alumniProfile.graduationYear]);
    if (alumniProfile.city) rows.push([t('City'), alumniProfile.city]);
  }
  const title = el('h2', { tabindex: '-1' }, t('Welcome to the network'));
  const panel = el('div', { class: 'stack', role: 'status' }, title,
    el('p', {}, t('Your account is saved and waiting for approval by an ATS administrator. ' +
      'You can log in once it is approved.')),
    details(rows),
    el('div', { class: 'form-actions' }, buttonLink('/job-postings', t('Browse opportunities')),
      buttonLink('/login', t('Log in'), true)));
  return { panel, title };
}

function registerForm(container) {
  const errorBox = el('p', { class: 'form-error', role: 'alert', hidden: true, tabindex: '-1' });
  const alumni = alumniFields();
  const submit = el('button', { class: 'btn', type: 'submit' }, t('Create account'));
  const formNode = el('form', { class: 'stack' }, errorBox, roleChoices(),
    input(t('E-mail'), 'email', { type: 'email', autocomplete: 'email', required: true },
      t('Your account is created with this address.')),
    input(t('Password'), 'password', { type: 'password', autocomplete: 'new-password', required: true, minlength: 8, maxlength: 128 },
      t('At least 8 characters.')),
    input(t('Repeat password'), 'passwordRepeat', { type: 'password', autocomplete: 'new-password', required: true }),
    alumni,
    el('label', { class: 'check' },
      el('input', { type: 'checkbox', name: 'acceptPrivacy', required: true }),
      el('span', {}, t('I accept the privacy notice: ATS stores my e-mail and role and, for graduates, ' +
        'my name, graduation year and city. No ID number, birth date or home address is collected.'))),
    el('div', { class: 'form-actions' }, submit),
    el('p', { class: 'meta' }, t('Already registered?') + ' ', link('/login', t('Log in'))));

  // The two passwords must match before the browser lets the form submit.
  const { password, passwordRepeat } = formNode.elements;
  const checkRepeat = () => passwordRepeat.setCustomValidity(
    passwordRepeat.value && passwordRepeat.value !== password.value ? t('The passwords do not match.') : '');
  password.addEventListener('input', checkRepeat);
  passwordRepeat.addEventListener('input', checkRepeat);

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
        ? error.message + '. ' + t('Use another e-mail address.')
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
  container.append(el('h2', { id: 'register-form-title' }, t('Create your account')), registerForm(container));
  const title = el('h1', {}, t('Join the alumni') + ' ', el('em', {}, t('network.')));
  return el('div', { class: 'register' },
    el('div', { class: 'register-intro' },
      el('p', { class: 'kicker' }, t('Join İÜ ATS')), title,
      el('p', {}, t('Students, graduates and staff of İstanbul University share announcements, ' +
        'career opportunities and the people behind them.')),
      el('img', { src: '/media/milestone.webp', width: 1600, height: 1000, alt: t('Graduates in gowns throwing their caps into the air') })),
    container);
}
