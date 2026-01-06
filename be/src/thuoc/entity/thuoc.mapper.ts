import { ThuocEntity } from "./thuoc.entity";

export class ThuocMapper {
  static toEntity(prisma: any): ThuocEntity {
    return new ThuocEntity(
      prisma.MaThuoc,
      prisma.TenThuoc,
      prisma.BHYT,
      prisma.Gia,
      prisma.DonViTinh,
      prisma.DonViDongGoi,
      prisma.DangBaoChe,
      prisma.HamLuong,
      prisma.SoLuongDongGoi
    );
  }

  static toEntityList(prismaList: any[]): ThuocEntity[] {
    return prismaList.map(prisma => this.toEntity(prisma));
  }
}
