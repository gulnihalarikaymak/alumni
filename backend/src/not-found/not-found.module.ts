import { Module } from '@nestjs/common';
import { NotFoundController } from './not-found.controller';
import { NotFoundService } from './not-found.service';

// The generic 404 page. Mounted at /404 in app.routes.ts.
@Module({
  controllers: [NotFoundController],
  providers: [NotFoundService],
})
export class NotFoundModule {}
