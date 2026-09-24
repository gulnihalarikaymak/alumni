import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for API routes, excluding root '/'
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'hello', 'hello/(.*)', 'sum/(.*)', 'about'],
  });

  app.enableCors();

  // Allow direct /health alias in addition to /api/v1/health
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/health', (req, res) => res.json({ status: 'ok' }));

  const port = process.env.PORT || process.env.BACKEND_PORT || 3000;
  await app.listen(port);
  console.log(`ATS Backend running on: http://localhost:${port}`);
  console.log(`  - Root (Browser): http://localhost:${port}/ -> "ok"`);
  console.log(`  - Health direct: http://localhost:${port}/health -> {"status":"ok"}`);
  console.log(`  - Health API v1: http://localhost:${port}/api/v1/health -> {"status":"ok"}`);
}
bootstrap();
