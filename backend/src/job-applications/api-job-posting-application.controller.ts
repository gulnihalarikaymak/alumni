import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JobApplicationsService } from './job-applications.service';
import { JobApplication } from './job-application.model';

// Nested routes: the applications of one job posting.
// Path: /api/job-postings/:jobPostingId/applications, set in app.routes.ts as a
// child of /api/job-postings, so :jobPostingId comes from the parent path.
@ApiTags('job-applications')
@Controller()
export class ApiJobPostingApplicationController {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  @Get()
  @ApiOperation({ summary: "List one job posting's applications, newest first" })
  @ApiParam({ name: 'jobPostingId', type: Number, example: 1 })
  findAll(@Param('jobPostingId', ParseIntPipe) jobPostingId: number): Promise<JobApplication[]> {
    return this.jobApplicationsService.findByJobPosting(jobPostingId);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Apply to this job posting',
    description: 'Body: applicantId, optional coverLetter. Only ALUMNI and STUDENT may apply.',
  })
  @ApiParam({ name: 'jobPostingId', type: Number, example: 1 })
  apply(
    @Param('jobPostingId', ParseIntPipe) jobPostingId: number,
    @Body() body: unknown,
  ): Promise<JobApplication> {
    return this.jobApplicationsService.apply(jobPostingId, body);
  }
}
