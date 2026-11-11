import type { Request } from 'express';

// A browser outside /api gets an HTML page; curl, Postman and the API get JSON.
// Shared by the 404 and 5xx Guardians so they decide the same way.
export function wantsHtml(req: Request): boolean {
  const path = req.originalUrl.split('?')[0];
  return !path.startsWith('/api') && (req.headers.accept || '').includes('text/html');
}
