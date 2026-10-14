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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './announcement.model';
import {
  AnnouncementResponse,
  CreateAnnouncementDto,
  ReplaceAnnouncementDto,
  UpdateAnnouncementDto,
} from './announcement.dto';
import { ErrorResponse } from '../users/user.dto';

// JSON API for announcements, for programs (Postman, later the React app).
// The HTML pages for people are in AnnouncementController.
// Path: /api/announcements, set in app.routes.ts.
@ApiTags('announcements')
@Controller()
export class ApiAnnouncementController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: 'List all announcements, newest first' })
  @ApiOkResponse({ type: [AnnouncementResponse] })
  findAll(): Promise<Announcement[]> {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one announcement' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: AnnouncementResponse })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'id is not a number' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Announcement> {
    return this.announcementsService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create an announcement' })
  @ApiBody({ type: CreateAnnouncementDto })
  @ApiCreatedResponse({ type: AnnouncementResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  create(@Body() body: unknown): Promise<Announcement> {
    return this.announcementsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace an announcement', description: 'title and content are both required' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: ReplaceAnnouncementDto })
  @ApiOkResponse({ type: AnnouncementResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  replace(@Param('id', ParseIntPipe) id: number, @Body() body: unknown): Promise<Announcement> {
    return this.announcementsService.replace(id, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update part of an announcement', description: 'send title, content or both' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateAnnouncementDto })
  @ApiOkResponse({ type: AnnouncementResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown): Promise<Announcement> {
    return this.announcementsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an announcement' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.announcementsService.remove(id);
  }
}
