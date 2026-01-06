import { Module } from '@nestjs/common';
import { PhongbenhService } from './phongbenh.service';
import { PhongbenhController } from './phongbenh.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PhongbenhRepository } from './phongbenh.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PhongbenhController],
  providers: [PhongbenhService, PhongbenhRepository],
  exports: [ PhongbenhRepository],
})
export class PhongbenhModule {}