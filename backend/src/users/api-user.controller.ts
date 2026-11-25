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
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { User } from './user.model';
import {
  CreateUserDto,
  ErrorResponse,
  ReplaceUserDto,
  UpdateUserDto,
  UserResponse,
} from './user.dto';

// JSON API for users. Returns data for programs (Postman, the React app).
// Every change here is ADMIN only (auth/access-rules.ts); an admin cannot lock themselves out.
// The HTML pages for people are in UserController.
// Path: /api/users, set in app.routes.ts.
@ApiTags('users')
@Controller()
export class ApiUserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ type: [UserResponse] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: UserResponse })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'id is not a number' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a user', description: 'status always starts as PENDING' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiConflictResponse({ type: ErrorResponse, description: 'e-mail already in use' })
  create(@Body() body: unknown): Promise<User> {
    return this.usersService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace a user', description: 'email, role and status are all required' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: ReplaceUserDto })
  @ApiOkResponse({ type: UserResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  @ApiConflictResponse({ type: ErrorResponse, description: 'e-mail already in use' })
  replace(@Param('id', ParseIntPipe) id: number, @Body() body: unknown, @Req() req: Request): Promise<User> {
    return this.usersService.replace(id, body, req.user); // req.user: set by AuthMiddleware
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update part of a user', description: 'send at least one of email, role, status' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  @ApiConflictResponse({ type: ErrorResponse, description: 'e-mail already in use' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown, @Req() req: Request): Promise<User> {
    return this.usersService.update(id, body, req.user);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiNotFoundResponse({ type: ErrorResponse })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<void> {
    return this.usersService.remove(id, req.user);
  }
}
