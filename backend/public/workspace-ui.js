// Create nodes with browser DOM APIs. Strings from the API always become text nodes.
export function el(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined || value === null || value === false) continue;
    node.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of children.flat(Infinity)) {
    if (child !== undefined && child !== null) node.append(child);
  }
  return node;
}

export async function api(path, method = 'GET', data) {
  const headers = { Accept: 'application/json' };
  const options = { method, headers, cache: 'no-store' };
  if (data !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }
  let response;
  try {
    response = await fetch('/api' + path, options);
  } catch {
    throw new Error('The service could not be reached. Check your connection and try again.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const parts = Array.isArray(body.message) ? body.message : [body.message];
    const error = new Error(parts.filter(Boolean).join(' · ') || 'The request could not be completed. Please try again.');
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

export const link = (href, label, style) => el('a', { href, class: style }, label);
export const buttonLink = (href, label, quiet = false) => link(href, label, quiet ? 'btn quiet' : 'btn');
export const back = (href, label) => link(href, label, 'back');
export const card = (...children) => el('section', { class: 'card' }, ...children);
export const actions = (...children) => el('div', { class: 'actions' }, ...children);
export const badge = (value, role = false) => el('span', { class: 'badge ' + (role ? 'role' : value) }, value);

export function heading(title, subtitle, action) {
  return el('header', { class: 'page-head' },
    el('div', {}, el('h1', {}, title), subtitle ? el('p', { class: 'sub' }, subtitle) : null), action);
}

export function date(value, dayOnly = false) {
  const options = { dateStyle: 'medium', timeZone: dayOnly ? 'UTC' : 'Europe/Istanbul' };
  if (!dayOnly) options.timeStyle = 'short';
  return el('time', { datetime: value }, new Intl.DateTimeFormat('en-GB', options).format(new Date(value)));
}

export function details(rows) {
  return el('dl', { class: 'record' }, rows.map(([name, value]) => [el('dt', {}, name), el('dd', {}, value)]));
}

export function table(caption, labels, rows) {
  return el('div', { class: 'card flush' },
    el('div', { class: 'table-wrap', role: 'region', 'aria-label': caption, tabindex: '0' },
      el('table', {}, el('caption', { class: 'sr-only' }, caption),
        el('thead', {}, el('tr', {}, labels.map(label => el('th', { scope: 'col' }, label)))),
        el('tbody', {}, rows.map(cells => el('tr', {}, cells.map(cell => el('td', {}, cell))))))));
}

export function empty(message, action) {
  return el('div', { class: 'card empty' }, el('p', {}, message), action);
}

export function field(label, name, value = '', options = {}) {
  const { choices, multiline, ...attributes } = options;
  let control;
  if (choices) {
    const blank = el('option', { value: '', disabled: true }, 'Choose…');
    control = el('select', { name, ...attributes }, blank, choices.map(item => {
      const [key, text] = Array.isArray(item) ? item : [item, item];
      return el('option', { value: key }, text);
    }));
  } else {
    control = multiline
      ? el('textarea', { name, rows: 5, ...attributes })
      : el('input', { name, type: 'text', ...attributes });
  }
  control.value = value ?? '';
  return el('label', {}, label, control);
}

export function form({ path, method, fields, submit, cancel, onSaved }) {
  const errorBox = el('p', { class: 'form-error', role: 'alert', hidden: true, tabindex: '-1' });
  const save = el('button', { class: 'btn', type: 'submit' }, submit);
  const formNode = el('form', { class: 'stack' }, errorBox, fields,
    el('div', { class: 'form-actions' }, save, cancel ? buttonLink(cancel, 'Cancel', true) : null));
  formNode.addEventListener('submit', async event => {
    event.preventDefault();
    if (save.disabled) return;
    save.disabled = true;
    formNode.setAttribute('aria-busy', 'true');
    errorBox.hidden = true;
    try {
      const data = Object.fromEntries(new FormData(formNode));
      if ('applicantId' in data) data.applicantId = Number(data.applicantId);
      const result = await api(path, method, data);
      location.assign(onSaved(result));
    } catch (error) {
      if (error.status === 404 && method !== 'POST') {
        location.replace('/404?from=' + encodeURIComponent(path));
        return;
      }
      errorBox.textContent = error.message;
      errorBox.hidden = false;
      errorBox.focus();
      save.disabled = false;
      formNode.removeAttribute('aria-busy');
    }
  });
  return formNode;
}

export function deleteButton(path, destination, prompt, label = 'Delete') {
  const button = el('button', { class: 'link danger', type: 'button' }, label);
  button.addEventListener('click', async () => {
    if (button.disabled || !window.confirm(prompt)) return;
    button.disabled = true;
    try {
      await api(path, 'DELETE');
      location.assign(destination);
    } catch (error) {
      if (error.status === 404) {
        location.replace('/404?from=' + encodeURIComponent(path));
        return;
      }
      const notice = document.querySelector('#action-error');
      notice.textContent = error.message;
      notice.hidden = false;
      notice.focus();
      button.disabled = false;
    }
  });
  return button;
}

export function dataLink(path) {
  return el('p', { class: 'foot' }, link('/api' + path, 'View JSON'));
}
