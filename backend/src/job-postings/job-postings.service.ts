import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  EMPLOYMENT_TYPES,
  EmploymentType,
  JobPosting,
  JobPostingChanges,
  JobPostingModel,
  WORK_TYPES,
  WorkType,
} from './job-posting.model';

const TITLE_MAX = 120;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const FIELDS = [
  'title',
  'company',
  'location',
  'workType',
  'employmentType',
  'description',
  'applyUrl',
  'deadline',
];

type Mode = 'create' | 'replace' | 'update';

// Business rules for job postings. Storage is the JobPostingModel's job.
// A posting belongs to no user; users meet postings only through applications.
// JobApplicationsService also calls findOne, so "posting not found" is written once.
@Injectable()
export class JobPostingsService {
  constructor(private readonly jobPostingModel: JobPostingModel) {}

  findAll(): Promise<JobPosting[]> {
    return this.jobPostingModel.findAll();
  }

  async findOne(id: number): Promise<JobPosting> {
    const posting = await this.jobPostingModel.findById(id);
    if (!posting) throw new NotFoundException(`Job posting ${id} not found`);
    return posting;
  }

  // POST: title, company, workType, employmentType and description required
  create(body: unknown): Promise<JobPosting> {
    const f = this.validate(body, 'create');
    return this.jobPostingModel.create({
      title: f.title!,
      company: f.company!,
      location: f.location!,
      workType: f.workType!,
      employmentType: f.employmentType!,
      description: f.description!,
      applyUrl: f.applyUrl!,
      deadline: f.deadline!,
    });
  }

  // PUT: full replacement; optional fields left out become empty (null)
  async replace(id: number, body: unknown): Promise<JobPosting> {
    await this.findOne(id);
    const f = this.validate(body, 'replace');
    return (await this.jobPostingModel.update(id, f))!;
  }

  // PATCH: partial update, at least one field
  async update(id: number, body: unknown): Promise<JobPosting> {
    await this.findOne(id);
    const f = this.validate(body, 'update');
    return (await this.jobPostingModel.update(id, f))!;
  }

  async remove(id: number): Promise<void> {
    if (!(await this.jobPostingModel.delete(id))) {
      throw new NotFoundException(`Job posting ${id} not found`);
    }
  }

  private validate(body: unknown, mode: Mode): JobPostingChanges {
    const errors: string[] = [];
    const b = (body && typeof body === 'object' && !Array.isArray(body)
      ? body
      : {}) as Record<string, unknown>;

    const unknownFields = Object.keys(b).filter((k) => !FIELDS.includes(k));
    if (unknownFields.length) {
      errors.push(`Unknown or read-only field(s): ${unknownFields.join(', ')}`);
    }

    const required = mode !== 'update';
    const out: JobPostingChanges = {};

    // Required text: trimmed, not empty
    const checkText = (field: 'title' | 'company' | 'description', max?: number) => {
      if (b[field] === undefined) {
        if (required) errors.push(`${field} is required`);
        return;
      }
      const value = typeof b[field] === 'string' ? (b[field] as string).trim() : '';
      if (!value) errors.push(`${field} must not be empty`);
      else if (max && value.length > max) errors.push(`${field} must be at most ${max} characters`);
      else out[field] = value;
    };
    checkText('title', TITLE_MAX);
    checkText('company');
    checkText('description');

    // Optional text: null or "" means "not stated"
    const checkOptional = (field: 'location' | 'applyUrl') => {
      if (b[field] === undefined) {
        if (required) out[field] = null;
        return;
      }
      if (b[field] === null) out[field] = null;
      else if (typeof b[field] !== 'string') errors.push(`${field} must be a string or null`);
      else out[field] = (b[field] as string).trim() || null;
    };
    checkOptional('location');
    checkOptional('applyUrl');

    // Enums: case-insensitive, stored upper-case
    if (b.workType === undefined) {
      if (required) errors.push('workType is required');
    } else {
      const v = typeof b.workType === 'string' ? b.workType.trim().toUpperCase() : '';
      if (!WORK_TYPES.includes(v as WorkType)) {
        errors.push(`workType must be one of: ${WORK_TYPES.join(', ')}`);
      } else out.workType = v as WorkType;
    }
    if (b.employmentType === undefined) {
      if (required) errors.push('employmentType is required');
    } else {
      const v = typeof b.employmentType === 'string' ? b.employmentType.trim().toUpperCase() : '';
      if (!EMPLOYMENT_TYPES.includes(v as EmploymentType)) {
        errors.push(`employmentType must be one of: ${EMPLOYMENT_TYPES.join(', ')}`);
      } else out.employmentType = v as EmploymentType;
    }

    // deadline: yyyy-mm-dd and a real calendar day; null or "" = open until removed
    if (b.deadline === undefined) {
      if (required) out.deadline = null;
    } else if (b.deadline === null || b.deadline === '') {
      out.deadline = null;
    } else {
      const v = typeof b.deadline === 'string' ? b.deadline.trim() : '';
      // 2026-02-30 passes the pattern but is not a real day, and 2026-13-01 is an
      // Invalid Date (toISOString would throw), so both are caught by the round trip.
      const d = new Date(v);
      const real = DATE_RE.test(v) && !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
      if (!real) errors.push('deadline must be a date in yyyy-mm-dd format');
      else out.deadline = v;
    }

    if (mode === 'update' && !errors.length && Object.keys(out).length === 0) {
      errors.push(`Send at least one of: ${FIELDS.join(', ')}`);
    }

    if (errors.length) throw new BadRequestException(errors);
    return out;
  }
}
