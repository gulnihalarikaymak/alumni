import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './user.model';

// The shared core of the users feature: rules (UsersService) and data
// (UserModel). It has no controllers and no URL. UserWebModule and
// ApiUserModule both import it, and Nest creates it once, so the web pages
// and the API work on the same in-memory users.
@Module({
  providers: [UsersService, UserModel],
  exports: [UsersService],
})
export class UsersModule {}
