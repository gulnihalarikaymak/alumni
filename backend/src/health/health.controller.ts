import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { renderHealthPage } from './health.page';

const SERVICE_NAME = 'alumni-backend';
const SERVICE_VERSION = process.env.npm_package_version || '0.1.0';

export interface HealthPayload {
  status: 'ok';
  service: string;
  version: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
}

export function buildHealthPayload(): HealthPayload {
  return {
    status: 'ok',
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Browsers (Accept: text/html) get a status page; curl, Postman and
 * monitors get JSON. `?format=json` forces JSON in the browser too.
 */
function sendHealth(req: Request, res: Response, format?: string): void {
  const payload = buildHealthPayload();
  const wantsHtml =
    format !== 'json' && (req.headers.accept || '').includes('text/html');

  if (wantsHtml) {
    res.type('html').send(renderHealthPage(payload, req.path));
  } else {
    res.json(payload);
  }
}

// GET /api/health
@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Liveness check', description: 'JSON for API clients; a status page when opened in a browser' })
  @ApiQuery({ name: 'format', required: false, enum: ['json'], description: 'Force JSON in the browser' })
  @ApiOkResponse({
    schema: {
      example: { status: 'ok', service: 'alumni-backend', version: '0.1.0', environment: 'development', uptimeSeconds: 42, timestamp: '2026-09-30T07:20:02.070Z' },
    },
  })
  getHealth(
    @Req() req: Request,
    @Res() res: Response,
    @Query('format') format?: string,
  ): void {
    sendHealth(req, res, format);
  }
}
