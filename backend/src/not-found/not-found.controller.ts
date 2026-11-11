import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { NotFoundService } from './not-found.service';

// The generic 404 page: GET /404 (path set in app.routes.ts).
// Invalid web requests are redirected here (see common/redirect-to-404.ts).
// The page itself answers with status 404, so it is never mistaken for a normal page.
@ApiExcludeController()
@Controller()
export class NotFoundController {
  constructor(private readonly notFoundService: NotFoundService) {}

  @Get()
  show(@Query('from') from: unknown, @Res() res: Response): void {
    res.status(404).render('not-found', {
      title: 'Page not found',
      reason: this.notFoundService.reasonFor(from),
    });
  }
}
