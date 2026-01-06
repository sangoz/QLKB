import { Module } from '@nestjs/common';
import { ChitiettoathuocService } from './chitiettoathuoc.service';
import { ChitiettoathuocController } from './chitiettoathuoc.controller';

import { ChitiettoathuocRepository } from './chitiettoathuoc.repository';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChitiettoathuocController],
  providers: [ChitiettoathuocService, ChitiettoathuocRepository],
})
export class ChitiettoathuocModule {}