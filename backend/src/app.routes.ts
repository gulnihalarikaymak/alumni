import { Routes } from '@nestjs/core';
import { ApiAdminModule } from './admin/api-admin.module';
import { ApiAnnouncementModule } from './announcements/api-announcement.module';
import { ApiAuthModule } from './auth/api-auth.module';
import { HealthModule } from './health/health.module';
import { ApiJobApplicationModule } from './job-applications/api-job-application.module';
import { ApiJobPostingApplicationModule } from './job-applications/api-job-posting-application.module';
import { ApiUserJobApplicationModule } from './job-applications/api-user-job-application.module';
import { ApiJobPostingModule } from './job-postings/api-job-posting.module';
import { ApiRegistrationModule } from './registration/api-registration.module';
import { ApiUserModule } from './users/api-user.module';

// The JSON feature modules use these prefixes. Browser pages are served by AppController.
export const routes: Routes = [
  {
    path: 'api',
    children: [
      {
        path: 'users',
        module: ApiUserModule,
        children: [{ path: ':userId/job-applications', module: ApiUserJobApplicationModule }],
      },
      { path: 'announcements', module: ApiAnnouncementModule },
      {
        path: 'job-postings',
        module: ApiJobPostingModule,
        children: [{ path: ':jobPostingId/applications', module: ApiJobPostingApplicationModule }],
      },
      { path: 'job-applications', module: ApiJobApplicationModule },
      { path: 'register', module: ApiRegistrationModule },
      { path: 'auth', module: ApiAuthModule },
      { path: 'admin', module: ApiAdminModule },
      { path: 'health', module: HealthModule },
    ],
  },
];
