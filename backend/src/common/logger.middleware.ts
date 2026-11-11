import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

// Writes one line per request on the terminal, after the response is sent:
//
//   10:20:30 POST /api/users 201 18 ms
//   time     method route    status duration
//
// A middleware runs before the controller, so it cannot know the status code
// yet. It starts a timer, calls next(), and prints when the response is
// finished (the "finish" event). Registered for every route in AppModule.
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const ms = Math.round(Number(process.hrtime.bigint() - start) / 1e6);
      const time = new Date().toTimeString().slice(0, 8); // HH:MM:SS
      const route = req.originalUrl.split('?')[0]; // no query string, so ?_method=DELETE stays out
      console.log(`${time} ${req.method} ${route} ${res.statusCode} ${ms} ms`);
    });

    next();
  }
}
