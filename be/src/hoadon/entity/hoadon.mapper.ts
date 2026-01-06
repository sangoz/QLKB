import { HoadonEntity } from "./hoadon.entity";

export class HoadonMapper {
    static toEntity(prisma: any): HoadonEntity {
        return new HoadonEntity(
            prisma.MaHD,
            prisma.NgayTao,
            prisma.TongTien,
            prisma.TrangThai,
            prisma.PhuongThucThanhToan,
            prisma.LoaiHoaDon,
            prisma.MaBN,
            prisma.MaNV
        );
    }

    static toEntityList(prismas: any[]): HoadonEntity[] {
        return prismas.map(prisma => this.toEntity(prisma));
    }
}