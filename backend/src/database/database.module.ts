import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SeedService } from './seed.service';

// Startup tasks that touch the database. SeedService fills an empty database with
// demo data on first run. Imports PrismaModule so it shares the app's one pool.
@Module({
  imports: [PrismaModule],
  providers: [SeedService],
})
export class DatabaseModule {}
