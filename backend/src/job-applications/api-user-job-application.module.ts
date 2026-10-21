import { Module } from '@nestjs/common';
import { ApiUserJobApplicationController } from './api-user-job-application.controller';
import { JobApplicationsModule } from './job-applications.module';

// Nested JSON route for job applications under a user.
// Mounted at /api/users/:userId/job-applications in app.routes.ts.
@Module({
  imports: [JobApplicationsModule],
  controllers: [ApiUserJobApplicationController],
})
export class ApiUserJobApplicationModule {}
