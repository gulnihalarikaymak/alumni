import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Render,
  Res,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { JobPostingsService } from './job-postings.service';
import { EMPLOYMENT_TYPES, JobPosting, WORK_TYPES } from './job-posting.model';

// What an HTML form sends: every field arrives as text. An empty optional
// field arrives as "", which the service stores as empty (null).
export interface JobPostingFormValues {
  title?: string;
  company?: string;
  location?: string;
  workType?: string;
  employmentType?: string;
  description?: string;
  applyUrl?: string;
  deadline?: string;
}

// Web pages for job postings. Templates are in backend/views/job-postings/.
//
//   GET    /job-postings           index    job-postings/index.hbs    list
//   GET    /job-postings/create    create   job-postings/create.hbs   empty form
//   POST   /job-postings           store    -> /job-postings/:id      save the new one
//   GET    /job-postings/:id       show     job-postings/show.hbs     one posting
//   GET    /job-postings/:id/edit  edit     job-postings/edit.hbs     filled form
//   PUT    /job-postings/:id       update   -> /job-postings/:id      save changes
//   DELETE /job-postings/:id       destroy  -> /job-postings          remove (and its applications)
//
// A posting's applications have their own nested page,
// /job-postings/:jobPostingId/applications (JobPostingApplicationController).
// Same flow as the announcement pages: 303 redirect after a change, the form
// again with the messages (400) when the input is rejected.
// Both this controller and ApiJobPostingController call JobPostingsService.
// Path: /job-postings, set in app.routes.ts.
@ApiExcludeController()
@Controller()
export class JobPostingController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  // READ all: GET /job-postings
  @Get()
  @Render('job-postings/index')
  async index() {
    return { title: 'Job postings', jobPostings: await this.jobPostingsService.findAll() };
  }

  // CREATE, form: GET /job-postings/create (before ':id' so it is not taken as an id)
  @Get('create')
  @Render('job-postings/create')
  create() {
    return this.createView();
  }

  // CREATE, save: POST /job-postings
  @Post()
  async store(@Body() body: JobPostingFormValues, @Res() res: Response): Promise<void> {
    try {
      const jobPosting = await this.jobPostingsService.create(body);
      res.redirect(303, `/job-postings/${jobPosting.id}`);
    } catch (err) {
      const { status, errors } = this.formErrors(err);
      res.status(status).render('job-postings/create', this.createView(body, errors));
    }
  }

  // READ one: GET /job-postings/:id
  @Get(':id')
  async show(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const jobPosting = await this.find(id);
    if (!jobPosting) return this.notFound(res, id);
    res.render('job-postings/show', { title: jobPosting.title, jobPosting });
  }

  // UPDATE, form: GET /job-postings/:id/edit
  @Get(':id/edit')
  async edit(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const jobPosting = await this.find(id);
    if (!jobPosting) return this.notFound(res, id);
    res.render('job-postings/edit', this.editView(jobPosting, jobPosting));
  }

  // UPDATE, save: PUT /job-postings/:id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: JobPostingFormValues,
    @Res() res: Response,
  ): Promise<void> {
    const jobPosting = await this.find(id);
    if (!jobPosting) return this.notFound(res, id);
    try {
      await this.jobPostingsService.replace(jobPosting.id, body);
      res.redirect(303, `/job-postings/${jobPosting.id}`);
    } catch (err) {
      const { status, errors } = this.formErrors(err);
      res.status(status).render('job-postings/edit', this.editView(jobPosting, body, errors));
    }
  }

  // DELETE: DELETE /job-postings/:id (the database cascades to its applications)
  @Delete(':id')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const jobPosting = await this.find(id);
    if (!jobPosting) return this.notFound(res, id);
    await this.jobPostingsService.remove(jobPosting.id);
    res.redirect(303, '/job-postings');
  }

  // Data for each template

  private createView(values: JobPostingFormValues = {}, errors: string[] = []) {
    return {
      title: 'New job posting',
      workTypes: WORK_TYPES,
      employmentTypes: EMPLOYMENT_TYPES,
      values,
      errors,
    };
  }

  private editView(
    jobPosting: JobPosting,
    values: JobPostingFormValues | JobPosting,
    errors: string[] = [],
  ) {
    return {
      title: `Edit job posting #${jobPosting.id}`,
      jobPosting,
      workTypes: WORK_TYPES,
      employmentTypes: EMPLOYMENT_TYPES,
      values,
      errors,
    };
  }

  private notFound(res: Response, id: string): void {
    res.status(404).render('job-postings/not-found', { title: 'Job posting not found', id });
  }

  // The posting with this id, or undefined if the id is not a number or unknown.
  private async find(id: string): Promise<JobPosting | undefined> {
    if (!/^\d+$/.test(id)) return undefined;
    try {
      return await this.jobPostingsService.findOne(Number(id));
    } catch (err) {
      if (err instanceof NotFoundException) return undefined;
      throw err;
    }
  }

  // The status code and messages of an error thrown by JobPostingsService.
  private formErrors(err: unknown): { status: number; errors: string[] } {
    if (!(err instanceof HttpException)) throw err;
    const response = err.getResponse();
    const message = typeof response === 'string' ? response : (response as { message?: unknown }).message;
    const errors = Array.isArray(message) ? message.map(String) : [String(message ?? err.message)];
    return { status: err.getStatus(), errors };
  }
}
