import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApiRegistrationController } from './api-registration.controller';
import { RegistrationModel } from './registration.model';
import { RegistrationService } from './registration.service';

// Sign-up: rules (service), data (model) and the JSON route.
// Mounted at /api/register in app.routes.ts.
@Module({
  imports: [PrismaModule],
  controllers: [ApiRegistrationController],
  providers: [RegistrationService, RegistrationModel],
})
export class ApiRegistrationModule {}
