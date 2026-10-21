import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AnnouncementWebModule } from './announcements/announcement-web.module';
import { ApiAnnouncementModule } from './announcements/api-announcement.module';
import { AppController } from './app.controller';
import { routes } from './app.routes';
import { HealthModule } from './health/health.module';
import { ApiJobApplicationModule } from './job-applications/api-job-application.module';
import { ApiJobPostingApplicationModule } from './job-applications/api-job-posting-application.module';
import { ApiUserJobApplicationModule } from './job-applications/api-user-job-application.module';
import { ApiJobPostingModule } from './job-postings/api-job-posting.module';
import { ApiUserModule } from './users/api-user.module';
import { UserWebModule } from './users/user-web.module';

@Module({
  imports: [
    // URL paths for the modules below are defined in app.routes.ts
    RouterModule.register(routes),
    HealthModule,
    UserWebModule,
    ApiUserModule,
    AnnouncementWebModule,
    ApiAnnouncementModule,
    ApiJobPostingModule,
    ApiJobApplicationModule,
    ApiJobPostingApplicationModule,
    ApiUserJobApplicationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
