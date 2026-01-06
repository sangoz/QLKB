import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PhieuMapper } from './entity/phieu.mapper';
import { LoaiPhieu, TrangThaiPhieu } from './entity/phieu.entity';

@Injectable()
export class PhieuRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createPhieu(maNV: string, body: any) {
        const createdPhieu = await this.prisma.phieu.create({
            data: {
                ...body,
                MaNV: maNV,
            },
        });

        return createdPhieu ? PhieuMapper.toEntity(createdPhieu) : null;
    }

    async updatePhieu(maNV: string, MaPYC: string, body: any) {
        const updatedPhieu = await this.prisma.phieu.update({
            where: { MaPYC },
            data: {
                ...body,
                MaNV: maNV,
            },
        });

        return updatedPhieu ? PhieuMapper.toEntity(updatedPhieu) : null;
    }

    async deletePhieu(MaPYC: string) {
        const deletedPhieu = await this.prisma.phieu.delete({
            where: { MaPYC },
        });

        return deletedPhieu ? "Xóa Phieu thành công" : null;
    }

    async getAllPhieu() {
        const phieuList = await this.prisma.phieu.findMany({
            include: {
                NhanVien: {
                    select: {
                        HoTen: true
                    }
                },
                BenhNhan: {
                    select: {
                        HoTen: true
                    }
                },
                DichVu: {
                    select: {
                        TenDichVu: true
                    }
                }
            }
        });
        return PhieuMapper.toEntitListWithRelations(phieuList);
    }

    async getPhieuByLoai(Loai: LoaiPhieu) {
        const phieuList = await this.prisma.phieu.findMany({
            where: {
                Loai,
            },
        });
        return PhieuMapper.toEntitList(phieuList);
    }

    async getPhieuByMaBN(MaBN: string, Loai?: LoaiPhieu) {
        if(Loai){
            const phieuList = await this.prisma.phieu.findMany({
                where: {
                    MaBN,
                    Loai,
                },
            });
            return PhieuMapper.toEntitList(phieuList);
        }
        else {
            const phieuList = await this.prisma.phieu.findMany({
                where: {
                    MaBN,
                },
            });
            return PhieuMapper.toEntitList(phieuList);
        }   
    }

    async findByMaPYC(MaPYC: string) {
        const phieu = await this.prisma.phieu.findUnique({
            where: { MaPYC },
        });
        return phieu ? PhieuMapper.toEntity(phieu) : null;
    }
      

    async updatePhieuKham(MaBN: string, date: Date) {
        const updatedPhieu = await this.prisma.phieu.updateMany({
            where: {
                MaBN,
                Loai: LoaiPhieu.KhamBenh,
                NgayYeuCau: {
                    gte: date
                }
            },
            data: {
                TrangThai: TrangThaiPhieu.Done
            },
        });

        return updatedPhieu;

    }


}
