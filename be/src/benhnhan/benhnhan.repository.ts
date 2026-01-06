import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BenhNhanMapper } from './entity/benhnhan.mapper';
import { CreaUpDto } from './dto/cre-up.dto';
import { BenhNhan } from './entity/benhnhan.entity';

@Injectable()
export class BenhnhanRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findBySDT(SDT: string) {
        const result = await this.prisma.benhNhan.findUnique({ where: { SDT } });
        return result ? BenhNhanMapper.toEntity(result) : null;
    }

    async updateToken(MaBN: string, refresh_token: string) {
        const result = await this.prisma.benhNhan.update({
            where: { MaBN },
            data: { RefreshToken: refresh_token },
        });
        return BenhNhanMapper.toEntity(result);
    }

    async findByRefreshToken(refreshToken: string) {
        const result = await this.prisma.benhNhan.findUnique({ where: { RefreshToken: refreshToken } });
        return result ? BenhNhanMapper.toEntity(result) : null;
    }

    async updatePasswordBySDT(SDT: string, hashedPassword: string) {
        return this.prisma.benhNhan.update({
            where: { SDT },
            data: { Matkhau: hashedPassword },
        });
    }

    async findByMaBN(MaBN: string) {
        const result = await this.prisma.benhNhan.findUnique({ where: { MaBN } });
        return result ? BenhNhanMapper.toEntity(result) : null;
    }

    async findFirstByCCCDNotMaBN(CCCD: string, MaBN: string) {
        return this.prisma.benhNhan.findFirst({
            where: { CCCD, MaBN: { not: MaBN } },
        });
    }

    async findFirstBySDTNotMaBN(SDT: string, MaBN: string) {
        return this.prisma.benhNhan.findFirst({
            where: { SDT, MaBN: { not: MaBN } },
        });
    }

    async updateByMaBN(MaBN: string, updateData: any) {
        const result = await this.prisma.benhNhan.update({
            where: { MaBN },
            data: updateData,
        });
        return BenhNhanMapper.toEntity(result);
    }

    async findFirstByCCCD(CCCD: string) {
        return this.prisma.benhNhan.findFirst({ where: { CCCD } });
    }

    async findFirstBySDT(SDT: string) {
        return this.prisma.benhNhan.findFirst({ where: { SDT } });
    }

    async createBenhNhan(data: CreaUpDto) {
        const result = await this.prisma.benhNhan.create({
            data: {
                ...data,
                Matkhau: data.Matkhau, // Assuming Matkhau is provided in the DTO
            },
        });

        return BenhNhanMapper.toEntity(result);
    }


    async findByPhong(MaPhong: string) {
        const result = await this.prisma.benhNhan.findMany({ where: { MaPhongBenhId: MaPhong } });
        return BenhNhanMapper.toEntityList(result);
    }

    async findAll() {
        const result = await this.prisma.benhNhan.findMany();
        return BenhNhanMapper.toEntityList(result);

    }

    async findByCCCD(cccd: string) {
        const result = await this.prisma.benhNhan.findFirst({ where: {  CCCD: cccd } });
        return BenhNhanMapper.toEntity(result);
    }
}