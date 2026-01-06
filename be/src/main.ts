import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './core/response.interceptor';
import { JwtAuthGuard } from './nhanvien/jwt-auth.guard';
import { RoleGuard } from './nhanvien/role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);


  app.useGlobalGuards(new JwtAuthGuard(reflector), new RoleGuard(reflector));
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe(
    { transform: true, }
  ));



  app.use(cookieParser());


  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
  });

  app.enableCors({
    "origin": "http://localhost:3000",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true,
  });



  await app.listen(configService.get('PORT'));
}

bootstrap();
