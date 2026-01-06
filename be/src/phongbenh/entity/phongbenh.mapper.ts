import { PhongBenh } from "./phongbenh.entity";

export class PhongBenhMapper {
    static toEntity(prisma: any): PhongBenh {
        return new PhongBenh(
            prisma.MaPhong,
            prisma.TenPhong,
            prisma.SoBNHienTai,
            prisma.SoBNToiDa,
            prisma.LoaiPhong,
            prisma.MaNV
        );
    }

    static toEntityList(prismaList: any[]): PhongBenh[] {
        return prismaList.map(prisma => this.toEntity(prisma));
    }

    
}
