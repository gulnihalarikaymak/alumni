import { Module } from '@nestjs/common';
import { ApiAnnouncementController } from './api-announcement.controller';
import { AnnouncementsModule } from './announcements.module';

// JSON API for announcements. Mounted at /api/announcements in app.routes.ts.
@Module({
  imports: [AnnouncementsModule],
  controllers: [ApiAnnouncementController],
})
export class ApiAnnouncementModule {}
