import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { AnnouncementWebModule } from './announcements/announcement-web.module';
import { ApiAnnouncementModule } from './announcements/api-announcement.module';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './common/logger.middleware';
import { NotFoundFilter } from './common/not-found.filter';
import { ServerErrorFilter } from './common/server-error.filter';
import { DatabaseModule } from './database/database.module';
import { routes } from './app.routes';
import { HealthModule } from './health/health.module';
import { ApiJobApplicationModule } from './job-applications/api-job-application.module';
import { ApiJobPostingApplicationModule } from './job-applications/api-job-posting-application.module';
import { ApiUserJobApplicationModule } from './job-applications/api-user-job-application.module';
import { JobApplicationWebModule } from './job-applications/job-application-web.module';
import { JobPostingApplicationWebModule } from './job-applications/job-posting-application-web.module';
import { ApiJobPostingModule } from './job-postings/api-job-posting.module';
import { JobPostingWebModule } from './job-postings/job-posting-web.module';
import { ApiUserModule } from './users/api-user.module';
import { UserWebModule } from './users/user-web.module';

@Module({
  imports: [
    // URL paths for the modules below are defined in app.routes.ts
    RouterModule.register(routes),
    DatabaseModule,
    HealthModule,
    UserWebModule,
    ApiUserModule,
    AnnouncementWebModule,
    ApiAnnouncementModule,
    JobPostingWebModule,
    JobPostingApplicationWebModule,
    JobApplicationWebModule,
    ApiJobPostingModule,
    ApiJobApplicationModule,
    ApiJobPostingApplicationModule,
    ApiUserJobApplicationModule,
  ],
  controllers: [AppController],
  // The Guardians. Nest asks the filter registered last first, so the general
  // one (all errors) comes first here and the specific one (404) after it.
  providers: [
    { provide: APP_FILTER, useClass: ServerErrorFilter },
    { provide: APP_FILTER, useClass: NotFoundFilter },
  ],
})
export class AppModule implements NestModule {
  // Middleware: runs for every request before the controllers (one log line each)
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
