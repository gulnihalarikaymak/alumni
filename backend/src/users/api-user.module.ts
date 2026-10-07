import { Module } from '@nestjs/common';
import { ApiUserController } from './api-user.controller';
import { UsersModule } from './users.module';

// JSON API for users. Mounted at /api/users in app.routes.ts.
@Module({
  imports: [UsersModule],
  controllers: [ApiUserController],
})
export class ApiUserModule {}
