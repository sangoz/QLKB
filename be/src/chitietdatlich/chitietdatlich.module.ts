import { Module, forwardRef } from '@nestjs/common';
import { ChitietdatlichService } from './chitietdatlich.service';
import { ChitietdatlichController } from './chitietdatlich.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChitietdatlichRepository } from './chitietdatlich.repository';
import { BenhnhanModule } from 'src/benhnhan/benhnhan.module';
import { LichModule } from 'src/lich/lich.module';

@Module({
  imports: [PrismaModule, BenhnhanModule, forwardRef(() => LichModule)],
  controllers: [ChitietdatlichController],
  providers: [ChitietdatlichService, ChitietdatlichRepository],
  exports: [ChitietdatlichService, ChitietdatlichRepository],
})
export class ChitietdatlichModule {}
