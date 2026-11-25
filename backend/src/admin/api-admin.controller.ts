import { Controller, Get } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../users/user.dto';
import { AdminModel, AdminSummary } from './admin.model';

// JSON API for the admin panel (/admin). Path: /api/admin, set in app.routes.ts.
// No role check here: AuthMiddleware lets only ADMIN users reach /api/admin
// (auth/access-rules.ts). The panel changes users through the /api/users routes.
@ApiTags('admin')
@Controller()
export class ApiAdminController {
  constructor(private readonly adminModel: AdminModel) {}

  @Get('summary')
  @ApiOperation({ summary: 'Counts for the admin panel', description: 'ADMIN only' })
  @ApiOkResponse({ description: 'users per status and role, and the number of announcements, job postings and applications' })
  @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'not logged in' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'logged in, but not an ADMIN' })
  summary(): Promise<AdminSummary> {
    return this.adminModel.summary();
  }
}
