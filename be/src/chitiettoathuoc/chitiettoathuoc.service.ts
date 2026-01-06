import { Injectable } from '@nestjs/common';

import { ChitiettoathuocRepository } from './chitiettoathuoc.repository';
import { CreateUpdateChiTietToaThuocDto } from './dto/create-update-chitiettoathuoc.dto';

@Injectable()
export class ChitiettoathuocService {
    constructor(private readonly chitiettoathuocRepository: ChitiettoathuocRepository) {}

    async createChiTietToaThuoc(createUpdateChiTietToaThuocDto: CreateUpdateChiTietToaThuocDto) {
        return await this.chitiettoathuocRepository.create(createUpdateChiTietToaThuocDto);
    }

    async updateChiTietToaThuoc(MaThuoc: string, MaToaThuoc: string, createUpdateChiTietToaThuocDto: CreateUpdateChiTietToaThuocDto) {
        return await this.chitiettoathuocRepository.update(MaThuoc, MaToaThuoc, createUpdateChiTietToaThuocDto);
    }
    
    async deleteChiTietToaThuoc(MaThuoc: string, MaToaThuoc: string) {
        return await this.chitiettoathuocRepository.delete(MaThuoc, MaToaThuoc);
    }
    
    async getChiTietToaThuocById(MaThuoc: string, MaToaThuoc: string) {
        const result = await this.chitiettoathuocRepository.findById(MaThuoc, MaToaThuoc);
        return result ? result : "Chi tiết toa thuốc không tồn tại";
    }

    async getChiTietToaThuocByToaThuoc(MaToaThuoc: string) {
        return await this.chitiettoathuocRepository.findByToaThuoc(MaToaThuoc);
    }

    async getChiTietToaThuocByThuoc(MaThuoc: string) {
        return await this.chitiettoathuocRepository.findByThuoc(MaThuoc);
    }

}