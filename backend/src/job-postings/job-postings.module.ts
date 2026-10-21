import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { JobPostingsService } from './job-postings.service';
import { JobPostingModel } from './job-posting.model';

// Shared core of the job-postings feature: rules (service) and data (model).
// No controllers and no URL. The direct and the nested API modules both import
// it, so they work on the same postings. UsersModule gives the service
// UsersService, to check that the poster exists.
@Module({
  imports: [PrismaModule, UsersModule],
  providers: [JobPostingsService, JobPostingModel],
  exports: [JobPostingsService],
})
export class JobPostingsModule {}
