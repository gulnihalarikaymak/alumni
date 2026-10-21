import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JobPostingsService } from './job-postings.service';
import { JobPosting } from './job-posting.model';

// Direct routes: a job posting addressed by its own id.
// Path: /api/job-postings, set in app.routes.ts.
// The nested route under a posting (/:jobPostingId/applications) is in
// ApiJobPostingApplicationController.
@ApiTags('job-postings')
@Controller()
export class ApiJobPostingController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all job postings, newest first' })
  findAll(): Promise<JobPosting[]> {
    return this.jobPostingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one job posting' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<JobPosting> {
    return this.jobPostingsService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a job posting' })
  create(@Body() body: unknown): Promise<JobPosting> {
    return this.jobPostingsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace a job posting' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  replace(@Param('id', ParseIntPipe) id: number, @Body() body: unknown): Promise<JobPosting> {
    return this.jobPostingsService.replace(id, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update part of a job posting' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown): Promise<JobPosting> {
    return this.jobPostingsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a job posting' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.jobPostingsService.remove(id);
  }
}
