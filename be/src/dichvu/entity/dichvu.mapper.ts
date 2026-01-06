import { DichVu } from "./dichvu.entity";

export class DichVuMapper {
    static toEntity(prisma: any): DichVu {
        return new DichVu(
            prisma.MaDichVu,
            prisma.TenDichVu,
            prisma.GiaDichVu
        );
    }

    static toEntityList(prismaList: any[]): DichVu[] {
        return prismaList.map(prisma => this.toEntity(prisma));
    }

}