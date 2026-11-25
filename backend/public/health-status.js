import { api, card, date, details, el, link } from './workspace-ui.js';

const { t } = window.i18n; // interface language, see i18n.js
const endpoint = '/health?format=json';

export async function healthPage() {
  const payload = await api(endpoint);
  const status = el('span', { class: 'badge ACTIVE', id: 'service-status', role: 'status' }, payload.status);
  const checked = el('span', {});
  const json = el('pre', { class: 'health-json', id: 'json' });
  const fields = details([]);
  function update(data) {
    fields.replaceChildren(...details([
      [t('Service'), data.service], [t('Version'), data.version], [t('Uptime'), data.uptimeSeconds + ' s'], [t('Environment'), data.environment]
    ]).childNodes);
    status.className = 'badge ACTIVE';
    if (status.textContent !== data.status) status.textContent = data.status;
    checked.replaceChildren(date(data.timestamp));
    json.textContent = JSON.stringify(data, null, 2);
  }
  update(payload);
  // Schedule the next check after the previous request settles so slow responses cannot overlap.
  let timer;
  let stopped = false;
  let pending = false;
  async function refresh() {
    if (pending || stopped) return;
    pending = true;
    if (!document.hidden) {
      try {
        update(await api(endpoint));
      } catch {
        status.className = 'badge REJECTED';
        status.textContent = t('Unavailable');
      }
    }
    pending = false;
    if (!stopped) timer = setTimeout(refresh, 5000);
  }
  timer = setTimeout(refresh, 5000);
  window.addEventListener('pagehide', () => { stopped = true; clearTimeout(timer); });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { stopped = false; refresh(); }
  });
  return el('section', { class: 'narrow' },
    el('header', { class: 'page-head' }, el('div', {}, el('p', { class: 'kicker' }, t('System status')),
      el('h1', {}, t('Service health'))), status),
    card(fields, el('h2', {}, t('JSON response')), json, link('/api' + endpoint, t('Raw JSON')), el('p', { class: 'meta' }, t('Last response') + ' ', checked)));
}
