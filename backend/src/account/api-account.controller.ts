import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { ErrorResponse } from '../users/user.dto';
import { AccountPage, AccountService } from './account.service';

// JSON API for the logged-in user's own page (/account). Path: /api/account,
// set in app.routes.ts. There is no :id in the URL: the user is always
// req.user, so nobody can read another user's page through this route.
@ApiTags('account')
@Controller()
export class ApiAccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOperation({
    summary: 'My account',
    description: 'The logged-in user, their alumni profile (ALUMNI) and their job applications (ALUMNI, STUDENT)',
  })
  @ApiOkResponse({ description: '{ user, alumniProfile, applications }; a section the role does not have is null' })
  @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'not logged in' })
  page(@Req() req: Request): Promise<AccountPage> {
    // AuthMiddleware already answers 401 without a login; this keeps the type safe
    if (!req.user) throw new UnauthorizedException('Log in to see your account');
    return this.accountService.page(req.user);
  }
}
