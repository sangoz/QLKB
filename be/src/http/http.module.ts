import { Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { HttpService } from './http.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        AxiosHttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                timeout: configService.get('HTTP_TIMEOUT'),
                maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [HttpService],
    exports: [HttpService],
})
export class HttpModule { } 