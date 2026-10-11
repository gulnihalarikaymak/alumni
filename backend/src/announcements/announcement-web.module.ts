import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementsModule } from './announcements.module';

// Web pages for announcements. Mounted at /announcements in app.routes.ts.
@Module({
  imports: [AnnouncementsModule],
  controllers: [AnnouncementController],
})
export class AnnouncementWebModule {}
