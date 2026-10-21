// The JobPosting model and the "job_postings" table (prisma/schema.prisma).
// The row belongs to the User who posted it (postedById → users.id); when
// that user is deleted, Prisma cascades and removes the postings too.
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
  postedById: number;
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
  'postedById' | 'title' | 'company' | 'location' | 'workType' | 'employmentType' | 'description' | 'applyUrl' | 'deadline'
>;
export type JobPostingChanges = Partial<Omit<NewJobPosting, 'postedById'>>;

/**
 * Owns the job-posting data and the CRUD operations on it.
 * Records live in the PostgreSQL table "job_postings", reached through Prisma,
 * and reference a user through postedById. No validation and no HTTP here:
 * a missing record is reported as undefined or false, and the service decides
 * what that means (404). FK violations surface as thrown errors.
 */
@Injectable()
export class JobPostingModel {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(data: NewJobPosting): Promise<JobPosting> {
    return toJobPosting(await this.prisma.jobPosting.create({ data }));
  }

  // READ: all records, newest first
  async findAll(): Promise<JobPosting[]> {
    const rows = await this.prisma.jobPosting.findMany({ orderBy: { id: 'desc' } });
    return rows.map(toJobPosting);
  }

  // READ: every posting a given user has made, newest first
  async findByPoster(postedById: number): Promise<JobPosting[]> {
    const rows = await this.prisma.jobPosting.findMany({
      where: { postedById },
      orderBy: { id: 'desc' },
    });
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
      return toJobPosting(await this.prisma.jobPosting.update({ where: { id }, data: changes }));
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

// Dates leave the model as ISO strings; deadline is a date, so we keep yyyy-mm-dd.
function toJobPosting(row: JobPostingRow): JobPosting {
  return {
    id: row.id,
    postedById: row.postedById,
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
