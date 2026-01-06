import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { KhoaMapper } from './entity/khoa.mapper';
import { AddKhoaDto } from './dto/add-upkhoa.dto';

@Injectable()
export class KhoaRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        const result = await this.prisma.khoa.findMany();
        return KhoaMapper.toEntityList(result);
    }

    async findById(id: string) {
        const result = await this.prisma.khoa.findUnique({ where: { MaKhoa: id } });
        return result ? KhoaMapper.toEntity(result) : null;
    }

    async findByName(name: string) {
        return this.prisma.khoa.findUnique({ where: { TenKhoa: name } });
    }

    async createKhoa(newKhoa: AddKhoaDto) {
        const result = await this.prisma.khoa.create({
            data: {
                TenKhoa: newKhoa.TenKhoa,
                MoTa: newKhoa.MoTa,
            },
        });
        return KhoaMapper.toEntity(result);
    }

    async updateKhoa(id: string, updatedKhoa: AddKhoaDto) {
        const result = await this.prisma.khoa.update({
            where: { MaKhoa: id },
            data: {
                TenKhoa: updatedKhoa.TenKhoa,
                MoTa: updatedKhoa.MoTa,
            },
        });
        return KhoaMapper.toEntity(result);
    }

    async deleteKhoa(id: string) {
        await this.prisma.khoa.delete({ where: { MaKhoa: id } });
        return true;
    }

    async findByNameLike(name: string) {
        const result = await this.prisma.khoa.findMany({
            where: {
                TenKhoa: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
        });
        return KhoaMapper.toEntityList(result);
    }
}
