import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModel } from './auth.model';
import { AuthService } from './auth.service';

// The shared core of the auth feature: rules (AuthService) and data (AuthModel).
// No controllers and no URL. ApiAuthModule (the /api/auth routes) and AppModule
// (for AuthMiddleware, which runs on every request) both import it.
@Module({
  imports: [PrismaModule],
  providers: [AuthService, AuthModel],
  exports: [AuthService],
})
export class AuthModule {}
