import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUpdateChiTietToaThuocDto } from './dto/create-update-chitiettoathuoc.dto';
import { ChiTietToaThuocMapper } from './entity/chitiettoathuoc.mapper';

@Injectable()
export class ChitiettoathuocRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUpdateChiTietToaThuocDto: CreateUpdateChiTietToaThuocDto) {
        const newChiTietToaThuoc = await this.prisma.chiTietToaThuoc.create({
            data: createUpdateChiTietToaThuocDto,
        });
        return ChiTietToaThuocMapper.toEntity(newChiTietToaThuoc);
    }

    async update(MaThuoc: string, MaToaThuoc: string, createUpdateChiTietToaThuocDto: CreateUpdateChiTietToaThuocDto) {
        const updatedChiTietToaThuoc = await this.prisma.chiTietToaThuoc.update({
            where: {
                MaThuoc_MaToaThuoc: {
                    MaThuoc,
                    MaToaThuoc
                }
            },
            data: createUpdateChiTietToaThuocDto,
        });
        return ChiTietToaThuocMapper.toEntity(updatedChiTietToaThuoc);
    }

    async delete(MaThuoc: string, MaToaThuoc: string) {
        await this.prisma.chiTietToaThuoc.delete({
            where: {
                MaThuoc_MaToaThuoc: {
                    MaThuoc,
                    MaToaThuoc
                }
            },
        });
        return "Chi tiết toa thuốc đã được xóa thành công";
    }

    async findById(MaThuoc: string, MaToaThuoc: string) {
        const chiTietToaThuoc = await this.prisma.chiTietToaThuoc.findUnique({
            where: {
                MaThuoc_MaToaThuoc: {
                    MaThuoc,
                    MaToaThuoc
                }
            },
            include: {
                Thuoc: true,
                ToaThuoc: true
            }
        });

        return chiTietToaThuoc ? ChiTietToaThuocMapper.toEntity(chiTietToaThuoc) : null;
    }

    async findByToaThuoc(MaToaThuoc: string) {
        const chiTietToaThuocList = await this.prisma.chiTietToaThuoc.findMany({
            where: { MaToaThuoc },
            include: {
                Thuoc: true,
                ToaThuoc: true
            }
        });

        return chiTietToaThuocList.map(item => ChiTietToaThuocMapper.toEntity(item));
    }

    async findByThuoc(MaThuoc: string) {
        const chiTietToaThuocList = await this.prisma.chiTietToaThuoc.findMany({
            where: { MaThuoc },
            include: {
                Thuoc: true,
                ToaThuoc: true
            }
        });

        return chiTietToaThuocList.map(item => ChiTietToaThuocMapper.toEntity(item));
    }
}
