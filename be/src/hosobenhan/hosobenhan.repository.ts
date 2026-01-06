import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HoSoBenhAnDto } from './dto/HoSoBenhAn.dto';
import { HoSoBenhAnMapper } from './entity/hosobenhan.mapper';

@Injectable()
export class HosobenhanRepository {
    constructor(private readonly prisma: PrismaService) {}
    

    async create(data: HoSoBenhAnDto & { MaNV: string }) {
        const hoSoBenhAn = await this.prisma.hoSoBenhAn.create({
            data
        });
        return HoSoBenhAnMapper.toEntity(hoSoBenhAn);
        
    }

    async findByMaBN(MaBN: string) {
        const hoSoBenhAn = await this.prisma.hoSoBenhAn.findMany({
            where: { MaBN }
        });
        return HoSoBenhAnMapper.toEntityList(hoSoBenhAn);
    }
    async findByMaHSBA(MaHSBA: string) {
        const hoSoBenhAn = await this.prisma.hoSoBenhAn.findUnique({
            where: { MaHSBA }
        });
        return hoSoBenhAn ? HoSoBenhAnMapper.toEntity(hoSoBenhAn) : null;
    }

    async update(MaHSBA: string, data: HoSoBenhAnDto & { MaNV: string }) {
        const hoSoBenhAn = await this.prisma.hoSoBenhAn.update({
            where: { MaHSBA },
            data 
        });
        return hoSoBenhAn ? HoSoBenhAnMapper.toEntity(hoSoBenhAn) : null;
    }

    async findAll() {
        const hoSoBenhAnList = await this.prisma.hoSoBenhAn.findMany();
        return HoSoBenhAnMapper.toEntityList(hoSoBenhAnList);
    }

    async findRecentByDoctor(MaNV: string, limit: number = 10) {
        const hoSoBenhAnList = await this.prisma.hoSoBenhAn.findMany({
            where: { MaNV },
            include: {
                BenhNhan: {
                    select: {
                        HoTen: true,
                        CCCD: true,
                        SDT: true
                    }
                }
            },
            orderBy: {
                NgayKham: 'desc'
            },
            take: limit
        });
        return HoSoBenhAnMapper.toEntityList(hoSoBenhAnList);
    }
}
