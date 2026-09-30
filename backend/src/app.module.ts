import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [HealthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
