import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUpdateHoadonDto } from './dto/cre-uphoadon.dto';
import { HoadonMapper } from './entity/hoadon.mapper';
import { LoaiHoadon, TrangThaiHoadon } from './entity/hoadon.entity';

import { PhuongThucThanhToan } from '@prisma/client';


@Injectable()
export class HoadonRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getAllHoaDon() {
        const hoaDons = await this.prisma.hoaDon.findMany();
        return HoadonMapper.toEntityList(hoaDons);
    }
    async create(data: CreateUpdateHoadonDto & { MaNV: string }) {
        const createdHoadon = await this.prisma.hoaDon.create({
            data: data
        });

        return HoadonMapper.toEntity(createdHoadon);
    }

    async update(MaHD: string, data: CreateUpdateHoadonDto & { MaNV: string }) {
        const updatedHoadon = await this.prisma.hoaDon.update({
            where: { MaHD },
            data,
        });
        return updatedHoadon ? HoadonMapper.toEntity(updatedHoadon) : null;
    }

    async delete(MaHD: string) {
        const result = await this.prisma.hoaDon.delete({
            where: { MaHD },
        });

        return result ? 'Hóa đơn đã được xóa thành công'  : null;

    }

    async findByMaBN(MaBN: string, LoaiHoaDon?: LoaiHoadon) {
        if (LoaiHoaDon) {
            const result = await this.prisma.hoaDon.findMany({
                where: { MaBN, LoaiHoaDon  },
            });
            return HoadonMapper.toEntityList(result);
        }
        const result = await this.prisma.hoaDon.findMany({
            where: { MaBN },
            orderBy: { NgayTao: 'desc' },

        });
        return HoadonMapper.toEntityList(result);
    }

    async updateStatus(MaHD: string, TrangThai: TrangThaiHoadon) {
        const updatedHoadon = await this.prisma.hoaDon.update({
            where: { MaHD },
            data: { TrangThai },
        });
        return HoadonMapper.toEntity(updatedHoadon);
    }


    async updateMethod(MaHD: string, PhuongThucThanhToan: PhuongThucThanhToan) {
        const updatedHoadon = await this.prisma.hoaDon.update({
            where: { MaHD },
            data: { PhuongThucThanhToan },
        });
        return HoadonMapper.toEntity(updatedHoadon);
    }


    async findByMaHD(MaHD: string) {
        const result = await this.prisma.hoaDon.findUnique({
            where: { MaHD },
        });
        return result ? HoadonMapper.toEntity(result) : null;
    }
}
