// Reads the logged-in user's own records for the /account page (task 7):
// their alumni profile ("alumni_profiles") and their job applications with the
// posting each one is for ("job_applications" → "job_postings").
// No rules and no HTTP here: AccountService decides what each role gets.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AlumniProfile } from '../registration/registration.model';
import type { ApplicationStatus } from '../job-applications/job-application.model';

export interface MyApplication {
  id: number;
  status: ApplicationStatus;
  createdAt: string;
  jobPosting: { id: number; title: string; company: string };
}

@Injectable()
export class AccountModel {
  constructor(private readonly prisma: PrismaService) {}

  async findAlumniProfile(userId: number): Promise<AlumniProfile | null> {
    const row = await this.prisma.alumniProfile.findUnique({ where: { userId } });
    return row ? { id: row.id, fullName: row.fullName, graduationYear: row.graduationYear, city: row.city } : null;
  }

  // newest first, with the title and company of the posting
  async findApplications(userId: number): Promise<MyApplication[]> {
    const rows = await this.prisma.jobApplication.findMany({
      where: { applicantId: userId },
      orderBy: { createdAt: 'desc' },
      include: { jobPosting: { select: { id: true, title: true, company: true } } },
    });
    return rows.map((row) => ({
      id: row.id,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      jobPosting: row.jobPosting,
    }));
  }
}
