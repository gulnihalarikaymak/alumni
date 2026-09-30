import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROLES, Role, STATUSES, Status, User } from './user.model';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = 'create' | 'replace' | 'update';

interface UserFields {
  email?: string;
  role?: Role;
  status?: Status;
}

@Injectable()
export class UsersService {
  // In-memory store: resets every time the server restarts.
  private readonly users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  // POST: email + role required, status always starts as PENDING
  create(body: unknown): User {
    const f = this.validate(body, 'create');
    this.assertEmailFree(f.email!);

    const user: User = {
      id: this.nextId++,
      email: f.email!,
      role: f.role!,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  // PUT: full replacement, email + role + status all required
  replace(id: number, body: unknown): User {
    const user = this.findOne(id);
    const f = this.validate(body, 'replace');
    this.assertEmailFree(f.email!, id);

    user.email = f.email!;
    user.role = f.role!;
    user.status = f.status!;
    return user;
  }

  // PATCH: partial update, at least one of email / role / status
  update(id: number, body: unknown): User {
    const user = this.findOne(id);
    const f = this.validate(body, 'update');
    if (f.email !== undefined) this.assertEmailFree(f.email, id);

    Object.assign(user, f);
    return user;
  }

  // DELETE: remove the user from the in-memory store
  remove(id: number): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException(`User ${id} not found`);
    this.users.splice(index, 1);
  }

  private assertEmailFree(email: string, exceptId?: number): void {
    if (this.users.some((u) => u.email === email && u.id !== exceptId)) {
      throw new ConflictException(`A user with email "${email}" already exists`);
    }
  }

  private validate(body: unknown, mode: Mode): UserFields {
    const errors: string[] = [];
    const b = (body && typeof body === 'object' && !Array.isArray(body)
      ? body
      : {}) as Record<string, unknown>;

    const allowed = mode === 'create' ? ['email', 'role'] : ['email', 'role', 'status'];
    const unknownFields = Object.keys(b).filter((k) => !allowed.includes(k));
    if (unknownFields.length) {
      errors.push(`Unknown or read-only field(s): ${unknownFields.join(', ')}`);
    }

    const required = mode !== 'update';
    const out: UserFields = {};

    // email
    if (b.email === undefined) {
      if (required) errors.push('email is required');
    } else {
      const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
      if (!EMAIL_RE.test(email)) errors.push('email must be a valid e-mail address');
      else out.email = email;
    }

    // role
    if (b.role === undefined) {
      if (required) errors.push('role is required');
    } else {
      const role = typeof b.role === 'string' ? b.role.trim().toUpperCase() : '';
      if (!ROLES.includes(role as Role)) errors.push(`role must be one of: ${ROLES.join(', ')}`);
      else out.role = role as Role;
    }

    // status (not accepted on create)
    if (mode !== 'create') {
      if (b.status === undefined) {
        if (mode === 'replace') errors.push('status is required');
      } else {
        const status = typeof b.status === 'string' ? b.status.trim().toUpperCase() : '';
        if (!STATUSES.includes(status as Status)) {
          errors.push(`status must be one of: ${STATUSES.join(', ')}`);
        } else out.status = status as Status;
      }
    }

    if (mode === 'update' && !errors.length && Object.keys(out).length === 0) {
      errors.push('Send at least one of: email, role, status');
    }

    if (errors.length) throw new BadRequestException(errors);
    return out;
  }
}
