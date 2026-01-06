import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from './http/http.module';
import { HoadonModule } from './hoadon/hoadon.module';
import { KhoaModule } from './khoa/khoa.module';
import { PhieuModule } from './phieu/phieu.module';
import { DichvuModule } from './dichvu/dichvu.module';
import { PhongbenhModule } from './phongbenh/phongbenh.module';
import { BenhnhanModule } from './benhnhan/benhnhan.module';
import { ChitietdatlichModule } from './chitietdatlich/chitietdatlich.module';
import { LichModule } from './lich/lich.module';
import { ThuocModule } from './thuoc/thuoc.module';
import { ToathuocModule } from './toathuoc/toathuoc.module';
import { ChitiettoathuocModule } from './chitiettoathuoc/chitiettoathuoc.module';
import { HosobenhanModule } from './hosobenhan/hosobenhan.module';
import { NhanVienModule } from './nhanvien/nhanvien.module';
import { ThanhtoanmomoModule } from './thanhtoanmomo/thanhtoanmomo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"Doctors Care" <' + config.get('MAIL_FROM') + '>',
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot(
      (() => {
        const publicDir = resolve('./public/images/');
        const servePath = '/images';

        return {
          rootPath: publicDir,
          serveRoot: servePath,
          exclude: ['/api*'],
        };
      })()
    ),

    PrismaModule, HttpModule, HoadonModule, KhoaModule, PhieuModule, DichvuModule, PhongbenhModule, BenhnhanModule, ChitietdatlichModule, LichModule, ThuocModule, ToathuocModule, ChitiettoathuocModule, HosobenhanModule, NhanVienModule, KhoaModule, ThanhtoanmomoModule
  ],
})
export class AppModule { }
