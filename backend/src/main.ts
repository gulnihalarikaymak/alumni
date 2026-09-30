import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All API routes live under /api (e.g. /api/health, /api/users).
  // The demo pages stay at the root.
  app.setGlobalPrefix('api', {
    exclude: ['/', 'hello', 'hello/(.*)', 'sum/(.*)', 'about'],
  });

  app.enableCors();

  // Allow direct /health alias in addition to /api/health
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Swagger UI at /api/swagger, raw OpenAPI JSON at /api/swagger-json
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ATS - Alumni Tracking System API')
    .setDescription('Backend routes. Users are held in memory until the database arrives (week 05).')
    .setVersion(process.env.npm_package_version || '0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, document);

  const port = process.env.PORT || process.env.BACKEND_PORT || 3000;
  await app.listen(port);
  console.log(`ATS Backend running on: http://localhost:${port}`);
  console.log(`  - Root (Browser): http://localhost:${port}/ -> "ok"`);
  console.log(`  - Health direct: http://localhost:${port}/health -> {"status":"ok"}`);
  console.log(`  - Health API:    http://localhost:${port}/api/health (browser: status page, curl: JSON)`);
  console.log(`  - Users:         GET/POST http://localhost:${port}/api/users, GET/PUT/PATCH/DELETE /api/users/:id (in memory)`);
  console.log(`  - Swagger UI:    http://localhost:${port}/api/swagger`);
}
bootstrap();
