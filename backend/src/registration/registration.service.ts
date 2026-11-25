import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { hashPassword } from '../auth/password';
import {
  AlumniProfile,
  NewRegistration,
  Registration,
  RegistrationModel,
  RegistrationRole,
} from './registration.model';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ADMIN is not in the list: an admin account is never self-registered (DDD 4.1)
export const REGISTRATION_ROLES: RegistrationRole[] = ['STUDENT', 'ALUMNI', 'STAFF'];
export const FIRST_GRADUATION_YEAR = 1950;

const FIELDS = ['email', 'role', 'password', 'acceptPrivacy', 'fullName', 'graduationYear', 'city'];
const ALUMNI_FIELDS = ['fullName', 'graduationYear', 'city'];

// Business rules for signing up. Storage is the RegistrationModel's job.
// A new account always starts as PENDING; approval by an admin comes with week 11.
@Injectable()
export class RegistrationService {
  constructor(private readonly registrationModel: RegistrationModel) {}

  async register(body: unknown): Promise<Registration> {
    const { password, ...data } = this.validate(body);
    const taken = () => new ConflictException(`A user with email "${data.email}" already exists`);

    if (await this.registrationModel.emailExists(data.email)) throw taken();
    // Only the hash is stored (auth/password.ts); the password itself is dropped here.
    const passwordHash = await hashPassword(password);
    // A second request with the same e-mail can still arrive between the check and
    // the insert; the UNIQUE constraint stops it and the model returns undefined.
    const saved = await this.registrationModel.create({ ...data, passwordHash });
    if (!saved) throw taken();
    return saved;
  }

  private validate(body: unknown): Omit<NewRegistration, 'passwordHash'> & { password: string } {
    const errors: string[] = [];
    const b = (body && typeof body === 'object' && !Array.isArray(body) ? body : {}) as Record<string, unknown>;

    const unknownFields = Object.keys(b).filter((k) => !FIELDS.includes(k));
    if (unknownFields.length) errors.push(`Unknown field(s): ${unknownFields.join(', ')}`);

    // email
    const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
    if (b.email === undefined) errors.push('email is required');
    else if (!EMAIL_RE.test(email)) errors.push('email must be a valid e-mail address');

    // role
    const role = (typeof b.role === 'string' ? b.role.trim().toUpperCase() : '') as RegistrationRole;
    if (b.role === undefined) errors.push('role is required');
    else if (!REGISTRATION_ROLES.includes(role)) errors.push(`role must be one of: ${REGISTRATION_ROLES.join(', ')}`);

    // password: 8–128 characters (DDD 4.10); any characters are allowed
    const password = typeof b.password === 'string' ? b.password : '';
    if (b.password === undefined) errors.push('password is required');
    else if (password.length < 8 || password.length > 128) errors.push('password must be 8–128 characters');

    // privacy notice (KVKK): must be accepted, it is not stored
    if (b.acceptPrivacy !== true) errors.push('acceptPrivacy must be true: accept the privacy notice to register');

    // alumni profile: required for ALUMNI, not accepted for the other roles
    let profile: Omit<AlumniProfile, 'id'> | undefined;
    if (role === 'ALUMNI') {
      profile = this.validateProfile(b, errors);
    } else {
      const extra = ALUMNI_FIELDS.filter((k) => b[k] !== undefined);
      if (extra.length && REGISTRATION_ROLES.includes(role)) {
        errors.push(`${extra.join(', ')} can only be sent with role ALUMNI`);
      }
    }

    if (errors.length) throw new BadRequestException(errors);
    return { email, role, password, profile };
  }

  private validateProfile(b: Record<string, unknown>, errors: string[]): Omit<AlumniProfile, 'id'> {
    const fullName = typeof b.fullName === 'string' ? b.fullName.trim().replace(/\s+/g, ' ') : '';
    if (b.fullName === undefined) errors.push('fullName is required for ALUMNI');
    else if (fullName.length < 2 || fullName.length > 100) errors.push('fullName must be 2–100 characters');

    const lastYear = new Date().getFullYear();
    const graduationYear = b.graduationYear;
    if (graduationYear === undefined) errors.push('graduationYear is required for ALUMNI');
    else if (!Number.isInteger(graduationYear) || (graduationYear as number) < FIRST_GRADUATION_YEAR || (graduationYear as number) > lastYear) {
      errors.push(`graduationYear must be a whole number from ${FIRST_GRADUATION_YEAR} to ${lastYear}`);
    }

    // city is optional; an empty value is stored as null (city level only, DDD 7)
    let city: string | null = null;
    if (b.city !== undefined && b.city !== null) {
      if (typeof b.city !== 'string') errors.push('city must be text');
      else if (b.city.trim().length > 60) errors.push('city must be at most 60 characters');
      else city = b.city.trim() || null;
    }

    return { fullName, graduationYear: graduationYear as number, city };
  }
}
