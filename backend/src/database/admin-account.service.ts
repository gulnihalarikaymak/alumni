import { Injectable, Logger } from '@nestjs/common';
import { hashPassword } from '../auth/password';
import { PrismaService } from '../prisma/prisma.service';

// The first admin account. Approving an account (PATCH /api/users/:id) needs a
// login, and a new account starts as PENDING, so someone must already be able to
// log in. When ADMIN_EMAIL and ADMIN_PASSWORD are set (.env, see .env.example),
// this creates that ACTIVE admin on startup if the e-mail has no account yet.
// It never changes an existing account. Without the two variables it does nothing.
// SeedService calls it after the demo seed, so an empty database is still seeded first.
@Injectable()
export class AdminAccountService {
  private readonly logger = new Logger('Admin');

  constructor(private readonly prisma: PrismaService) {}

  async ensureAdmin(): Promise<void> {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      this.logger.log('ADMIN_EMAIL / ADMIN_PASSWORD not set: no admin account created');
      return;
    }
    if (password.length < 8) {
      this.logger.warn('ADMIN_PASSWORD has fewer than 8 characters: no admin account created');
      return;
    }
    try {
      if (await this.prisma.user.findUnique({ where: { email } })) {
        this.logger.log(`Admin account ${email} already exists: left unchanged`);
        return;
      }
      await this.prisma.user.create({
        data: { email, role: 'ADMIN', status: 'ACTIVE', passwordHash: await hashPassword(password) },
      });
      this.logger.log(`Admin account ${email} created`);
    } catch (error) {
      this.logger.error('Could not create the admin account', error as Error);
    }
  }
}
