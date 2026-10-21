import { Module } from '@nestjs/common';
import { JobPostingApplicationController } from './job-posting-application.controller';
import { JobApplicationsModule } from './job-applications.module';

// Nested web page: one posting's applications and the apply form.
// Mounted at /job-postings/:jobPostingId/applications in app.routes.ts.
@Module({
  imports: [JobApplicationsModule],
  controllers: [JobPostingApplicationController],
})
export class JobPostingApplicationWebModule {}
