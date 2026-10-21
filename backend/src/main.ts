import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { methodOverride } from './common/method-override';
import { setupViews } from './common/views';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // View layer: Handlebars templates in backend/views/
  setupViews(app);

  // Lets HTML forms send PUT, PATCH and DELETE with "?_method=..."
  app.use(methodOverride);

  // No global prefix: every URL path is defined in app.routes.ts
  // (/users for pages, /api/users and /api/health for JSON). A global 'api'
  // prefix with an exclude list cannot tell /users and /api/users apart.

  app.enableCors();

  // Allow direct /health alias in addition to /api/health
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Swagger UI at /api/swagger, raw OpenAPI JSON at /api/swagger-json
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ATS - Alumni Tracking System API')
    .setDescription('Backend routes. Data is stored in PostgreSQL through Prisma.')
    .setVersion(process.env.npm_package_version || '0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, document);

  const port = process.env.PORT || process.env.BACKEND_PORT || 3000;
  await app.listen(port);
  console.log(`ATS Backend running on: http://localhost:${port}`);
  console.log(`  - Home (Browser): http://localhost:${port}/`);
  console.log(`  - Health direct: http://localhost:${port}/health -> {"status":"ok"}`);
  console.log(`  - Health API:    http://localhost:${port}/api/health (browser: status page, curl: JSON)`);
  console.log(`  - Users (pages): http://localhost:${port}/users (list, create, edit, delete in the browser)`);
  console.log(`  - Users (API):   GET/POST http://localhost:${port}/api/users, GET/PUT/PATCH/DELETE /api/users/:id (PostgreSQL)`);
  console.log(`  - Announcements (pages): http://localhost:${port}/announcements`);
  console.log(`  - Announcements (API):   GET/POST http://localhost:${port}/api/announcements, GET/PUT/PATCH/DELETE /api/announcements/:id (PostgreSQL)`);
  console.log(`  - Job postings (API):    GET/POST http://localhost:${port}/api/job-postings, GET/PUT/PATCH/DELETE /api/job-postings/:id`);
  console.log(`  - Job applications (API): GET http://localhost:${port}/api/job-applications, GET/PATCH/DELETE /api/job-applications/:id, GET/POST /api/job-postings/:jobPostingId/applications, GET /api/users/:userId/job-applications`);
  console.log(`  - Swagger UI:    http://localhost:${port}/api/swagger`);
}
bootstrap();
