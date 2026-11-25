// Which requests need a logged-in user, and which need an ADMIN (DDD.md 4.12).
// AuthMiddleware asks these functions on every request. Rule of thumb: reading
// news and job openings is public; changing anything, or seeing personal data
// (users, applications), needs a login; managing accounts needs the ADMIN role.

interface Route {
  methods: string[];
  path: RegExp;
}

const WRITE = ['POST', 'PUT', 'PATCH', 'DELETE'];

// JSON API routes that work without logging in. Every other /api route needs a login.
const PUBLIC_API: Route[] = [
  // read announcements and job postings (":id" is any text, so a bad id still gets its 400)
  { methods: ['GET', 'HEAD'], path: /^\/api\/(announcements|job-postings)(\/[^/]+)?$/ },
  { methods: ['GET', 'HEAD'], path: /^\/api\/health$/ },
  { methods: ['GET', 'HEAD'], path: /^\/api\/swagger/ },
  // the account routes themselves
  { methods: ['POST'], path: /^\/api\/(register|auth\/login|auth\/logout)$/ },
  { methods: ['GET'], path: /^\/api\/auth\/me$/ },
];

// JSON API routes for ADMIN accounts only (task 5): the admin panel's data, and
// every change to a user (create, edit, approve, change role, delete).
const ADMIN_API: Route[] = [
  { methods: ['GET', 'HEAD'], path: /^\/api\/admin(\/|$)/ },
  { methods: WRITE, path: /^\/api\/users(\/[^/]+)?$/ },
];

// Browser pages that need a login; a visitor is sent to /login first.
// (/admin opens for any login; its data comes from ADMIN_API, so others see "only admins".)
const PRIVATE_PAGES: RegExp[] = [
  /^\/(users|job-applications|admin|account)(\/|$)/, // personal data, the admin panel and "My account"
  /\/(create|edit)$/, // forms that change records
  /^\/job-postings\/[^/]+\/applications$/, // a posting's applicants
];

const matches = (routes: Route[], method: string, path: string): boolean =>
  routes.some((route) => route.methods.includes(method) && route.path.test(path));

export function apiNeedsLogin(method: string, path: string): boolean {
  if (method === 'OPTIONS') return false; // CORS preflight, carries no data
  return !matches(PUBLIC_API, method, path);
}

export function apiNeedsAdmin(method: string, path: string): boolean {
  return matches(ADMIN_API, method, path);
}

export function pageNeedsLogin(path: string): boolean {
  return PRIVATE_PAGES.some((pattern) => pattern.test(path));
}
