import type { Response } from 'express';

// An invalid web request (unknown URL, a record that does not exist, a bad id)
// is sent to the one generic 404 page, /404, with a 303 redirect. The page gets
// the path that was asked for in "?from=", so it can say what was not found.
//
// "reason" is only for logs/error.logs, where the redirect shows as a 303 line
// with this text. LoggerMiddleware reads it from res.locals.
export function redirectToNotFound(res: Response, reason?: string): void {
  const path = res.req.originalUrl.split('?')[0];
  res.locals.errorReason = reason ?? `Nothing found at ${path}`;
  res.redirect(303, `/404?from=${encodeURIComponent(path)}`);
}
