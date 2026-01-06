import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUpdatePhongBenhDto } from './dto/cre-upphongbenh.dto';
import { PhongBenhMapper } from './entity/phongbenh.mapper';

@Injectable()
export class PhongbenhRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAllPhongBenh() {
        const result = await this.prisma.phongBenh.findMany();
        return PhongBenhMapper.toEntityList(result);
    }

    async createPhongBenh(data: CreateUpdatePhongBenhDto) {
        const result = await this.prisma.phongBenh.create({ data });
        return PhongBenhMapper.toEntity(result);
    }

    async findByMaPhong(MaPhong: string) {
        const result = await this.prisma.phongBenh.findUnique({ where: { MaPhong } });
        return result ? PhongBenhMapper.toEntity(result) : null;
    }

    async updatePhongBenh(MaPhong: string, data: CreateUpdatePhongBenhDto) {
        const result = await this.prisma.phongBenh.update({ where: { MaPhong }, data });
        return PhongBenhMapper.toEntity(result);
    }

    async deletePhongBenh(MaPhong: string) {
        const result = await this.prisma.phongBenh.delete({ where: { MaPhong } });
        return PhongBenhMapper.toEntity(result);
    }
    
    async changeSoBenhNhan(MaPhong: string, increment: boolean) {
        const updateData = increment
            ? { SoBNHienTai: { increment: 1 } }
            : { SoBNHienTai: { decrement: 1 } };
        const result = await this.prisma.phongBenh.update({
            where: { MaPhong },
            data: updateData,
        });
        return PhongBenhMapper.toEntity(result);
    }
}
