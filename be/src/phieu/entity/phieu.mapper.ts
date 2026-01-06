import { PhieuEntity } from "./phieu.entity";

export class PhieuMapper {
    static toEntity(prisma: any): PhieuEntity {
        return new PhieuEntity(
            prisma.MaPYC,
            prisma.NgayYeuCau,
            prisma.DonGia,
            prisma.Loai,
            prisma.MaNV,
            prisma.MaBN,
            prisma.TrangThai,
            prisma.MaDichVu,
        );
    }

    static toEntitList(prismaList: any[]): PhieuEntity[] {
        return prismaList.map(prisma => this.toEntity(prisma));
    }

    static toEntitListWithRelations(prismaList: any[]): any[] {
        return prismaList.map(prisma => ({
            MaPYC: prisma.MaPYC,
            NgayYeuCau: prisma.NgayYeuCau,
            DonGia: prisma.DonGia,
            Loai: prisma.Loai,
            MaNV: prisma.MaNV,
            MaBN: prisma.MaBN,
            MaDichVu: prisma.MaDichVu,
            TrangThai: prisma.TrangThai,
            TenBenhNhan: prisma.BenhNhan?.HoTen,
            TenBacSi: prisma.NhanVien?.HoTen,
            TenDichVu: prisma.DichVu?.TenDichVu
        }));
    }
}
