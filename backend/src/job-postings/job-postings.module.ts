import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JobPostingsService } from './job-postings.service';
import { JobPostingModel } from './job-posting.model';

// Shared core of the job-postings feature: rules (service) and data (model).
// No controllers and no URL. ApiJobPostingModule imports it, and so does
// JobApplicationsModule, to check that a posting exists.
@Module({
  imports: [PrismaModule],
  providers: [JobPostingsService, JobPostingModel],
  exports: [JobPostingsService],
})
export class JobPostingsModule {}
