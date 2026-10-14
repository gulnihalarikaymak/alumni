import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';
import { UserModel } from './user.model';

// The shared core of the users feature: rules (UsersService) and data
// (UserModel). It has no controllers and no URL. UserWebModule and
// ApiUserModule both import it, and Nest creates it once, so the web pages
// and the API work on the same users. PrismaModule gives the model the database.
@Module({
  imports: [PrismaModule],
  providers: [UsersService, UserModel],
  exports: [UsersService],
})
export class UsersModule {}
