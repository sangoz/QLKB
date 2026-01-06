import { BenhNhan } from './benhnhan.entity';

export class BenhNhanMapper {
  static toEntity(prisma: any): BenhNhan {
    if (prisma.Matkhau) {
      return BenhNhan.withPassword(
        prisma.MaBN,
        prisma.HoTen,
        prisma.CCCD,
        prisma.SDT,
        prisma.DiaChi,
        prisma.Matkhau,
        prisma.MaPhongBenhId
      );
    }

    return new BenhNhan(
      prisma.MaBN,
      prisma.HoTen,
      prisma.CCCD,
      prisma.SDT,
      prisma.DiaChi,
      prisma.MaPhongBenhId
    );
  }

  static toEntityList(prismaList: any[]): BenhNhan[] {
    return prismaList.map(prisma => BenhNhanMapper.toEntity(prisma));
  }
}