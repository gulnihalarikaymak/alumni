import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Render,
  Res,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { JobApplicationsService } from './job-applications.service';
import { APPLICATION_STATUSES, JobApplicationDetails } from './job-application.model';

// What the status form sends: every field arrives as text.
export interface JobApplicationFormValues {
  status?: string;
  coverLetter?: string;
}

// Web pages for job applications. Templates are in backend/views/job-applications/.
//
//   GET    /job-applications       index    job-applications/index.hbs  all applications
//   GET    /job-applications/:id   show     job-applications/show.hbs   one, with its form
//   PATCH  /job-applications/:id   update   -> /job-applications/:id    status / cover letter
//   DELETE /job-applications/:id   destroy  -> /job-applications        withdraw
//
// Applying is done on the posting's page, /job-postings/:jobPostingId/applications
// (JobPostingApplicationController), because an application needs its posting.
// Path: /job-applications, set in app.routes.ts.
@ApiExcludeController()
@Controller()
export class JobApplicationController {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  // READ all: GET /job-applications
  @Get()
  @Render('job-applications/index')
  async index() {
    return {
      title: 'Job applications',
      applications: await this.jobApplicationsService.findAllDetails(),
    };
  }

  // READ one: GET /job-applications/:id
  @Get(':id')
  async show(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const application = await this.find(id);
    if (!application) return this.notFound(res, id);
    res.render('job-applications/show', this.showView(application, application));
  }

  // UPDATE some fields: PATCH /job-applications/:id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: JobApplicationFormValues,
    @Res() res: Response,
  ): Promise<void> {
    const application = await this.find(id);
    if (!application) return this.notFound(res, id);
    try {
      await this.jobApplicationsService.update(application.id, body);
      res.redirect(303, `/job-applications/${application.id}`);
    } catch (err) {
      const { status, errors } = this.formErrors(err);
      res.status(status).render('job-applications/show', this.showView(application, body, errors));
    }
  }

  // DELETE: DELETE /job-applications/:id
  @Delete(':id')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const application = await this.find(id);
    if (!application) return this.notFound(res, id);
    await this.jobApplicationsService.remove(application.id);
    res.redirect(303, '/job-applications');
  }

  // Data for each template

  private showView(
    application: JobApplicationDetails,
    values: JobApplicationFormValues | JobApplicationDetails,
    errors: string[] = [],
  ) {
    return {
      title: `Application #${application.id}`,
      application,
      statuses: APPLICATION_STATUSES,
      values,
      errors,
    };
  }

  private notFound(res: Response, id: string): void {
    res.status(404).render('job-applications/not-found', { title: 'Application not found', id });
  }

  // The application with this id, or undefined if the id is not a number or unknown.
  private async find(id: string): Promise<JobApplicationDetails | undefined> {
    if (!/^\d+$/.test(id)) return undefined;
    try {
      return await this.jobApplicationsService.findOneDetails(Number(id));
    } catch (err) {
      if (err instanceof NotFoundException) return undefined;
      throw err;
    }
  }

  // The status code and messages of an error thrown by JobApplicationsService.
  private formErrors(err: unknown): { status: number; errors: string[] } {
    if (!(err instanceof HttpException)) throw err;
    const response = err.getResponse();
    const message = typeof response === 'string' ? response : (response as { message?: unknown }).message;
    const errors = Array.isArray(message) ? message.map(String) : [String(message ?? err.message)];
    return { status: err.getStatus(), errors };
  }
}
