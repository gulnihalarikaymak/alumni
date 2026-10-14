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
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './announcement.model';

// What an HTML form sends: every field arrives as text.
export interface AnnouncementFormValues {
  title?: string;
  content?: string;
}

// Web pages for announcements. Templates are in backend/views/announcements/.
//
//   GET    /announcements           index    announcements/index.hbs    list
//   GET    /announcements/create    create   announcements/create.hbs   empty form
//   POST   /announcements           store    -> /announcements/:id      save the new one
//   GET    /announcements/:id       show     announcements/show.hbs     one announcement
//   GET    /announcements/:id/edit  edit     announcements/edit.hbs     filled form
//   PUT    /announcements/:id       update   -> /announcements/:id      save changes
//   DELETE /announcements/:id       destroy  -> /announcements          remove
//
// Forms send PUT and DELETE as POST "?_method=..." (common/method-override.ts).
// After a change the browser is redirected (303); rejected input renders the
// form again with the messages (400).
// Both this controller and ApiAnnouncementController call AnnouncementsService.
// The service waits for the database, so every method here is async.
// Path: /announcements, set in app.routes.ts.
@ApiExcludeController()
@Controller()
export class AnnouncementController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // READ all: GET /announcements
  @Get()
  @Render('announcements/index')
  async index() {
    return { title: 'Announcements', announcements: await this.announcementsService.findAll() };
  }

  // CREATE, form: GET /announcements/create (before ':id' so it is not taken as an id)
  @Get('create')
  @Render('announcements/create')
  create() {
    return this.createView();
  }

  // CREATE, save: POST /announcements
  @Post()
  async store(@Body() body: AnnouncementFormValues, @Res() res: Response): Promise<void> {
    try {
      const announcement = await this.announcementsService.create(body);
      res.redirect(303, `/announcements/${announcement.id}`);
    } catch (err) {
      const { status, errors } = this.formErrors(err);
      res.status(status).render('announcements/create', this.createView(body, errors));
    }
  }

  // READ one: GET /announcements/:id
  @Get(':id')
  async show(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const announcement = await this.find(id);
    if (!announcement) return this.notFound(res, id);
    res.render('announcements/show', { title: announcement.title, announcement });
  }

  // UPDATE, form: GET /announcements/:id/edit
  @Get(':id/edit')
  async edit(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const announcement = await this.find(id);
    if (!announcement) return this.notFound(res, id);
    res.render('announcements/edit', this.editView(announcement, announcement));
  }

  // UPDATE, save: PUT /announcements/:id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: AnnouncementFormValues,
    @Res() res: Response,
  ): Promise<void> {
    const announcement = await this.find(id);
    if (!announcement) return this.notFound(res, id);
    try {
      await this.announcementsService.replace(announcement.id, body);
      res.redirect(303, `/announcements/${announcement.id}`);
    } catch (err) {
      const { status, errors } = this.formErrors(err);
      res.status(status).render('announcements/edit', this.editView(announcement, body, errors));
    }
  }

  // DELETE: DELETE /announcements/:id
  @Delete(':id')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const announcement = await this.find(id);
    if (!announcement) return this.notFound(res, id);
    await this.announcementsService.remove(announcement.id);
    res.redirect(303, '/announcements');
  }

  // Data for each template

  private createView(values: AnnouncementFormValues = {}, errors: string[] = []) {
    return { title: 'New announcement', values, errors };
  }

  private editView(announcement: Announcement, values: AnnouncementFormValues, errors: string[] = []) {
    return { title: `Edit announcement #${announcement.id}`, announcement, values, errors };
  }

  private notFound(res: Response, id: string): void {
    res.status(404).render('announcements/not-found', { title: 'Announcement not found', id });
  }

  // The announcement with this id, or undefined if the id is not a number or unknown.
  private async find(id: string): Promise<Announcement | undefined> {
    if (!/^\d+$/.test(id)) return undefined;
    try {
      return await this.announcementsService.findOne(Number(id));
    } catch (err) {
      if (err instanceof NotFoundException) return undefined;
      throw err;
    }
  }

  // The status code and messages of an error thrown by AnnouncementsService.
  private formErrors(err: unknown): { status: number; errors: string[] } {
    if (!(err instanceof HttpException)) throw err;
    const response = err.getResponse();
    const message = typeof response === 'string' ? response : (response as { message?: unknown }).message;
    const errors = Array.isArray(message) ? message.map(String) : [String(message ?? err.message)];
    return { status: err.getStatus(), errors };
  }
}
