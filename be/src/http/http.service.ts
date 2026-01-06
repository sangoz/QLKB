import { Injectable } from '@nestjs/common';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
    constructor(private readonly httpService: AxiosHttpService) { }

    async get(url: string) {
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }

    async post(url: string, data: any) {
        const response = await firstValueFrom(this.httpService.post(url, data));
        return response.data;
    }

} 