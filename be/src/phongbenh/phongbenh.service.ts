import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUpdatePhongBenhDto } from './dto/cre-upphongbenh.dto';
import { PhongbenhRepository } from './phongbenh.repository';

@Injectable()
export class PhongbenhService {
    constructor(private phongbenhRepository: PhongbenhRepository) {}

    async getAllPhongBenh() {
        const phongBenhList = await this.phongbenhRepository.findAllPhongBenh();
        return phongBenhList;
    }

    async createPhongBenh(createUpdatePhongBenhDto: CreateUpdatePhongBenhDto) {
        return await this.phongbenhRepository.createPhongBenh({...createUpdatePhongBenhDto, SoBNHienTai: 0});
    }

    async updatePhongBenh(MaPhong: string, createUpdatePhongBenhDto: CreateUpdatePhongBenhDto) {
        const existingPhongBenh = await this.phongbenhRepository.findByMaPhong(MaPhong);
        if (!existingPhongBenh) {
            throw new BadRequestException(`Phong Benh với MaPhong ${MaPhong} không tồn tại.`);
        }
        return await this.phongbenhRepository.updatePhongBenh(MaPhong, createUpdatePhongBenhDto);
    }

    async deletePhongBenh(MaPhong: string) {
        const existingPhongBenh = await this.phongbenhRepository.findByMaPhong(MaPhong);
        if (!existingPhongBenh) {
            throw new BadRequestException(`Phong Benh với MaPhong ${MaPhong} không tồn tại.`);
        }
        if (existingPhongBenh.SoBNHienTai > 0) {
            throw new BadRequestException(`Phong Benh với MaPhong ${MaPhong} không thể xóa vì vẫn còn bệnh nhân.`);
        }

        await this.phongbenhRepository.deletePhongBenh(MaPhong);

        return "Phong Benh đã được xóa thành công.";
    }


}
