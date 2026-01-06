import { Module } from '@nestjs/common';
import { ThuocService } from './thuoc.service';
import { ThuocController } from './thuoc.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ThuocRepository } from './thuoc.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ThuocController],
  providers: [ThuocService, ThuocRepository],
})
export class ThuocModule {}