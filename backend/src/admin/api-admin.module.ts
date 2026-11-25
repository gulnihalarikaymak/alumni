import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminModel } from './admin.model';
import { ApiAdminController } from './api-admin.controller';

// The admin panel's data. Mounted at /api/admin in app.routes.ts; ADMIN only.
@Module({
  imports: [PrismaModule],
  controllers: [ApiAdminController],
  providers: [AdminModel],
})
export class ApiAdminModule {}
