import { Routes } from '@nestjs/core';
import { AnnouncementWebModule } from './announcements/announcement-web.module';
import { ApiAnnouncementModule } from './announcements/api-announcement.module';
import { HealthModule } from './health/health.module';
import { ApiJobApplicationModule } from './job-applications/api-job-application.module';
import { ApiJobPostingApplicationModule } from './job-applications/api-job-posting-application.module';
import { ApiUserJobApplicationModule } from './job-applications/api-user-job-application.module';
import { ApiJobPostingModule } from './job-postings/api-job-posting.module';
import { ApiUserModule } from './users/api-user.module';
import { UserWebModule } from './users/user-web.module';

// The route map: which URL goes to which controller. Controllers declare only
// the part after these paths (':id', 'create', ...), so a URL changes here only.
//
//   /users               -> UserWebModule          -> UserController             HTML pages
//   /announcements       -> AnnouncementWebModule  -> AnnouncementController     HTML pages
//   /api/users           -> ApiUserModule          -> ApiUserController          JSON
//   /api/announcements   -> ApiAnnouncementModule  -> ApiAnnouncementController  JSON
//   /api/job-postings    -> ApiJobPostingModule    -> ApiJobPostingController    JSON, direct
//   /api/job-applications -> ApiJobApplicationModule -> ApiJobApplicationController JSON, direct
//   /api/job-postings/:jobPostingId/applications
//                        -> ApiJobPostingApplicationModule -> ApiJobPostingApplicationController JSON, nested
//   /api/users/:userId/job-applications
//                        -> ApiUserJobApplicationModule -> ApiUserJobApplicationController JSON, nested
//   /api/health         -> HealthModule           -> HealthController           JSON or status page
//
// Direct route: a resource by its own id (/api/job-postings/7).
// Nested route: a resource inside its parent (/api/users/3/job-applications), declared
// as a child of 'users', so the full path is built from both levels.
export const routes: Routes = [
  // Web: pages for people in a browser
  { path: 'users', module: UserWebModule },
  { path: 'announcements', module: AnnouncementWebModule },

  // API: JSON for programs (Postman, later the React app)
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
      { path: 'health', module: HealthModule },
    ],
  },
];
