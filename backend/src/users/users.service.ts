import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ROLES, Role, STATUSES, Status, User, UserModel } from './user.model';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = 'create' | 'replace' | 'update';

interface UserFields {
  email?: string;
  role?: Role;
  status?: Status;
}

// Business rules for users. Storage is the UserModel's job (user.model.ts).
// The model talks to the database, so every method here is async and awaits it.
@Injectable()
export class UsersService {
  constructor(private readonly userModel: UserModel) {}

  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  // POST: email + role required, status always starts as PENDING
  async create(body: unknown): Promise<User> {
    const f = this.validate(body, 'create');
    await this.assertEmailFree(f.email!);

    return this.userModel.create({ email: f.email!, role: f.role!, status: 'PENDING' });
  }

  // PUT: full replacement, email + role + status all required
  async replace(id: number, body: unknown, actor?: User | null): Promise<User> {
    await this.findOne(id);
    const f = this.validate(body, 'replace');
    await this.assertEmailFree(f.email!, id);
    this.assertKeepsOwnAccess(id, f, actor);

    return (await this.userModel.update(id, { email: f.email!, role: f.role!, status: f.status! }))!;
  }

  // PATCH: partial update, at least one of email / role / status
  async update(id: number, body: unknown, actor?: User | null): Promise<User> {
    await this.findOne(id);
    const f = this.validate(body, 'update');
    if (f.email !== undefined) await this.assertEmailFree(f.email, id);
    this.assertKeepsOwnAccess(id, f, actor);

    return (await this.userModel.update(id, f))!;
  }

  // DELETE: remove the user through the model
  async remove(id: number, actor?: User | null): Promise<void> {
    if (actor?.id === id) throw new BadRequestException(['You cannot delete your own account']);
    if (!(await this.userModel.delete(id))) throw new NotFoundException(`User ${id} not found`);
  }

  // An admin cannot take away their own access (task 5): changing their own role
  // from ADMIN or their own status from ACTIVE would lock them out of the panel.
  private assertKeepsOwnAccess(id: number, f: UserFields, actor?: User | null): void {
    if (actor?.id !== id) return;
    if ((f.role && f.role !== actor.role) || (f.status && f.status !== 'ACTIVE')) {
      throw new BadRequestException(['You cannot change your own role or deactivate your own account']);
    }
  }

  private async assertEmailFree(email: string, exceptId?: number): Promise<void> {
    const owner = await this.userModel.findByEmail(email);
    if (owner && owner.id !== exceptId) {
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
