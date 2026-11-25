import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { User } from '../users/user.model';
import { AuthModel } from './auth.model';
import { verifyPassword } from './password';
import { SESSION_DAYS } from './session-cookie';

// One message for an unknown e-mail, a missing password and a wrong password,
// so the answer does not tell an attacker which e-mails have an account.
const WRONG_LOGIN = 'E-mail or password is incorrect';
// Checked when the e-mail has no password, so that answer takes as long as a wrong password.
const DUMMY_HASH = `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`;

// The cookie keeps the token; the database keeps only its SHA-256 hash.
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Business rules for login and logout (DDD.md 4.11). Storage is the AuthModel's job.
@Injectable()
export class AuthService {
  constructor(private readonly authModel: AuthModel) {}

  // Returns the user and a new random token for the cookie.
  async login(body: unknown): Promise<{ user: User; token: string }> {
    const { email, password } = this.validate(body);

    const candidate = await this.authModel.findLoginCandidate(email);
    const passwordOk = await verifyPassword(password, candidate?.passwordHash ?? DUMMY_HASH);
    if (!candidate?.passwordHash || !passwordOk) throw new UnauthorizedException(WRONG_LOGIN);

    // Only approved accounts may log in (DDD.md 4.1, account status)
    if (candidate.user.status !== 'ACTIVE') {
      throw new ForbiddenException(`This account is ${candidate.user.status}: only ACTIVE accounts can log in`);
    }

    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    await this.authModel.createSession(candidate.user.id, hashToken(token), expiresAt);
    return { user: candidate.user, token };
  }

  async logout(token: string | undefined): Promise<void> {
    if (token) await this.authModel.deleteSession(hashToken(token));
  }

  // Who is logged in with this cookie token? null when nobody (or no longer allowed).
  async currentUser(token: string | undefined): Promise<User | null> {
    if (!token) return null;
    const tokenHash = hashToken(token);
    const session = await this.authModel.findSession(tokenHash);
    if (!session) return null;
    if (session.expiresAt.getTime() <= Date.now() || session.user.status !== 'ACTIVE') {
      await this.authModel.deleteSession(tokenHash);
      return null;
    }
    return session.user;
  }

  private validate(body: unknown): { email: string; password: string } {
    const b = (body && typeof body === 'object' && !Array.isArray(body) ? body : {}) as Record<string, unknown>;
    const errors: string[] = [];
    const unknownFields = Object.keys(b).filter((k) => !['email', 'password'].includes(k));
    if (unknownFields.length) errors.push(`Unknown field(s): ${unknownFields.join(', ')}`);
    if (typeof b.email !== 'string' || !b.email.trim()) errors.push('email is required');
    if (typeof b.password !== 'string' || !b.password) errors.push('password is required');
    if (errors.length) throw new BadRequestException(errors);
    return { email: (b.email as string).trim().toLowerCase(), password: b.password as string };
  }
}
