import { Body, Controller, Get, HttpException, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { JobApplicationsService } from './job-applications.service';

// What the apply form sends: every field arrives as text.
export interface ApplyFormValues {
  applicantId?: string;
  coverLetter?: string;
}

// Nested web page: the applications of one job posting, with the apply form.
//
//   GET  /job-postings/:jobPostingId/applications   list   job-applications/posting.hbs
//   POST /job-postings/:jobPostingId/applications   apply  -> same page
//
// Path: set in app.routes.ts as a child of /job-postings, so :jobPostingId
// comes from the parent path, just like the JSON route /api/job-postings/...
@ApiExcludeController()
@Controller()
export class JobPostingApplicationController {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  // READ: GET /job-postings/:jobPostingId/applications
  @Get()
  async index(@Param('jobPostingId') jobPostingId: string, @Res() res: Response): Promise<void> {
    await this.render(res, jobPostingId);
  }

  // CREATE: POST /job-postings/:jobPostingId/applications
  @Post()
  async apply(
    @Param('jobPostingId') jobPostingId: string,
    @Body() body: ApplyFormValues,
    @Res() res: Response,
  ): Promise<void> {
    if (!/^\d+$/.test(jobPostingId)) return this.notFound(res, jobPostingId);
    try {
      // A <select> sends the id as text; the service expects a number (as in the JSON API).
      await this.jobApplicationsService.apply(Number(jobPostingId), {
        applicantId: body.applicantId ? Number(body.applicantId) : undefined,
        coverLetter: body.coverLetter,
      });
      res.redirect(303, `/job-postings/${jobPostingId}/applications`);
    } catch (err) {
      if (!(err instanceof HttpException)) throw err;
      // 400 invalid / not allowed, 404 unknown applicant, 409 already applied
      await this.render(res, jobPostingId, body, this.messages(err), err.getStatus());
    }
  }

  // The page, or the posting's 404 page when the posting does not exist.
  private async render(
    res: Response,
    jobPostingId: string,
    values: ApplyFormValues = {},
    errors: string[] = [],
    status = 200,
  ): Promise<void> {
    if (!/^\d+$/.test(jobPostingId)) return this.notFound(res, jobPostingId);
    try {
      const page = await this.jobApplicationsService.findForJobPostingPage(Number(jobPostingId));
      res.status(status).render('job-applications/posting', {
        title: `Applications: ${page.jobPosting.title}`,
        ...page,
        values,
        errors,
      });
    } catch (err) {
      if (err instanceof NotFoundException) return this.notFound(res, jobPostingId);
      throw err;
    }
  }

  private notFound(res: Response, id: string): void {
    res.status(404).render('job-postings/not-found', { title: 'Job posting not found', id });
  }

  // The messages of an error thrown by JobApplicationsService.
  private messages(err: HttpException): string[] {
    const response = err.getResponse();
    const message = typeof response === 'string' ? response : (response as { message?: unknown }).message;
    return Array.isArray(message) ? message.map(String) : [String(message ?? err.message)];
  }
}
