// Manual demo-data command for a dev host: `npx prisma db seed` (with the db
// running). The app ALSO seeds an empty database automatically on startup
// (src/database/seed.service.ts); use this when you want to add MORE demo data by
// hand. It only adds rows, never deletes.
import { PrismaPg } from '@prisma/adapter-pg';
import { databaseUrl } from '../prisma.config';
import { PrismaClient } from '../src/generated/prisma/client';
import { seedDatabase } from '../src/database/seed';

// Prisma 7 talks to PostgreSQL through a driver adapter (here: node-postgres, "pg").
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

seedDatabase(prisma)
  .then((totals) => console.table(totals))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
