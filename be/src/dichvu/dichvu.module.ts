import { Module } from '@nestjs/common';
import { DichvuService } from './dichvu.service';
import { DichvuController } from './dichvu.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DichvuRepository } from './dichvu.repository';
import { BenhnhanRepository } from 'src/benhnhan/benhnhan.repository';

@Module({
  imports: [PrismaModule],
  controllers: [DichvuController],
  providers: [DichvuService, DichvuRepository],
  exports: [DichvuRepository],
})
export class DichvuModule {}