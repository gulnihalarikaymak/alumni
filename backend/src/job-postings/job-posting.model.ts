// The JobPosting model and the "job_postings" table (prisma/schema.prisma).
// A posting belongs to no user. Users are linked to postings only through
// their applications (job_applications), see JobApplicationModel.
import { Injectable } from '@nestjs/common';
import { JobPosting as JobPostingRow } from '../generated/prisma/client';
import { MAX_ID, isRecordNotFound } from '../prisma/prisma.helpers';
import { PrismaService } from '../prisma/prisma.service';

export const WORK_TYPES = ['ONSITE', 'HYBRID', 'REMOTE'] as const;
export const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'] as const;

export type WorkType = (typeof WORK_TYPES)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export interface JobPosting {
  id: number;
  title: string;
  company: string;
  location: string | null;
  workType: WorkType;
  employmentType: EmploymentType;
  description: string;
  applyUrl: string | null;
  deadline: string | null; // date only, ISO yyyy-mm-dd
  createdAt: string;
  updatedAt: string;
}

// Fields the caller provides; id, createdAt and updatedAt are set by the database.
export type NewJobPosting = Pick<
  JobPosting,
  'title' | 'company' | 'location' | 'workType' | 'employmentType' | 'description' | 'applyUrl' | 'deadline'
>;
export type JobPostingChanges = Partial<NewJobPosting>;

/**
 * Owns the job-posting data and the CRUD operations on it.
 * Records live in the PostgreSQL table "job_postings", reached through Prisma.
 * No validation and no HTTP here: a missing record is reported as undefined
 * or false, and the service decides what that means (404).
 */
@Injectable()
export class JobPostingModel {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(data: NewJobPosting): Promise<JobPosting> {
    return toJobPosting(
      await this.prisma.jobPosting.create({ data: { ...data, deadline: toDeadline(data.deadline) } }),
    );
  }

  // READ: all records, newest first
  async findAll(): Promise<JobPosting[]> {
    const rows = await this.prisma.jobPosting.findMany({ orderBy: { id: 'desc' } });
    return rows.map(toJobPosting);
  }

  // READ: one record by id
  async findById(id: number): Promise<JobPosting | undefined> {
    if (id > MAX_ID) return undefined;
    const row = await this.prisma.jobPosting.findUnique({ where: { id } });
    return row ? toJobPosting(row) : undefined;
  }

  // UPDATE: changes only the fields given; used by both PUT and PATCH.
  // updatedAt is set by Prisma (@updatedAt in the schema).
  async update(id: number, changes: JobPostingChanges): Promise<JobPosting | undefined> {
    if (id > MAX_ID) return undefined;
    try {
      return toJobPosting(
        await this.prisma.jobPosting.update({
          where: { id },
          data: { ...changes, deadline: toDeadline(changes.deadline) },
        }),
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
      await this.prisma.jobPosting.delete({ where: { id } });
      return true;
    } catch (err) {
      if (isRecordNotFound(err)) return false;
      throw err;
    }
  }
}

// Prisma rejects a date-only string for a DateTime field, so yyyy-mm-dd becomes a
// Date at UTC midnight and "" becomes null. undefined stays undefined: a PATCH
// without a deadline keeps the old one.
function toDeadline(deadline: string | null | undefined): Date | null | undefined {
  if (deadline === undefined) return undefined;
  return deadline ? new Date(deadline) : null;
}

// Dates leave the model as ISO strings; deadline is a date, so we keep yyyy-mm-dd.
function toJobPosting(row: JobPostingRow): JobPosting {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    workType: row.workType,
    employmentType: row.employmentType,
    description: row.description,
    applyUrl: row.applyUrl,
    deadline: row.deadline ? row.deadline.toISOString().slice(0, 10) : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
