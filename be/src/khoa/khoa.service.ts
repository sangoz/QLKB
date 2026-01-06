import { BadRequestException, Injectable } from '@nestjs/common';
import { KhoaRepository } from './khoa.repository';
import { AddKhoaDto } from './dto/add-upkhoa.dto';

@Injectable()
export class KhoaService {
    constructor(private readonly khoaRepository: KhoaRepository) {}

    async getAllKhoa() {
        return this.khoaRepository.findAll();
    }

    async getKhoaById(id: string) {
        const result = await this.khoaRepository.findById(id);
        if (!result) {
            throw new BadRequestException('Không tìm thấy khoa với ID này');
        }
        return result;
    }

    async addKhoa(newKhoa: AddKhoaDto) {
        const existingKhoa = await this.khoaRepository.findByName(newKhoa.TenKhoa);
        if (existingKhoa) {
            throw new BadRequestException('Khoa đã tồn tại');
        }
        return this.khoaRepository.createKhoa(newKhoa);
    }

    async updateKhoa(id: string, updatedKhoa: AddKhoaDto) {
        const existingKhoa = await this.khoaRepository.findById(id);
        if (!existingKhoa) {
            throw new BadRequestException('Không tìm thấy khoa với ID này');
        }
        const existingName = await this.khoaRepository.findByName(updatedKhoa.TenKhoa);
        if (existingName && existingName.MaKhoa !== id) {
            throw new BadRequestException('Tên khoa đã tồn tại');
        }
        return this.khoaRepository.updateKhoa(id, updatedKhoa);
    }

    async deleteKhoa(id: string) {
        const existingKhoa = await this.khoaRepository.findById(id);
        if (!existingKhoa) {
            throw new BadRequestException('Không tìm thấy khoa với ID này');
        }
        await this.khoaRepository.deleteKhoa(id);
        return "Xóa khoa thành công";
    }

    async searchKhoaByName(tenKhoa: string) {
        if (!tenKhoa) {
            throw new BadRequestException('Tên khoa không được để trống');
        }
        return this.khoaRepository.findByNameLike(tenKhoa);
    }
}
