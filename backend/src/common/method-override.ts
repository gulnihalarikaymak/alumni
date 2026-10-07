import type { NextFunction, Request, Response } from 'express';

const OVERRIDABLE = ['PUT', 'PATCH', 'DELETE'];

// HTML forms can only send GET and POST. A form that means PUT, PATCH or
// DELETE posts to "...?_method=PUT" (or PATCH, DELETE), and this middleware
// changes the request's method before Nest picks a route. The controller can
// then use @Put, @Patch and @Delete for web pages, just like the JSON API.
// Only POST is ever overridden, so a link (GET) can never delete anything.
export function methodOverride(req: Request, _res: Response, next: NextFunction): void {
  const wanted = String(req.query._method ?? '').toUpperCase();
  if (req.method === 'POST' && OVERRIDABLE.includes(wanted)) {
    req.method = wanted;
  }
  next();
}
