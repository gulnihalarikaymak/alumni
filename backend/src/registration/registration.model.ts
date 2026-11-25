// Stores a registration: a row in "users" and, for an alumnus, a row in
// "alumni_profiles" (prisma/schema.prisma, DDD.md 4.1 and 4.3).
import { Injectable } from '@nestjs/common';
import { isUniqueViolation } from '../prisma/prisma.helpers';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '../users/user.model';

export type RegistrationRole = Extract<Role, 'STUDENT' | 'ALUMNI' | 'STAFF'>;

export interface AlumniProfile {
  id: number;
  fullName: string;
  graduationYear: number;
  city: string | null;
}

export interface Registration {
  user: User;
  alumniProfile: AlumniProfile | null;
}

export interface NewRegistration {
  email: string;
  role: RegistrationRole;
  passwordHash: string;
  profile?: Omit<AlumniProfile, 'id'>;
}

/**
 * The Registration model: creates the account and its alumni profile together.
 * One Prisma call with a nested create runs as one database transaction, so
 * either both rows are saved or neither is.
 * No business rules and no HTTP here: it returns undefined when the e-mail is
 * already taken and leaves the 409 to RegistrationService.
 */
@Injectable()
export class RegistrationModel {
  constructor(private readonly prisma: PrismaService) {}

  async emailExists(email: string): Promise<boolean> {
    return (await this.prisma.user.count({ where: { email } })) > 0;
  }

  async create(data: NewRegistration): Promise<Registration | undefined> {
    try {
      const row = await this.prisma.user.create({
        data: {
          email: data.email,
          role: data.role,
          passwordHash: data.passwordHash,
          status: 'PENDING', // every new account waits for an admin (DDD 4.1)
          alumniProfile: data.profile ? { create: data.profile } : undefined,
        },
        include: { alumniProfile: true },
      });
      const profile = row.alumniProfile;
      return {
        user: {
          id: row.id,
          email: row.email,
          role: row.role,
          status: row.status,
          createdAt: row.createdAt.toISOString(),
        },
        alumniProfile: profile
          ? { id: profile.id, fullName: profile.fullName, graduationYear: profile.graduationYear, city: profile.city }
          : null,
      };
    } catch (err) {
      if (isUniqueViolation(err)) return undefined;
      throw err;
    }
  }
}
