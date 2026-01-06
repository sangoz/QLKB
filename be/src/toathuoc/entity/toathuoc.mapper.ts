import { ToaThuoc } from "./toathuoc.entity";

export class ToaThuocMapper {
    static toEntity(prisma: any): ToaThuoc {
        return new ToaThuoc(
            prisma.MaToaThuoc,
            prisma.MaBN,
            prisma.MaNV,
            prisma.NgayKe,
            prisma.TrangThai
        );
    }

    static toEntityList(prisma: any[]): ToaThuoc[] {
        return prisma.map(this.toEntity);
    }
}
