import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobPostingsService } from '../job-postings/job-postings.service';
import { Role } from '../users/user.model';
import { UsersService } from '../users/users.service';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  JobApplication,
  JobApplicationChanges,
  JobApplicationModel,
} from './job-application.model';

const COVER_LETTER_MAX = 2000;
const APPLICANT_ROLES: Role[] = ['ALUMNI', 'STUDENT']; // DDD 4.9

// Business rules for job applications. Storage is the JobApplicationModel's job.
// Three controllers call it: direct (/api/job-applications/...), nested under a
// posting and nested under a user. Parents are checked through their own
// services, so "posting / user not found" (404) is written once.
@Injectable()
export class JobApplicationsService {
  constructor(
    private readonly jobApplicationModel: JobApplicationModel,
    private readonly jobPostingsService: JobPostingsService,
    private readonly usersService: UsersService,
  ) {}

  findAll(): Promise<JobApplication[]> {
    return this.jobApplicationModel.findAll();
  }

  async findOne(id: number): Promise<JobApplication> {
    const application = await this.jobApplicationModel.findById(id);
    if (!application) throw new NotFoundException(`Job application ${id} not found`);
    return application;
  }

  // Nested GET under a posting: the posting must exist
  async findByJobPosting(jobPostingId: number): Promise<JobApplication[]> {
    await this.jobPostingsService.findOne(jobPostingId);
    return this.jobApplicationModel.findByJobPosting(jobPostingId);
  }

  // Nested GET under a user: the user must exist
  async findByApplicant(userId: number): Promise<JobApplication[]> {
    await this.usersService.findOne(userId);
    return this.jobApplicationModel.findByApplicant(userId);
  }

  // Nested POST under a posting: the posting comes from the URL, the applicant
  // from the body (until sign-in exists). A new application is always SUBMITTED.
  async apply(jobPostingId: number, body: unknown): Promise<JobApplication> {
    const posting = await this.jobPostingsService.findOne(jobPostingId);
    const f = this.validateNew(body);
    const applicant = await this.usersService.findOne(f.applicantId);

    if (!APPLICANT_ROLES.includes(applicant.role)) {
      throw new BadRequestException(`A ${applicant.role} user cannot apply to job postings`);
    }
    // Both are yyyy-mm-dd, so comparing the strings compares the days
    const today = new Date().toISOString().slice(0, 10);
    if (posting.deadline && posting.deadline < today) {
      throw new BadRequestException(`The deadline of job posting ${jobPostingId} has passed`);
    }
    if (await this.jobApplicationModel.findByPair(jobPostingId, applicant.id)) {
      throw new ConflictException(
        `User ${applicant.id} has already applied to job posting ${jobPostingId}`,
      );
    }

    return this.jobApplicationModel.create({
      jobPostingId,
      applicantId: applicant.id,
      coverLetter: f.coverLetter,
      status: 'SUBMITTED',
    });
  }

  // PATCH: status and/or cover letter, at least one
  async update(id: number, body: unknown): Promise<JobApplication> {
    await this.findOne(id);
    const f = this.validateChanges(body);
    return (await this.jobApplicationModel.update(id, f))!;
  }

  async remove(id: number): Promise<void> {
    if (!(await this.jobApplicationModel.delete(id))) {
      throw new NotFoundException(`Job application ${id} not found`);
    }
  }

  private validateNew(body: unknown): { applicantId: number; coverLetter: string | null } {
    const errors: string[] = [];
    const b = toRecord(body);

    const unknownFields = Object.keys(b).filter((k) => !['applicantId', 'coverLetter'].includes(k));
    if (unknownFields.length) {
      errors.push(`Unknown or read-only field(s): ${unknownFields.join(', ')}`);
    }

    const applicantId = b.applicantId;
    if (applicantId === undefined) errors.push('applicantId is required');
    else if (!Number.isInteger(applicantId) || (applicantId as number) < 1) {
      errors.push('applicantId must be a positive integer');
    }

    const coverLetter = checkCoverLetter(b.coverLetter, errors);

    if (errors.length) throw new BadRequestException(errors);
    return { applicantId: applicantId as number, coverLetter: coverLetter ?? null };
  }

  private validateChanges(body: unknown): JobApplicationChanges {
    const errors: string[] = [];
    const b = toRecord(body);

    const unknownFields = Object.keys(b).filter((k) => !['status', 'coverLetter'].includes(k));
    if (unknownFields.length) {
      errors.push(`Unknown or read-only field(s): ${unknownFields.join(', ')}`);
    }

    const out: JobApplicationChanges = {};
    if (b.status !== undefined) {
      const status = typeof b.status === 'string' ? b.status.trim().toUpperCase() : '';
      if (!APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
        errors.push(`status must be one of: ${APPLICATION_STATUSES.join(', ')}`);
      } else out.status = status as ApplicationStatus;
    }
    const coverLetter = checkCoverLetter(b.coverLetter, errors);
    if (coverLetter !== undefined) out.coverLetter = coverLetter;

    if (!errors.length && Object.keys(out).length === 0) {
      errors.push('Send at least one of: status, coverLetter');
    }

    if (errors.length) throw new BadRequestException(errors);
    return out;
  }
}

function toRecord(body: unknown): Record<string, unknown> {
  return (body && typeof body === 'object' && !Array.isArray(body) ? body : {}) as Record<
    string,
    unknown
  >;
}

// Optional text: undefined = not sent, null or "" = no cover letter
function checkCoverLetter(value: unknown, errors: string[]): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') {
    errors.push('coverLetter must be a string or null');
    return undefined;
  }
  const text = value.trim();
  if (text.length > COVER_LETTER_MAX) {
    errors.push(`coverLetter must be at most ${COVER_LETTER_MAX} characters`);
    return undefined;
  }
  return text || null;
}
