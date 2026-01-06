import { Module } from '@nestjs/common';
import { PhieuService } from './phieu.service';
import { PhieuController } from './phieu.controller';
import { PhieuRepository } from './phieu.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BenhnhanModule } from 'src/benhnhan/benhnhan.module';
import { DichvuModule } from 'src/dichvu/dichvu.module';
import { PhieuPdfService } from './phieu-pdf.service';
import { NhanVienModule } from 'src/nhanvien/nhanvien.module';


@Module({
  imports: [PrismaModule, BenhnhanModule, DichvuModule, NhanVienModule],
  controllers: [PhieuController],
  providers: [PhieuService, PhieuRepository, PhieuPdfService],
exports: [ PhieuRepository]
})
export class PhieuModule {}