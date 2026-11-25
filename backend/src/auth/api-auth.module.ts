import { Module } from '@nestjs/common';
import { ApiAuthController } from './api-auth.controller';
import { AuthModule } from './auth.module';

// JSON routes for login and logout. Mounted at /api/auth in app.routes.ts.
@Module({
  imports: [AuthModule],
  controllers: [ApiAuthController],
})
export class ApiAuthModule {}
