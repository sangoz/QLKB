import { KhoaEntity } from "./khoa.entity";

export class KhoaMapper {
  static toEntity(prisma: any): KhoaEntity {
    return new KhoaEntity(
      prisma.MaKhoa,
      prisma.TenKhoa,
      prisma.MoTa
    );
  }

  static toEntityList(prismaList: any[]): KhoaEntity[] {
    return prismaList.map(this.toEntity);
  }
}
