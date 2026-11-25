// Counts for the admin panel, read from several tables (prisma/schema.prisma).
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ROLES, Role, STATUSES, Status } from '../users/user.model';

export interface AdminSummary {
  users: { total: number; byStatus: Record<Status, number>; byRole: Record<Role, number> };
  announcements: number;
  jobPostings: number;
  jobApplications: number;
}

@Injectable()
export class AdminModel {
  constructor(private readonly prisma: PrismaService) {}

  async summary(): Promise<AdminSummary> {
    // groupBy counts users per status and per role in one query each
    const [byStatus, byRole, announcements, jobPostings, jobApplications] = await Promise.all([
      this.prisma.user.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      this.prisma.announcement.count(),
      this.prisma.jobPosting.count(),
      this.prisma.jobApplication.count(),
    ]);
    // every status and role appears, with 0 when no user has it
    const statusCounts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>;
    for (const row of byStatus) statusCounts[row.status] = row._count._all;
    const roleCounts = Object.fromEntries(ROLES.map((r) => [r, 0])) as Record<Role, number>;
    for (const row of byRole) roleCounts[row.role] = row._count._all;

    const total = Object.values(statusCounts).reduce((sum, n) => sum + n, 0);
    return { users: { total, byStatus: statusCounts, byRole: roleCounts }, announcements, jobPostings, jobApplications };
  }
}
