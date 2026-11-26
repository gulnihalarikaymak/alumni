// The header menu for each role (task 6, DDD.md 4.13). GET /api/auth/me returns
// menuFor(user) and account.js draws the menu from it, on the landing and on
// every workspace page. The menu only hides links: what a user may actually
// open is still decided by AuthMiddleware (access-rules.ts).
import type { Role } from '../users/user.model';

export interface MenuItem {
  label: string; // English text; the browser translates it (i18n.js)
  href: string;
}

// "VISITOR" means nobody is logged in.
type Viewer = Role | 'VISITOR';

const EVERYONE: Viewer[] = ['VISITOR', 'STUDENT', 'ALUMNI', 'STAFF', 'ADMIN'];
const LOGGED_IN: Viewer[] = ['STUDENT', 'ALUMNI', 'STAFF', 'ADMIN'];

// In menu order. A visitor sees only the public pages; job applications need a
// login; the user list and the admin panel are for account managers (ADMIN).
const MENU: { item: MenuItem; roles: Viewer[] }[] = [
  { item: { label: 'Home', href: '/' }, roles: EVERYONE },
  { item: { label: 'Workspace', href: '/platform' }, roles: LOGGED_IN }, // needs a login (access-rules.ts)
  { item: { label: 'Opportunities', href: '/job-postings' }, roles: EVERYONE },
  { item: { label: 'Announcements', href: '/announcements' }, roles: EVERYONE },
  { item: { label: 'Applications', href: '/job-applications' }, roles: LOGGED_IN },
  { item: { label: 'Users', href: '/users' }, roles: ['ADMIN'] },
  { item: { label: 'Admin', href: '/admin' }, roles: ['ADMIN'] },
  { item: { label: 'My account', href: '/account' }, roles: LOGGED_IN }, // task 7
  { item: { label: 'About', href: '/about' }, roles: EVERYONE },
];

export function menuFor(user: { role: Role } | null): MenuItem[] {
  const viewer: Viewer = user ? user.role : 'VISITOR';
  return MENU.filter((entry) => entry.roles.includes(viewer)).map((entry) => entry.item);
}
