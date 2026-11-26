import { currentUser, el } from './workspace-ui.js';
import { editRecord, listRecords, showRecord } from './workspace-records.js';
import { listApplications, postingApplications, showApplication } from './workspace-applications.js';
import { healthPage } from './health-status.js';
import { registerPage } from './workspace-register.js';
import { loginPage } from './workspace-login.js';
import { adminPage } from './workspace-admin.js';
import { accountPage } from './workspace-account.js';

const { t, translate } = window.i18n; // interface language, see i18n.js

const main = document.querySelector('#main');
const path = location.pathname.replace(/\/+$/, '');
const [section, id, detail] = path.slice(1).split('/');
// The header links are the same on every page (also on the landing); mark the current one.
const sectionLink = Array.from(document.querySelectorAll('#workspace-nav a, a.bar-action')).find(a => a.pathname === '/' + section);
sectionLink?.setAttribute('aria-current', 'page');

function notFound() {
  location.replace('/404?from=' + encodeURIComponent(location.pathname));
}

async function pageContent() {
  if (path === '/platform' || path === '/about') {
    const page = document.getElementById(section + '-page').content.cloneNode(true);
    translate(page);
    // A card with data-roles="ADMIN" is only for those roles (the same rule as the API)
    const user = await currentUser();
    page.querySelectorAll('[data-roles]').forEach(node => {
      if (!user || !node.dataset.roles.split(' ').includes(user.role)) node.remove();
    });
    return page;
  }
  if (path === '/api/health') return healthPage();
  if (path === '/register') return registerPage();
  if (path === '/login') return loginPage();
  if (path === '/admin') return adminPage();
  if (path === '/account') return accountPage();
  if (section === 'job-applications') return id ? showApplication(id) : listApplications();
  if (!['users', 'announcements', 'job-postings'].includes(section)) return notFound();
  if (!id) return listRecords(section);
  if (id === 'create') return editRecord(section);
  if (detail === 'edit') return editRecord(section, id);
  if (detail === 'applications' && section === 'job-postings') return postingApplications(id);
  return showRecord(section, id);
}

async function render() {
  main.setAttribute('aria-busy', 'true');
  try {
    const content = await pageContent();
    if (!content) return;
    const notice = el('p', { id: 'action-error', class: 'form-error', role: 'alert', tabindex: '-1', hidden: true });
    main.replaceChildren(notice, ...[content].flat());
    document.title = main.querySelector('h1').textContent + ' — ' + t('IU ATS');
  } catch (error) {
    if (error.status === 404) return notFound();
    const retry = el('button', { class: 'btn', type: 'button' }, t('Try again'));
    retry.addEventListener('click', () => {
      retry.disabled = true;
      retry.textContent = t('Loading…');
      render();
    });
    document.title = t('Unable to load page') + ' — ' + t('IU ATS');
    main.replaceChildren(el('section', { class: 'card narrow stack' },
      el('h1', {}, t('Unable to load page')), el('p', { role: 'alert' }, error.message), el('div', {}, retry)));
  } finally {
    main.removeAttribute('aria-busy');
  }
}

render();
// History restores can otherwise show records cached before a form submission.
window.addEventListener('pageshow', event => { if (event.persisted && path !== '/api/health') render(); });
