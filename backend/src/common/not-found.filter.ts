import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';

// The 404 Guardian: every 404 leaves the app through here, with a reason.
//
// Two kinds of 404 reach it:
//   - a service threw NotFoundException ("User 5 not found"), and
//   - no route matches the URL at all (Nest itself throws "Cannot GET /nope").
//
// A middleware runs before the controllers, so it cannot see a 404 that the
// router or a service raises later. Catching the exception is the Nest way.
//
// Who gets what: a browser (Accept: text/html) outside /api gets the
// "Page not found" page; everyone else (curl, Postman, the API) gets JSON.
@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const path = req.originalUrl.split('?')[0];
    const reason = reasonOf(exception.message, req.method, path);
    const wantsHtml = !path.startsWith('/api') && (req.headers.accept || '').includes('text/html');

    if (wantsHtml) {
      res.status(404).render('not-found', { title: 'Page not found', reason });
    } else {
      res.status(404).json({ statusCode: 404, error: 'Not Found', message: reason, path });
    }
  }
}

// A service's message already says why ("User 5 not found"). Nest's own message for
// an unknown URL ("Cannot GET /nope") is reworded so it reads as a reason too.
function reasonOf(message: string, method: string, path: string): string {
  return message.startsWith('Cannot ') ? `No route matches ${method} ${path}` : message;
}
