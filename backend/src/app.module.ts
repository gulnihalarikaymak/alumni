import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { routes } from './app.routes';
import { HealthModule } from './health/health.module';
import { ApiUserModule } from './users/api-user.module';
import { UserWebModule } from './users/user-web.module';

@Module({
  imports: [
    // URL paths for the modules below are defined in app.routes.ts
    RouterModule.register(routes),
    HealthModule,
    UserWebModule,
    ApiUserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
