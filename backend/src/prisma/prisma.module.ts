import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Every feature module that stores data imports this one. Nest creates
// PrismaService once, so the whole app shares one connection pool.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
