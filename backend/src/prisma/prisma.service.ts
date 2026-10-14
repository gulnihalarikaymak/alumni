import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

// The app's one connection to PostgreSQL, shared by every model.
// Prisma 7 reaches the database through a driver adapter (node-postgres, "pg").
// DATABASE_URL comes from docker-compose.yml; the fallback is for running the
// backend on your own computer, the same as in prisma.config.ts.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL ?? 'postgresql://alumni:alumni@localhost:5432/alumni';
    super({ adapter: new PrismaPg({ connectionString: url }) });
  }

  // Close the connections when the app stops (Ctrl+C, docker compose down).
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
