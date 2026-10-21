import { Module } from '@nestjs/common';
import { JobPostingsModule } from '../job-postings/job-postings.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { JobApplicationsService } from './job-applications.service';
import { JobApplicationModel } from './job-application.model';

// Shared core of the job-applications feature: rules (service) and data (model).
// No controllers and no URL. The three API modules (direct, under a posting,
// under a user) import it. JobPostingsModule and UsersModule give the service
// the parents' services, to check that the posting and the applicant exist.
@Module({
  imports: [PrismaModule, JobPostingsModule, UsersModule],
  providers: [JobApplicationsService, JobApplicationModel],
  exports: [JobApplicationsService],
})
export class JobApplicationsModule {}
