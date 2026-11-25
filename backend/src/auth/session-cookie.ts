// The login cookie. It holds a random token; the sessions table holds its hash.
import type { Request, Response } from 'express';

export const SESSION_COOKIE = 'ats_session';
export const SESSION_DAYS = 7;

// Express has no cookie parser built in, so read the Cookie header by hand:
//   "theme=dark; ats_session=abc123" → "abc123"
export function readSessionToken(req: Request): string | undefined {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === SESSION_COOKIE) return decodeURIComponent(value.join('='));
  }
  return undefined;
}

// HttpOnly: page JavaScript cannot read it. SameSite=Lax: another site cannot
// send it with a form POST (protects login and logout from cross-site requests).
// Add `secure: true` once the site is served over HTTPS (week 13).
export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: 'lax', path: '/' });
}
