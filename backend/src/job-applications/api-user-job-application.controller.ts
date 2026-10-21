import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JobApplicationsService } from './job-applications.service';
import { JobApplication } from './job-application.model';

// Nested route: the applications one user has made.
// Path: /api/users/:userId/job-applications, set in app.routes.ts as a child
// of /api/users, so :userId comes from the parent path.
@ApiTags('job-applications')
@Controller()
export class ApiUserJobApplicationController {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  @Get()
  @ApiOperation({ summary: "List one user's job applications, newest first" })
  @ApiParam({ name: 'userId', type: Number, example: 1 })
  findAll(@Param('userId', ParseIntPipe) userId: number): Promise<JobApplication[]> {
    return this.jobApplicationsService.findByApplicant(userId);
  }
}
