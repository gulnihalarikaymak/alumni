// Prisma 7 reads its settings from this file, not from schema.prisma.
import { defineConfig } from 'prisma/config';

// In Docker, docker-compose.yml sets DATABASE_URL (host "db", the service name).
// On your own computer (`npx prisma ...` in backend/) there is no DATABASE_URL,
// so it falls back to the db container on localhost, with the compose defaults.
// Exported so prisma/seed.ts connects to the same database.
export const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://alumni:alumni@localhost:5432/alumni';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts', // run with `npx prisma db seed`
  },
  datasource: { url: databaseUrl },
});
