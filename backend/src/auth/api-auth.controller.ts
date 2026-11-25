import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ErrorResponse } from '../users/user.dto';
import { User } from '../users/user.model';
import { LoginDto, LoginResponse, MeResponse } from './auth.dto';
import { AuthService } from './auth.service';
import { clearSessionCookie, readSessionToken, setSessionCookie } from './session-cookie';

// JSON API for login and logout. The /login page and the header use it.
// Path: /api/auth, set in app.routes.ts. Only this controller touches the cookie.
@ApiTags('auth')
@Controller()
export class ApiAuthController {
  constructor(private readonly authService: AuthService) {}

  // passthrough: Nest still sends the returned object as JSON; we only add the cookie
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in', description: 'Sets the ats_session cookie. Only ACTIVE accounts can log in.' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'e-mail or password is incorrect' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'the account is not ACTIVE' })
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response): Promise<{ user: User }> {
    const { user, token } = await this.authService.login(body);
    setSessionCookie(res, token);
    return { user };
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Log out', description: 'Ends the session of the cookie and clears it' })
  @ApiNoContentResponse({ description: 'Logged out (also when nobody was logged in)' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.authService.logout(readSessionToken(req));
    clearSessionCookie(res);
  }

  @Get('me')
  @ApiOperation({ summary: 'Who is logged in', description: 'user is null when nobody is logged in' })
  @ApiOkResponse({ type: MeResponse })
  async me(@Req() req: Request): Promise<{ user: User | null }> {
    return { user: await this.authService.currentUser(readSessionToken(req)) };
  }
}
