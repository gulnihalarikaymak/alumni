import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AccountModel } from './account.model';
import { AccountService } from './account.service';
import { ApiAccountController } from './api-account.controller';

// The logged-in user's own page. Mounted at /api/account in app.routes.ts; needs a login.
@Module({
  imports: [PrismaModule],
  controllers: [ApiAccountController],
  providers: [AccountService, AccountModel],
})
export class ApiAccountModule {}
