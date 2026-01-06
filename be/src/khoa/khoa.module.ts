import { Module } from '@nestjs/common';
import { KhoaService } from './khoa.service';
import { KhoaController } from './khoa.controller';
import { KhoaRepository } from './khoa.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KhoaController],
  providers: [KhoaService, KhoaRepository],
})
export class KhoaModule {}
