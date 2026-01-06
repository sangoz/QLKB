import { NhanVienMapper } from './entity/nhanvien.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NhanVienDto } from './dto/addNV.dto';
import { LoaiNhanVien } from './entity/nhanvien.entity';

@Injectable()
export class NhanvienRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAllBacSi() {
        const result = await this.prisma.nhanVien.findMany({
            where: { LoaiNV: LoaiNhanVien.BacSi }
        });
        return NhanVienMapper.toEntityList(result);
    }

    async clearRefreshToken(MaNV: string) {
        return this.prisma.nhanVien.update({
            where: { MaNV },
            data: { RefreshToken: null }
        });
    }

    async updatePassword(SDT: string, hashedPassword: string) {
        return this.prisma.nhanVien.update({
            where: { SDT },
            data: { Matkhau: hashedPassword }
        });
    }
    async updateNhanVienToken(refresh_token: string, id: string) {
        return this.prisma.nhanVien.update({
            where: { MaNV: id },
            data: { RefreshToken: refresh_token }
        });
    }

    async findBySDT(SDT: string) {
        const result = await this.prisma.nhanVien.findUnique({ where: { SDT } });
        return result ? NhanVienMapper.toEntity(result) : null;
    }

    async findByRefreshToken(refreshToken: string) {
        const result = await this.prisma.nhanVien.findUnique({ where: { RefreshToken: refreshToken } });
        return result ? NhanVienMapper.toEntity(result) : null;
    }

    async updateRefreshToken(MaNV: string, refresh_token: string) {
        return this.prisma.nhanVien.update({ where: { MaNV }, data: { RefreshToken: refresh_token } });
    }

    async updatePasswordBySDT(SDT: string, hashedPassword: string) {
        return this.prisma.nhanVien.update({ where: { SDT }, data: { Matkhau: hashedPassword } });
    }

    async findByMaNV(MaNV: string) {
        const result = await this.prisma.nhanVien.findUnique({ where: { MaNV } });
        return result ? NhanVienMapper.toEntity(result) : null;
    }

    async findByPhone(SDT: string) {
        return this.prisma.nhanVien.findUnique({ where: { SDT } });
    }

    async createNhanVien(data: NhanVienDto) {
        const result = await this.prisma.nhanVien.create({ data: { ...data, Matkhau: data.Matkhau } });
        return NhanVienMapper.toEntity(result);
    }

    async findAll() {
        const result = await this.prisma.nhanVien.findMany();
        return NhanVienMapper.toEntityList(result);
    }

    async updateNhanVien(id: string, data: NhanVienDto) {
        const result = await this.prisma.nhanVien.update({ where: { MaNV: id }, data });
        return NhanVienMapper.toEntity(result);
    }

    async deleteNhanVien(id: string) {
        return this.prisma.nhanVien.delete({ where: { MaNV: id } });
    }

    async updateAccount(MaNV: string, data: any) {
        const result = await this.prisma.nhanVien.update({ where: { MaNV }, data });
        return NhanVienMapper.toEntity(result);
    }
}
