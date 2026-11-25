import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAccountService } from './admin-account.service';
import { SeedService } from './seed.service';

// Startup tasks that touch the database. SeedService fills an empty database with
// demo data on first run; AdminAccountService creates the first admin from .env.
// Imports PrismaModule so they share the app's one pool.
@Module({
  imports: [PrismaModule],
  providers: [SeedService, AdminAccountService],
})
export class DatabaseModule {}
