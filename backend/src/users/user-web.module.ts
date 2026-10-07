import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersModule } from './users.module';

// Web pages for users. Mounted at /users in app.routes.ts.
@Module({
  imports: [UsersModule],
  controllers: [UserController],
})
export class UserWebModule {}
