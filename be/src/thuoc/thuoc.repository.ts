import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ThuocMapper } from './entity/thuoc.mapper';
import { CreateUpdateThuocDto } from './dto/cre-upthuoc.dto';

@Injectable()
export class ThuocRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getAllThuoc() {
        const result = await this.prisma.thuoc.findMany();
        return ThuocMapper.toEntityList(result);
    }

    async createThuoc(data: CreateUpdateThuocDto) {
        const result = await this.prisma.thuoc.create({ data });
        return ThuocMapper.toEntity(result);
    }

    async findByMaThuoc(MaThuoc: string) {
        const result = await this.prisma.thuoc.findUnique({ where: { MaThuoc } });
        return result ? ThuocMapper.toEntity(result) : null;
    }

    async updateThuoc(MaThuoc: string, data: CreateUpdateThuocDto) {
        const result = await this.prisma.thuoc.update({ where: { MaThuoc }, data });
        return ThuocMapper.toEntity(result);
    }

    async deleteThuoc(MaThuoc: string) {
        return this.prisma.thuoc.delete({ where: { MaThuoc } });
    }
}
