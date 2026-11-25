import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApiAuthController } from './api-auth.controller';
import { AuthModel } from './auth.model';
import { AuthService } from './auth.service';

// Login and logout: rules (service), data (model) and the JSON routes.
// Mounted at /api/auth in app.routes.ts.
@Module({
  imports: [PrismaModule],
  controllers: [ApiAuthController],
  providers: [AuthService, AuthModel],
})
export class ApiAuthModule {}
