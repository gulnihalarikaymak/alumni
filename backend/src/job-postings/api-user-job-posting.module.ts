import { Module } from '@nestjs/common';
import { ApiUserJobPostingController } from './api-user-job-posting.controller';
import { JobPostingsModule } from './job-postings.module';

// Nested JSON routes for job postings. Mounted at /api/users/:userId/job-postings
// in app.routes.ts. RouterModule maps a path to a module, so the nested routes
// need their own module next to ApiJobPostingModule.
@Module({
  imports: [JobPostingsModule],
  controllers: [ApiUserJobPostingController],
})
export class ApiUserJobPostingModule {}
