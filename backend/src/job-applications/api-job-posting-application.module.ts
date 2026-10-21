import { Module } from '@nestjs/common';
import { ApiJobPostingApplicationController } from './api-job-posting-application.controller';
import { JobApplicationsModule } from './job-applications.module';

// Nested JSON routes for job applications under a posting.
// Mounted at /api/job-postings/:jobPostingId/applications in app.routes.ts.
@Module({
  imports: [JobApplicationsModule],
  controllers: [ApiJobPostingApplicationController],
})
export class ApiJobPostingApplicationModule {}
