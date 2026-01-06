import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUpdateToaThuocDto } from './dto/create-uptoathuoc.dto';
import { ToaThuocMapper } from './entity/toathuoc.mapper';

@Injectable()
export class ToathuocRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUpdateToaThuocDto: CreateUpdateToaThuocDto) {
        const newToaThuoc = await this.prisma.toaThuoc.create({
            data: createUpdateToaThuocDto,
        });
        return ToaThuocMapper.toEntity(newToaThuoc);
    }

    async update(MaToaThuoc: string, createUpdateToaThuocDto: CreateUpdateToaThuocDto) {
        const updatedToaThuoc = await this.prisma.toaThuoc.update({
            where: { MaToaThuoc },
            data: createUpdateToaThuocDto,
        });
        return ToaThuocMapper.toEntity(updatedToaThuoc);
    }

    async delete(MaToaThuoc: string) {
        // Xóa tất cả chi tiết toa thuốc trước
        await this.prisma.chiTietToaThuoc.deleteMany({
            where: { MaToaThuoc },
        });
        
        // Sau đó xóa toa thuốc
        await this.prisma.toaThuoc.delete({
            where: { MaToaThuoc },
        });
        return "Toa thuốc đã được xóa thành công";
    }

    async findById(MaToaThuoc: string) {
        const toaThuoc = await this.prisma.toaThuoc.findUnique({
            where: { MaToaThuoc },
        });

        return toaThuoc ? ToaThuocMapper.toEntity(toaThuoc) : null;
    }

    async findByIdWithDetails(MaToaThuoc: string) {
        const toaThuoc = await this.prisma.toaThuoc.findUnique({
            where: { MaToaThuoc },
            include: {
                BenhNhan: true,
                ChiTietToaThuoc: {
                    include: {
                        Thuoc: true
                    }
                }
            }
        });

        return toaThuoc;
    }

    async findAll() {
        const toaThuocList = await this.prisma.toaThuoc.findMany({
            include: {
                BenhNhan: true,
                ChiTietToaThuoc: {
                    include: {
                        Thuoc: true
                    }
                }
            }
        });
        
        return toaThuocList.map(toaThuoc => ToaThuocMapper.toEntity(toaThuoc));
    }

    async findByIdWithDetailss(MaToaThuoc: string) {
        const toaThuoc = await this.prisma.toaThuoc.findUnique({
            where: { MaToaThuoc },
            include: {
                BenhNhan: {
                    select: {
                        MaBN: true,
                        HoTen: true,
                        CCCD: true,
                        SDT: true,
                        DiaChi: true
                    }
                },
                ChiTietToaThuoc: {
                    include: {
                        Thuoc: {
                            select: {
                                MaThuoc: true,
                                TenThuoc: true,
                                DonViTinh: true,
                                DangBaoChe: true
                            }
                        }
                    }
                }
            }
        });

        if (!toaThuoc) {
            return null;
        }

        // Format data for printing
        return {
            toaThuoc: ToaThuocMapper.toEntity(toaThuoc),
            benhNhan: toaThuoc.BenhNhan,
            details: toaThuoc.ChiTietToaThuoc.map(detail => ({
                MaThuoc: detail.MaThuoc,
                TenThuoc: detail.Thuoc.TenThuoc,
                SoLuong: detail.SoLuong,
                LieuLuong: detail.LieuLuong,
                DonGia: detail.DonGia,
                DonViTinh: detail.Thuoc.DonViTinh,
                DangBaoChe: detail.Thuoc.DangBaoChe
            }))
        };
    }

}
