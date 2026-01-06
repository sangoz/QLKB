import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUpdateDichVuDto } from './dto/cre-up.dichvu.dto';
import { DichvuRepository } from './dichvu.repository';

@Injectable()
export class DichvuService {
    constructor(private readonly dichvuRepository: DichvuRepository,) {}


    async createDichVu(createUpdateDichVuDto: CreateUpdateDichVuDto) {
        return this.dichvuRepository.createDichVu(createUpdateDichVuDto);
    }

    async updateDichVu(MaDichVu: string, createUpdateDichVuDto: CreateUpdateDichVuDto) {
        const existing = await this.dichvuRepository.findByMaDichVu(MaDichVu);
        if (!existing) {
            throw new BadRequestException(`Dịch vụ với MaDichVu ${MaDichVu} không tồn tại.`);
        }
        const updated = this.dichvuRepository.updateDichVu(MaDichVu, createUpdateDichVuDto);
        return updated;
    }

    async deleteDichVu(MaDichVu: string) {
        const existing = await this.dichvuRepository.findByMaDichVu(MaDichVu);
        if (!existing) {
            throw new BadRequestException(`Dịch vụ với MaDichVu ${MaDichVu} không tồn tại.`);
        }
        const deleted = await this.dichvuRepository.deleteDichVu(MaDichVu);
        if (deleted) {
            return "Dịch vụ đã được xóa thành công.";
        }
    }

    async getAllDichVu() {
        return this.dichvuRepository.getAllDichVu();
    }

}
