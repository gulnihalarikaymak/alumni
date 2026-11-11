import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Request, Response } from 'express';
import { STATUS_CODES } from 'http';
import { wantsHtml } from './wants-html';

const MESSAGE = 'Something went wrong on our side. Please try again later.';

// The 5xx Guardian: every server error leaves the app through here.
//
// @Catch() with no argument catches everything: a bug (TypeError), a database
// failure (Prisma error), anything nobody planned for. Those would otherwise
// end as Nest's bare 500, and a raw error message can leak table names, SQL
// or file paths. So the details only go to the terminal (console.error), and
// the client gets a short fixed message.
//
// Errors below 500 (400, 404, 409 ...) are not its business: it hands them to
// Nest's default handling (BaseExceptionFilter). NotFoundFilter, registered
// after this one in AppModule, takes the 404s before they get here.
@Catch()
export class ServerErrorFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    if (status < 500) return super.catch(exception, host);

    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const path = req.originalUrl.split('?')[0];

    // The full error, with its stack, stays on the server
    console.error(`[${status}] ${req.method} ${path}`, exception);

    if (res.headersSent) return; // too late to change the answer
    if (wantsHtml(req)) {
      res.status(status).render('server-error', { title: 'Something went wrong', status, message: MESSAGE });
    } else {
      res.status(status).json({ statusCode: status, error: STATUS_CODES[status], message: MESSAGE, path });
    }
  }
}
