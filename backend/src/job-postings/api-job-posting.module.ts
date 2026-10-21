import { Module } from '@nestjs/common';
import { ApiJobPostingController } from './api-job-posting.controller';
import { JobPostingsModule } from './job-postings.module';

// Direct JSON routes for job postings. Mounted at /api/job-postings in app.routes.ts.
@Module({
  imports: [JobPostingsModule],
  controllers: [ApiJobPostingController],
})
export class ApiJobPostingModule {}
