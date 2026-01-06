import { LichMapper } from './entity/lich.mapper';
import { Injectable } from '@nestjs/common';
import { BuoiKham } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LichRepository {
    constructor(private readonly prisma: PrismaService) {}
    async createLich(data: any) {
        const result = await this.prisma.lich.create({ data });
        return LichMapper.toEntity(result);
    }

    async updateLich(MaLich: string, data: any) {
        const result = await this.prisma.lich.update({ where: { MaLich }, data });
        return LichMapper.toEntity(result);
    }

    async findLichById(MaLich: string) {
        const result = await this.prisma.lich.findUnique({ where: { MaLich } });
        return result ? LichMapper.toEntity(result) : null;
    }

    async findLichByBacSiToday(MaNV: string, today: Date) {
        const result = await this.prisma.lich.findMany({
            where: { MaNV, Ngay: { gte: today } }, // Lấy các lịch từ ngày hôm nay trở đi
            orderBy: [
                { Ngay: 'asc' },
                { Buoi: 'asc' }
            ],
        });
        return LichMapper.toEntityList(result);
    }

    async findLichByBacSiAndDateRange(MaNV: string, startDate: Date, endDate: Date) {
        const result = await this.prisma.lich.findMany({
            where: { 
                MaNV, 
                Ngay: { 
                    gte: startDate,
                    lte: endDate
                } 
            },
            orderBy: [
                { Ngay: 'asc' },
                { Buoi: 'asc' }
            ],
        });
        return LichMapper.toEntityList(result);
    }

    async deleteLich(MaLich: string) {
        return this.prisma.lich.delete({ where: { MaLich } });
    }

    async findLichByTime(MaNV: string, Ngay: Date, Buoi: BuoiKham) {
        return this.prisma.lich.findFirst({ where: { MaNV, Ngay, Buoi } });
    }

    async findAllLich() {
        const result = await this.prisma.lich.findMany();
        return LichMapper.toEntityList(result);
    }

    async getLichStats() {
        // Lấy danh sách MaBN unique từ bảng ChiTietLich (bệnh nhân đã đặt lịch)
        const benhNhanDaDatLich = await this.prisma.chiTietLich.findMany({
            select: {
                MaBN: true,
            },
            distinct: ['MaBN'],
        });

        // Lấy danh sách MaBN unique từ bảng Phieu với loại KhamBenh (bệnh nhân đã khám)
        const benhNhanDaKham = await this.prisma.phieu.findMany({
            where: {
                Loai: 'KhamBenh',
            },
            select: {
                MaBN: true,
            },
            distinct: ['MaBN'],
        });

        // Tổng số bệnh nhân trong hệ thống
        const tongSoBenhNhan = await this.prisma.benhNhan.count();

        // Số bệnh nhân đã đặt lịch
        const soBenhNhanDaDatLich = benhNhanDaDatLich.length;

        // Số bệnh nhân chưa đặt lịch
        const soBenhNhanChuaDatLich = tongSoBenhNhan - soBenhNhanDaDatLich;

        // Số bệnh nhân đã khám
        const soBenhNhanDaKham = benhNhanDaKham.length;

        // Số bệnh nhân chưa khám
        const soBenhNhanChuaKham = tongSoBenhNhan - soBenhNhanDaKham;

        // Lấy chi tiết số lịch của từng bệnh nhân
        const chiTietLich = await this.prisma.chiTietLich.groupBy({
            by: ['MaBN'],
            _count: {
                _all: true,
            },
        });

        // Lấy chi tiết số lần khám của từng bệnh nhân
        const chiTietKham = await this.prisma.phieu.groupBy({
            where: {
                Loai: 'KhamBenh',
            },
            by: ['MaBN'],
            _count: {
                _all: true,
            },
        });

        return {
            tongSoBenhNhan: tongSoBenhNhan,
            // Thống kê đặt lịch
            soBenhNhanDaDatLich: soBenhNhanDaDatLich,
            soBenhNhanChuaDatLich: soBenhNhanChuaDatLich,
            tyLeDaDatLich: tongSoBenhNhan > 0 ? ((soBenhNhanDaDatLich / tongSoBenhNhan) * 100).toFixed(2) + '%' : '0%',
            tyLeChuaDatLich: tongSoBenhNhan > 0 ? ((soBenhNhanChuaDatLich / tongSoBenhNhan) * 100).toFixed(2) + '%' : '0%',
            // Thống kê khám bệnh
            soBenhNhanDaKham: soBenhNhanDaKham,
            soBenhNhanChuaKham: soBenhNhanChuaKham,
            tyLeDaKham: tongSoBenhNhan > 0 ? ((soBenhNhanDaKham / tongSoBenhNhan) * 100).toFixed(2) + '%' : '0%',
            tyLeChuaKham: tongSoBenhNhan > 0 ? ((soBenhNhanChuaKham / tongSoBenhNhan) * 100).toFixed(2) + '%' : '0%',
            // Chi tiết
            chiTietBenhNhanDaDatLich: chiTietLich.map(stat => ({
                MaBN: stat.MaBN,
                SoLuongLich: stat._count._all,
            })),
            chiTietBenhNhanDaKham: chiTietKham.map(stat => ({
                MaBN: stat.MaBN,
                SoLanKham: stat._count._all,
            }))
        };
    }

    async incrementSoBNHienTai(MaLich: string) {
        return this.prisma.lich.update({
            where: { MaLich },
            data: {
                SoBNHienTai: {
                    increment: 1
                }
            }
        });
    }

    async decrementSoBNHienTai(MaLich: string) {
        // Kiểm tra số bệnh nhân hiện tại trước khi giảm
        const lich = await this.prisma.lich.findUnique({
            where: { MaLich },
            select: { SoBNHienTai: true }
        });
        
        if (!lich || lich.SoBNHienTai <= 0) {
            throw new Error("Không thể giảm số bệnh nhân hiện tại vì đã bằng 0");
        }

        return this.prisma.lich.update({
            where: { MaLich },
            data: {
                SoBNHienTai: {
                    decrement: 1
                }
            }
        });
    }

}
