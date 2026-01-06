import { BadRequestException, Injectable } from '@nestjs/common';
import { ThuocRepository } from './thuoc.repository';
import { CreateUpdateThuocDto } from './dto/cre-upthuoc.dto';

@Injectable()
export class ThuocService {
    constructor(private thuocRepository: ThuocRepository) {}

    async getAllThuoc() {
        return await this.thuocRepository.getAllThuoc();
    }

    async createThuoc(thuocDto: CreateUpdateThuocDto) {
        return await this.thuocRepository.createThuoc(thuocDto);
    }

    updateThuoc = async (MaThuoc: string, thuocDto: CreateUpdateThuocDto) => {
        const isExist = await this.thuocRepository.findByMaThuoc(MaThuoc);
        if (!isExist) throw new BadRequestException('Thuốc không tồn tại');
        return await this.thuocRepository.updateThuoc(MaThuoc, thuocDto);
    }

    deleteThuoc = async (MaThuoc: string) => {
        const isExist = await this.thuocRepository.findByMaThuoc(MaThuoc);
        if (!isExist) throw new BadRequestException('Thuốc không tồn tại');
        await this.thuocRepository.deleteThuoc(MaThuoc);
        return 'Xoá thuốc thành công';
    }

    getThuocById = async (MaThuoc: string) => {
        const thuoc = await this.thuocRepository.findByMaThuoc(MaThuoc);
        if (!thuoc) throw new BadRequestException('Thuốc không tồn tại');
        return thuoc;
    }
}
