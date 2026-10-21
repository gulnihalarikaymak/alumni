import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JobPostingsService } from './job-postings.service';
import { JobPosting } from './job-posting.model';

// Nested routes: the job postings of one user.
// Path: /api/users/:userId/job-postings, set in app.routes.ts as a child of
// /api/users, so :userId comes from the parent path.
@ApiTags('job-postings')
@Controller()
export class ApiUserJobPostingController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Get()
  @ApiOperation({ summary: "List one user's job postings, newest first" })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  findAll(@Param('userId', ParseIntPipe) userId: number): Promise<JobPosting[]> {
    return this.jobPostingsService.findByPoster(userId);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a job posting for this user', description: 'STUDENT users cannot post' })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  create(@Param('userId', ParseIntPipe) userId: number, @Body() body: unknown): Promise<JobPosting> {
    return this.jobPostingsService.createForUser(userId, body);
  }
}
