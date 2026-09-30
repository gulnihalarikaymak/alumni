// Mirrors the USER model in the README. Held in memory until week 5 (Prisma).
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

export interface CreateUserDto {
  email: string;
  role: Role;
}
