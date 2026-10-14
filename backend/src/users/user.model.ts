// Mirrors the USER model in the README and the "users" table (prisma/schema.prisma).
import { Injectable } from '@nestjs/common';
import { User as UserRow } from '../generated/prisma/client';
import { MAX_ID, isRecordNotFound } from '../prisma/prisma.helpers';
import { PrismaService } from '../prisma/prisma.service';

export const ROLES = ['ADMIN', 'STAFF', 'ALUMNI', 'STUDENT'] as const;
export const STATUSES = ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'] as const;

export type Role = (typeof ROLES)[number];
export type Status = (typeof STATUSES)[number];

export interface User {
  id: number;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
}

// Fields the caller provides; id and createdAt are set by the database.
export type NewUser = Pick<User, 'email' | 'role' | 'status'>;
export type UserChanges = Partial<NewUser>;

/**
 * The User model: owns the data and the CRUD operations on it.
 * Records live in the PostgreSQL table "users", reached through Prisma, so
 * they survive a restart. Every method is async: it waits for the database.
 * No business rules and no HTTP here: it returns undefined or false when a
 * record is missing and leaves the decision (404, 409, ...) to UsersService.
 */
@Injectable()
export class UserModel {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(data: NewUser): Promise<User> {
    return toUser(await this.prisma.user.create({ data }));
  }

  // READ: all records, oldest first
  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany({ orderBy: { id: 'asc' } });
    return rows.map(toUser);
  }

  // READ: one record by id
  async findById(id: number): Promise<User | undefined> {
    if (id > MAX_ID) return undefined;
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? toUser(row) : undefined;
  }

  // READ: one record by e-mail (e-mails are stored lower-case)
  async findByEmail(email: string): Promise<User | undefined> {
    const row = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return row ? toUser(row) : undefined;
  }

  // UPDATE: changes only the fields given; used by both PUT and PATCH
  async update(id: number, changes: UserChanges): Promise<User | undefined> {
    if (id > MAX_ID) return undefined;
    try {
      return toUser(await this.prisma.user.update({ where: { id }, data: changes }));
    } catch (err) {
      if (isRecordNotFound(err)) return undefined;
      throw err;
    }
  }

  // DELETE: true if a record was removed
  async delete(id: number): Promise<boolean> {
    if (id > MAX_ID) return false;
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (err) {
      if (isRecordNotFound(err)) return false;
      throw err;
    }
  }
}

// A database row holds a Date; the rest of the app (JSON, views) uses an ISO string.
function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}
