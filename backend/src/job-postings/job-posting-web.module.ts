import { Module } from '@nestjs/common';
import { JobPostingController } from './job-posting.controller';
import { JobPostingsModule } from './job-postings.module';

// Web pages for job postings. Mounted at /job-postings in app.routes.ts.
@Module({
  imports: [JobPostingsModule],
  controllers: [JobPostingController],
})
export class JobPostingWebModule {}
