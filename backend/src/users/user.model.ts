// Mirrors the USER model in the README. Held in memory until week 5 (Prisma).
import { Injectable } from '@nestjs/common';

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

// Fields the caller provides; id and createdAt are set by the model.
export type NewUser = Pick<User, 'email' | 'role' | 'status'>;
export type UserChanges = Partial<NewUser>;

/**
 * The User model: owns the data and the CRUD operations on it.
 * No database yet, so the records live in an array and are lost on restart.
 * No business rules and no HTTP here: it returns undefined or false when a
 * record is missing and leaves the decision (404, 409, ...) to UsersService.
 */
@Injectable()
export class UserModel {
  private readonly users: User[] = [];
  private nextId = 1;

  // CREATE
  create(data: NewUser): User {
    const user: User = {
      id: this.nextId++,
      email: data.email,
      role: data.role,
      status: data.status,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return { ...user };
  }

  // READ: all records
  findAll(): User[] {
    return this.users.map((u) => ({ ...u }));
  }

  // READ: one record by id
  findById(id: number): User | undefined {
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : undefined;
  }

  // READ: one record by e-mail (e-mails are stored lower-case)
  findByEmail(email: string): User | undefined {
    const user = this.users.find((u) => u.email === email.toLowerCase());
    return user ? { ...user } : undefined;
  }

  // UPDATE: changes only the fields given; used by both PUT and PATCH
  update(id: number, changes: UserChanges): User | undefined {
    const user = this.users.find((u) => u.id === id);
    if (!user) return undefined;
    if (changes.email !== undefined) user.email = changes.email;
    if (changes.role !== undefined) user.role = changes.role;
    if (changes.status !== undefined) user.status = changes.status;
    return { ...user };
  }

  // DELETE: true if a record was removed
  delete(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
