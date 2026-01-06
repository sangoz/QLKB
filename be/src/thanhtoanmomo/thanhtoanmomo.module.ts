import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThanhtoanmomoService } from './thanhtoanmomo.service';
import { ThanhtoanmomoController } from './thanhtoanmomo.controller';
import { ThanhtoanmomoRepository } from './thanhtoanmomo.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HoadonModule } from 'src/hoadon/hoadon.module';
import { ChitietdatlichModule } from 'src/chitietdatlich/chitietdatlich.module';

@Module({
  imports: [
    PrismaModule, 
    ConfigModule,
    forwardRef(() => HoadonModule),
    forwardRef(() => ChitietdatlichModule)
  ],
  controllers: [ThanhtoanmomoController],
  providers: [ThanhtoanmomoService, ThanhtoanmomoRepository],
  exports: [ThanhtoanmomoService], // Export service for use in other modules
})
export class ThanhtoanmomoModule {}
