import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { ApiAdminModule } from './admin/api-admin.module';
import { ApiAnnouncementModule } from './announcements/api-announcement.module';
import { AppController } from './app.controller';
import { ApiAuthModule } from './auth/api-auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { NotFoundFilter } from './common/not-found.filter';
import { ServerErrorFilter } from './common/server-error.filter';
import { DatabaseModule } from './database/database.module';
import { routes } from './app.routes';
import { HealthModule } from './health/health.module';
import { ApiJobApplicationModule } from './job-applications/api-job-application.module';
import { ApiJobPostingApplicationModule } from './job-applications/api-job-posting-application.module';
import { ApiUserJobApplicationModule } from './job-applications/api-user-job-application.module';
import { ApiJobPostingModule } from './job-postings/api-job-posting.module';
import { ApiRegistrationModule } from './registration/api-registration.module';
import { ApiUserModule } from './users/api-user.module';

@Module({
  imports: [
    // URL paths for the modules below are defined in app.routes.ts
    RouterModule.register(routes),
    DatabaseModule,
    AuthModule, // gives AuthMiddleware the AuthService
    HealthModule,
    ApiUserModule,
    ApiAnnouncementModule,
    ApiJobPostingModule,
    ApiJobApplicationModule,
    ApiJobPostingApplicationModule,
    ApiUserJobApplicationModule,
    ApiRegistrationModule,
    ApiAuthModule,
    ApiAdminModule,
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
  // Middleware: runs for every request before the controllers, in this order:
  //   LoggerMiddleware (one log line each), then AuthMiddleware (who is logged in, may stop the request)
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes('*');
  }
}
