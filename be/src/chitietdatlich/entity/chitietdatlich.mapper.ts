import { LichMapper } from "src/lich/entity/lich.mapper";
import { chitietdatlichEntity } from "./chitietdatlich.entity";

export class ChitietdatlichMapper {
    static toEntity(prisma: any): chitietdatlichEntity {
        return new chitietdatlichEntity(
            prisma.MaLich,
            prisma.MaBN,
            prisma.NgayDat,
            prisma.DonGia,
            prisma.TrangThai,
            prisma.Lich ? LichMapper.toEntity(prisma.Lich) : undefined
        );
    }

    static toEntityList(prismaList: any[]): chitietdatlichEntity[] {
        return prismaList.map(prisma => this.toEntity(prisma));
    }
}