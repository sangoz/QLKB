import { Module } from '@nestjs/common';
import { HosobenhanService } from './hosobenhan.service';
import { HosobenhanController } from './hosobenhan.controller';
import { BenhnhanModule } from 'src/benhnhan/benhnhan.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HosobenhanRepository } from './hosobenhan.repository';
import { ExcelService } from './excel.service';
import { PhieuModule } from 'src/phieu/phieu.module';

@Module({
  imports: [PrismaModule, BenhnhanModule, PhieuModule],
  controllers: [HosobenhanController],
  providers: [HosobenhanService, HosobenhanRepository, ExcelService],
})
export class HosobenhanModule {}
