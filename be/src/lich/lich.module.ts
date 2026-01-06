import { Module, forwardRef } from '@nestjs/common';
import { LichService } from './lich.service';
import { LichController } from './lich.controller';
import { LichRepository } from './lich.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NhanVienModule } from 'src/nhanvien/nhanvien.module';
import { HoadonModule } from 'src/hoadon/hoadon.module';
import { BenhnhanModule } from 'src/benhnhan/benhnhan.module';
import { ChitietdatlichModule } from 'src/chitietdatlich/chitietdatlich.module';

@Module({
  imports: [PrismaModule, NhanVienModule, HoadonModule, BenhnhanModule, forwardRef(() => ChitietdatlichModule)],
  controllers: [LichController],
  providers: [LichService, LichRepository],
  exports: [LichRepository],
})
export class LichModule {}
