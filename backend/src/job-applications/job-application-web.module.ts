import { Module } from '@nestjs/common';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationsModule } from './job-applications.module';

// Web pages for job applications. Mounted at /job-applications in app.routes.ts.
@Module({
  imports: [JobApplicationsModule],
  controllers: [JobApplicationController],
})
export class JobApplicationWebModule {}
