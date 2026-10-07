import { Routes } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { ApiUserModule } from './users/api-user.module';
import { UserWebModule } from './users/user-web.module';

// The route map: which URL goes to which controller. Controllers declare only
// the part after these paths (':id', 'new', ...), so a URL changes here only.
//
//   /users         -> UserWebModule  -> UserController     HTML pages
//   /api/users     -> ApiUserModule  -> ApiUserController  JSON
//   /api/health    -> HealthModule   -> HealthController   JSON or status page
export const routes: Routes = [
  // Web: pages for people in a browser
  { path: 'users', module: UserWebModule },

  // API: JSON for programs (Postman, later the React app)
  {
    path: 'api',
    children: [
      { path: 'users', module: ApiUserModule },
      { path: 'health', module: HealthModule },
    ],
  },
];
