import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { writeErrorLog } from './error-log';

// Writes one line per request on the terminal, after the response is sent:
//
//   10:20:30 POST /api/users 201 18 ms
//   time     method route    status duration
//
// A middleware runs before the controller, so it cannot know the status code
// yet. It starts a timer, calls next(), and prints when the response is
// finished (the "finish" event). Registered for every route in AppModule.
//
// A failed request (status 400 or more, or a redirect to the 404 page) is also
// added to logs/error.logs, with the date and the reason. The reason is not known
// here: the 404 and 5xx Guardians leave it in res.locals (errorReason, and
// errorStack for a 5xx).
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const ms = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
      const now = new Date();
      const route = req.originalUrl.split('?')[0]; // no query string, so ?_method=DELETE stays out
      console.log(`${now.toTimeString().slice(0, 8)} ${req.method} ${route} ${res.statusCode} ${ms} ms`);

      // a redirect to /404 (status 303) also carries a reason, so it is logged too
      if (res.statusCode >= 400 || res.locals.errorReason) {
        const reason = res.locals.errorReason ? `  ${res.locals.errorReason}` : '';
        const stack = res.locals.errorStack ? `\n${res.locals.errorStack}` : '';
        writeErrorLog(`${now.toISOString()} ${req.method} ${route} ${res.statusCode} ${ms} ms${reason}${stack}`);
      }
    });

    next();
  }
}
