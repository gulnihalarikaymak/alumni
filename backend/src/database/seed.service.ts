import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { seedDatabase } from './seed';

// Fills an EMPTY database with synthetic demo data the first time the app starts,
// so `docker compose up` on a fresh volume already has something to show. It is
// idempotent: once there is at least one user it does nothing, so a restart never
// duplicates data. Set AUTO_SEED=false to turn it off (for example in production).
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger('Seed');

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.AUTO_SEED === 'false') {
      this.logger.log('AUTO_SEED=false: skipping automatic seed');
      return;
    }

    const existing = await this.prisma.user.count();
    if (existing > 0) {
      this.logger.log(`Database already has ${existing} user(s): skipping automatic seed`);
      return;
    }

    this.logger.log('Empty database: adding synthetic demo data...');
    try {
      const totals = await seedDatabase(this.prisma);
      this.logger.log(`Seed complete: ${totals.users} users, ${totals.announcements} announcements, ${totals.job_postings} job postings`);
    } catch (error) {
      // A seed failure must not stop the API from serving; start empty and log it.
      this.logger.error('Automatic seed failed; starting with an empty database', error as Error);
    }
  }
}
