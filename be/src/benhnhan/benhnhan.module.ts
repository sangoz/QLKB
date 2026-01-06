import { Module } from '@nestjs/common';
import { BenhnhanService } from './benhnhan.service';
import { BenhnhanController } from './benhnhan.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import ms from 'ms';
import { BenhNhanJwtStrategy } from './passport/jwt.strategy';
import { BenhnhanRepository } from './benhnhan.repository';
import { PhongbenhModule } from 'src/phongbenh/phongbenh.module';

@Module({
  imports: [PrismaModule, PassportModule, PhongbenhModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        signOptions: {
          expiresIn: ms(configService.get<string>("JWT_ACCESS_EXPIRED")) / 1000
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [BenhnhanService, BenhNhanJwtStrategy, BenhnhanRepository],
  controllers: [BenhnhanController],
  exports: [BenhnhanRepository]
})
export class BenhnhanModule {}
