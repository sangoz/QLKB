import { Module } from '@nestjs/common';
import { ToathuocService } from './toathuoc.service';
import { ToathuocController } from './toathuoc.controller';
import { ToathuocRepository } from './toathuoc.repository';
import { ToaThuocPdfService } from './toathuoc-pdf.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ToathuocController],
  providers: [ToathuocService, ToathuocRepository, ToaThuocPdfService],
})
export class ToathuocModule {}
