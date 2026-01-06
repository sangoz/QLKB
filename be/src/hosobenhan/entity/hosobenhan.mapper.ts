import { HoSoBenhAnEntity } from "./hosobenhnhan.entity";

export class HoSoBenhAnMapper {
    static toEntity(prisma: any): HoSoBenhAnEntity {
        return new HoSoBenhAnEntity(
            prisma.MaHSBA,
            prisma.TrieuChung,
            prisma.ChanDoan,
            prisma.MaBN,
            prisma.MaNV,
            prisma.NgayKham
        );
    }

    static toEntityList(prismas: any[]): HoSoBenhAnEntity[] {
        return prismas.map(prisma => this.toEntity(prisma));
    }

   
}