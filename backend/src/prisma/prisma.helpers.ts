import { Prisma } from '../generated/prisma/client';

// The largest value a PostgreSQL "integer" column can hold. A bigger id cannot
// exist, and sending one to the database would fail, so models answer "not found".
export const MAX_ID = 2_147_483_647;

// Prisma error P2025: the record to update or delete does not exist.
// Models turn it into undefined / false, so the service decides on the 404.
export function isRecordNotFound(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025';
}

// Prisma error P2002: a UNIQUE constraint refused the row (for example, two
// requests registering the same e-mail at the same moment). The service answers 409.
export function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}
