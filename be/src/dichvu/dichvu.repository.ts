import { DichVuMapper } from './entity/dichvu.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DichvuRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getAllDichVu() {
        const result = await this.prisma.dichVu.findMany();
        return DichVuMapper.toEntityList(result);
    }

    async createDichVu(createUpdateDichVuDto: any) {
        const result = await this.prisma.dichVu.create({
            data: createUpdateDichVuDto,
        });
        return DichVuMapper.toEntity(result);
    }

    async updateDichVu(MaDichVu: string, createUpdateDichVuDto: any) {
        const result = await this.prisma.dichVu.update({
            where: { MaDichVu },
            data: createUpdateDichVuDto,
        });
        return DichVuMapper.toEntity(result);
    }

    async deleteDichVu(MaDichVu: string) {
        const result = await this.prisma.dichVu.delete({
            where: { MaDichVu },
        });
        return DichVuMapper.toEntity(result);
    }

    async findByMaDichVu(MaDichVu: string) {
        return this.prisma.dichVu.findUnique({ where: { MaDichVu } });
    }


}
