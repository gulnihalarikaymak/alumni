// Which requests need a logged-in user (DDD.md 4.12). AuthMiddleware asks these
// two functions on every request. Rule of thumb: reading news and job openings is
// public; changing anything, or seeing personal data (users, applications), is not.

interface PublicRoute {
  methods: string[];
  path: RegExp;
}

// JSON API routes that work without logging in. Every other /api route needs a login.
const PUBLIC_API: PublicRoute[] = [
  // read announcements and job postings (":id" is any text, so a bad id still gets its 400)
  { methods: ['GET', 'HEAD'], path: /^\/api\/(announcements|job-postings)(\/[^/]+)?$/ },
  { methods: ['GET', 'HEAD'], path: /^\/api\/health$/ },
  { methods: ['GET', 'HEAD'], path: /^\/api\/swagger/ },
  // the account routes themselves
  { methods: ['POST'], path: /^\/api\/(register|auth\/login|auth\/logout)$/ },
  { methods: ['GET'], path: /^\/api\/auth\/me$/ },
];

// Browser pages that need a login; a visitor is sent to /login first.
const PRIVATE_PAGES: RegExp[] = [
  /^\/(users|job-applications)(\/|$)/, // personal data: e-mails and applications
  /\/(create|edit)$/, // forms that change records
  /^\/job-postings\/[^/]+\/applications$/, // a posting's applicants
];

export function apiNeedsLogin(method: string, path: string): boolean {
  if (method === 'OPTIONS') return false; // CORS preflight, carries no data
  return !PUBLIC_API.some((route) => route.methods.includes(method) && route.path.test(path));
}

export function pageNeedsLogin(path: string): boolean {
  return PRIVATE_PAGES.some((pattern) => pattern.test(path));
}
