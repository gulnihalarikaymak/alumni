// The JobApplication model and the "job_applications" table (prisma/schema.prisma).
// It links two parents: the JobPosting applied to (jobPostingId → job_postings.id)
// and the User who applied (applicantId → users.id). Deleting either parent
// cascades and removes the application. A user applies once per posting
// (@@unique([jobPostingId, applicantId])).
import { Injectable } from '@nestjs/common';
import { JobApplication as JobApplicationRow } from '../generated/prisma/client';
import { MAX_ID, isRecordNotFound } from '../prisma/prisma.helpers';
import { PrismaService } from '../prisma/prisma.service';

export const APPLICATION_STATUSES = ['SUBMITTED', 'REVIEWED', 'ACCEPTED', 'REJECTED'] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface JobApplication {
  id: number;
  jobPostingId: number;
  applicantId: number;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// Fields the caller provides; id, createdAt and updatedAt are set by the database.
export type NewJobApplication = Pick<
  JobApplication,
  'jobPostingId' | 'applicantId' | 'coverLetter' | 'status'
>;
// The two parents never change: an application is not moved to another posting or user.
export type JobApplicationChanges = Partial<Pick<JobApplication, 'coverLetter' | 'status'>>;

/**
 * Owns the job-application data and the CRUD operations on it.
 * Besides the usual CRUD there is one read per relationship (by posting, by
 * applicant) and one by the unique pair, so the service can answer 409 before
 * the database does. No validation and no HTTP here.
 */
@Injectable()
export class JobApplicationModel {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(data: NewJobApplication): Promise<JobApplication> {
    return toJobApplication(await this.prisma.jobApplication.create({ data }));
  }

  // READ: all records, newest first
  async findAll(): Promise<JobApplication[]> {
    const rows = await this.prisma.jobApplication.findMany({ orderBy: { id: 'desc' } });
    return rows.map(toJobApplication);
  }

  // READ: relationship JobPosting 1 → n JobApplication
  async findByJobPosting(jobPostingId: number): Promise<JobApplication[]> {
    if (jobPostingId > MAX_ID) return [];
    const rows = await this.prisma.jobApplication.findMany({
      where: { jobPostingId },
      orderBy: { id: 'desc' },
    });
    return rows.map(toJobApplication);
  }

  // READ: relationship User 1 → n JobApplication
  async findByApplicant(applicantId: number): Promise<JobApplication[]> {
    if (applicantId > MAX_ID) return [];
    const rows = await this.prisma.jobApplication.findMany({
      where: { applicantId },
      orderBy: { id: 'desc' },
    });
    return rows.map(toJobApplication);
  }

  // READ: one record by the unique pair (posting, applicant)
  async findByPair(jobPostingId: number, applicantId: number): Promise<JobApplication | undefined> {
    if (jobPostingId > MAX_ID || applicantId > MAX_ID) return undefined;
    const row = await this.prisma.jobApplication.findUnique({
      where: { jobPostingId_applicantId: { jobPostingId, applicantId } },
    });
    return row ? toJobApplication(row) : undefined;
  }

  // READ: one record by id
  async findById(id: number): Promise<JobApplication | undefined> {
    if (id > MAX_ID) return undefined;
    const row = await this.prisma.jobApplication.findUnique({ where: { id } });
    return row ? toJobApplication(row) : undefined;
  }

  // UPDATE: changes only the fields given; updatedAt is set by Prisma (@updatedAt)
  async update(id: number, changes: JobApplicationChanges): Promise<JobApplication | undefined> {
    if (id > MAX_ID) return undefined;
    try {
      return toJobApplication(
        await this.prisma.jobApplication.update({ where: { id }, data: changes }),
      );
    } catch (err) {
      if (isRecordNotFound(err)) return undefined;
      throw err;
    }
  }

  // DELETE: true if a record was removed
  async delete(id: number): Promise<boolean> {
    if (id > MAX_ID) return false;
    try {
      await this.prisma.jobApplication.delete({ where: { id } });
      return true;
    } catch (err) {
      if (isRecordNotFound(err)) return false;
      throw err;
    }
  }
}

// A database row holds Dates; the rest of the app (JSON) uses ISO strings.
function toJobApplication(row: JobApplicationRow): JobApplication {
  return {
    id: row.id,
    jobPostingId: row.jobPostingId,
    applicantId: row.applicantId,
    coverLetter: row.coverLetter,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
