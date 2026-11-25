// Storage for login: reads a user's password hash and keeps the "sessions"
// table (prisma/schema.prisma, DDD.md 4.11). No rules and no HTTP here.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, toUser } from '../users/user.model';

export interface LoginCandidate {
  user: User;
  passwordHash: string | null;
}

export interface StoredSession {
  user: User;
  expiresAt: Date;
}

@Injectable()
export class AuthModel {
  constructor(private readonly prisma: PrismaService) {}

  // The only place that reads password_hash; it never leaves the auth feature.
  async findLoginCandidate(email: string): Promise<LoginCandidate | undefined> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? { user: toUser(row), passwordHash: row.passwordHash } : undefined;
  }

  async createSession(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.prisma.session.create({ data: { userId, tokenHash, expiresAt } });
  }

  async findSession(tokenHash: string): Promise<StoredSession | undefined> {
    const row = await this.prisma.session.findUnique({ where: { tokenHash }, include: { user: true } });
    return row ? { user: toUser(row.user), expiresAt: row.expiresAt } : undefined;
  }

  // deleteMany does not fail when the session is already gone
  async deleteSession(tokenHash: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { tokenHash } });
  }
}
