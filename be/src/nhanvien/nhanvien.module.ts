import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NhanVienService } from './nhanvien.service';
import { NhanVienController } from './nhanvien.controller';
import { NhanvienRepository } from './nhanvien.repository';
import { KhoaRepository } from '../khoa/khoa.repository';

@Module({
  imports: [PrismaModule, PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_ACCESS_TOKEN_SECRET_NHANVIEN"),
        signOptions: {
          expiresIn: ms(configService.get<string>("JWT_ACCESS_EXPIRED_NHANVIEN")) / 1000
        }
      }),
      inject: [ConfigService]
    })
  ],

  providers: [NhanVienService, JwtStrategy, NhanvienRepository, KhoaRepository],
  controllers: [NhanVienController],
  exports: [NhanVienService, NhanvienRepository]
})
export class NhanVienModule { }