import { Module } from '@nestjs/common';
import { ApiJobApplicationController } from './api-job-application.controller';
import { JobApplicationsModule } from './job-applications.module';

// Direct JSON routes for job applications. Mounted at /api/job-applications in app.routes.ts.
@Module({
  imports: [JobApplicationsModule],
  controllers: [ApiJobApplicationController],
})
export class ApiJobApplicationModule {}
