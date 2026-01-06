import { Module } from '@nestjs/common';
import { HoadonService } from './hoadon.service';
import { HoadonController } from './hoadon.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HoadonRepository } from './hoadon.repository';
import { BenhnhanModule } from 'src/benhnhan/benhnhan.module';
import { PdfService } from './pdf.service';

@Module({
  imports: [PrismaModule, BenhnhanModule],
  controllers: [HoadonController],
  providers: [HoadonService, HoadonRepository, PdfService],
  exports: [HoadonService, HoadonRepository],
})
export class HoadonModule {}
