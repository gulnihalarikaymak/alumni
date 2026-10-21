import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JobApplicationsService } from './job-applications.service';
import { JobApplication } from './job-application.model';

// Direct routes: a job application addressed by its own id.
// Path: /api/job-applications, set in app.routes.ts.
// Applying goes through the nested route under the posting
// (ApiJobPostingApplicationController).
@ApiTags('job-applications')
@Controller()
export class ApiJobApplicationController {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all job applications, newest first' })
  findAll(): Promise<JobApplication[]> {
    return this.jobApplicationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one job application' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<JobApplication> {
    return this.jobApplicationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update status and/or cover letter' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown): Promise<JobApplication> {
    return this.jobApplicationsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete (withdraw) a job application' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.jobApplicationsService.remove(id);
  }
}
