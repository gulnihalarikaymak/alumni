import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '../users/user.dto';
import { RegisterDto, RegistrationResponse } from './registration.dto';
import { Registration } from './registration.model';
import { RegistrationService } from './registration.service';

// JSON API for signing up. The /register page sends its form here.
// Path: /api/register, set in app.routes.ts.
@ApiTags('registration')
@Controller()
export class ApiRegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Register a new account',
    description: 'STUDENT, ALUMNI or STAFF. The account starts as PENDING. ALUMNI also send fullName and graduationYear.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: RegistrationResponse })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiConflictResponse({ type: ErrorResponse, description: 'e-mail already in use' })
  register(@Body() body: unknown): Promise<Registration> {
    return this.registrationService.register(body);
  }
}
