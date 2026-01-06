import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChitietdatlichMapper } from './entity/chitietdatlich.mapper';
import { ChitietdatlichDTO } from './dto/cre-upchitietdatlich.dto';

@Injectable()
export class ChitietdatlichRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async findAll() {
        const result = await this.prisma.chiTietLich.findMany({
            include: {
                Lich: true,
                BenhNhan: true,
            },
        });

        return ChitietdatlichMapper.toEntityList(result);
    }

    async findByMaBN(MaBN: string) {
        const result = await this.prisma.chiTietLich.findMany({
            where: { MaBN },
            include: {

                Lich: true,
            },
        });

        return ChitietdatlichMapper.toEntityList(result);
    }

    async findByMaLich(MaLich: string) {
        const result = await this.prisma.chiTietLich.findMany({
            where: { MaLich },
            include: {
                Lich: true,
                BenhNhan: true,
            },
        });

        return ChitietdatlichMapper.toEntityList(result);
    }

    async findByMaLichAndMaBN(MaLich: string, MaBN: string) {
        const result = await this.prisma.chiTietLich.findUnique({
            where: { MaLich_MaBN: { MaLich, MaBN } },
            include: {
                Lich: true,
                BenhNhan: true,
            },
        });

        return result ? ChitietdatlichMapper.toEntity(result) : null;
    }

    async create(data: ChitietdatlichDTO) {
        const result = await this.prisma.chiTietLich.create({
            data,
            include: {
                Lich: true,
            },
        });


        return ChitietdatlichMapper.toEntity(result);
    }


    async delete(MaBN: string, MaLich: string) {
        const result = await this.prisma.chiTietLich.delete({
            where: { MaLich_MaBN: { MaLich, MaBN } },
        });
        return ChitietdatlichMapper.toEntity(result);
    }

    async update(MaBN: string, MaLich: string, data: ChitietdatlichDTO) {
        const result = await this.prisma.chiTietLich.update({
            where: { MaLich_MaBN: { MaLich, MaBN } },
            data,});
        return ChitietdatlichMapper.toEntity(result);
    }
}
