import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { User } from '../users/user.model';
import { apiNeedsLogin, pageNeedsLogin } from './access-rules';
import { AuthService } from './auth.service';
import { readSessionToken } from './session-cookie';

// Every request can now carry the logged-in user: req.user (null for a visitor).
declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null;
  }
}

// The auth middleware runs on every request, after the logger, before the controllers:
//   1. it reads the ats_session cookie and puts the logged-in user on req.user;
//   2. if the route needs a login (access-rules.ts) and nobody is logged in, it stops
//      the request: 401 JSON for the API, a redirect to /login for a browser page.
// Registered for every route in AppModule.
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      req.user = await this.authService.currentUser(readSessionToken(req));
    } catch (error) {
      return next(error); // a database failure goes to the 5xx Guardian
    }
    if (req.user) return next();

    const path = req.originalUrl.split('?')[0];
    if (path.startsWith('/api')) {
      if (!apiNeedsLogin(req.method, path)) return next();
      const message = 'Log in to use this route';
      res.locals.errorReason = `${message} (no valid session)`; // for logs/error.logs
      res.status(401).json({ statusCode: 401, error: 'Unauthorized', message, path });
      return;
    }

    if (!pageNeedsLogin(path)) return next();
    // After logging in, the login page sends the visitor back to this page
    res.locals.errorReason = 'Page needs a login: redirected to /login';
    res.redirect(303, `/login?next=${encodeURIComponent(path)}`);
  }
}
