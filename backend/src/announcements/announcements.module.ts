import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementModel } from './announcement.model';

// Shared core of the announcements feature: rules (service) and data (model).
// No controllers and no URL. The web and API modules both import it, and Nest
// creates it once, so pages and API work on the same in-memory announcements.
@Module({
  providers: [AnnouncementsService, AnnouncementModel],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
