import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Render,
  Res,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { ROLES, STATUSES, User } from './user.model';

// What an HTML form sends: every field arrives as text.
export interface UserFormValues {
  email?: string;
  role?: string;
  status?: string;
}

// Web pages for users: every CRUD operation has a route, a method here and,
// for the ones that show something, a template in backend/views/users/.
//
//   GET    /users           index    users/index.hbs    list
//   GET    /users/create    create   users/create.hbs   empty form
//   POST   /users           store    -> /users/:id      save the new user
//   GET    /users/:id       show     users/show.hbs     one user
//   GET    /users/:id/edit  edit     users/edit.hbs     filled form
//   PUT    /users/:id       update   -> /users/:id      save every field
//   PATCH  /users/:id       patch    -> /users/:id      save some fields (status)
//   DELETE /users/:id       destroy  -> /users          remove
//
// Forms send PUT, PATCH and DELETE as POST "?_method=..." (see
// common/method-override.ts). After a change the browser is redirected
// (303), so a refresh never submits a form twice. Rejected input renders the
// form again with the messages (400 invalid, 409 e-mail taken).
// Both this controller and ApiUserController call the same UsersService.
// UsersService waits for the database, so every method here is async.
// Path: /users, set in app.routes.ts.
@ApiExcludeController()
@Controller()
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // READ all: GET /users
  @Get()
  @Render('users/index')
  async index() {
    return { title: 'Users', users: await this.usersService.findAll() };
  }

  // CREATE, form: GET /users/create (declared before ':id' so it is not taken as an id)
  @Get('create')
  @Render('users/create')
  create() {
    return this.createView();
  }

  // CREATE, save: POST /users
  @Post()
  async store(@Body() body: UserFormValues, @Res() res: Response): Promise<void> {
    try {
      const user = await this.usersService.create(body);
      res.redirect(303, `/users/${user.id}`);
    } catch (err) {
      const { status, errors } = this.formErrors(err);
      res.status(status).render('users/create', this.createView(body, errors));
    }
  }

  // READ one: GET /users/:id
  @Get(':id')
  async show(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const user = await this.findUser(id);
    if (!user) return this.notFound(res, id);
    res.render('users/show', this.showView(user));
  }

  // UPDATE, form: GET /users/:id/edit
  @Get(':id/edit')
  async edit(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const user = await this.findUser(id);
    if (!user) return this.notFound(res, id);
    res.render('users/edit', this.editView(user, user));
  }

  // UPDATE, save every field: PUT /users/:id (the edit form)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UserFormValues, @Res() res: Response): Promise<void> {
    const user = await this.findUser(id);
    if (!user) return this.notFound(res, id);
    try {
      await this.usersService.replace(user.id, body);
      res.redirect(303, `/users/${user.id}`);
    } catch (err) {
      const { status, errors } = this.formErrors(err);
      res.status(status).render('users/edit', this.editView(user, body, errors));
    }
  }

  // UPDATE, save some fields: PATCH /users/:id (the status form on the detail page)
  @Patch(':id')
  async patch(@Param('id') id: string, @Body() body: UserFormValues, @Res() res: Response): Promise<void> {
    const user = await this.findUser(id);
    if (!user) return this.notFound(res, id);
    try {
      await this.usersService.update(user.id, body);
      res.redirect(303, `/users/${user.id}`);
    } catch (err) {
      const { status, errors } = this.formErrors(err);
      res.status(status).render('users/show', this.showView(user, errors));
    }
  }

  // DELETE: DELETE /users/:id
  @Delete(':id')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const user = await this.findUser(id);
    if (!user) return this.notFound(res, id);
    await this.usersService.remove(user.id);
    res.redirect(303, '/users');
  }

  // Data for each template

  private createView(values: UserFormValues = {}, errors: string[] = []) {
    return { title: 'New user', roles: ROLES, values, errors };
  }

  private showView(user: User, errors: string[] = []) {
    return { title: user.email, user, statuses: STATUSES, errors };
  }

  private editView(user: User, values: UserFormValues, errors: string[] = []) {
    return { title: `Edit user #${user.id}`, user, roles: ROLES, statuses: STATUSES, values, errors };
  }

  private notFound(res: Response, id: string): void {
    res.status(404).render('users/not-found', { title: 'User not found', id });
  }

  // The user with this id, or undefined if the id is not a number or unknown.
  private async findUser(id: string): Promise<User | undefined> {
    if (!/^\d+$/.test(id)) return undefined;
    try {
      return await this.usersService.findOne(Number(id));
    } catch (err) {
      if (err instanceof NotFoundException) return undefined;
      throw err;
    }
  }

  // The status code and messages of an error thrown by UsersService.
  private formErrors(err: unknown): { status: number; errors: string[] } {
    if (!(err instanceof HttpException)) throw err;
    const response = err.getResponse();
    const message = typeof response === 'string' ? response : (response as { message?: unknown }).message;
    const errors = Array.isArray(message) ? message.map(String) : [String(message ?? err.message)];
    return { status: err.getStatus(), errors };
  }
}
