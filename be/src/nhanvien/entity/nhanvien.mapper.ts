import { NhanVien } from './nhanvien.entity';

export class NhanVienMapper {
  static toEntity(prisma: any): NhanVien {
    if (prisma.Matkhau) {
      return NhanVien.withPassword(
        prisma.MaNV,
        prisma.HoTen,
        prisma.NgaySinh,
        prisma.SDT,
        prisma.DiaChi,
        prisma.Luong,
        prisma.LoaiNV,
        prisma.Matkhau,
        prisma.TrinhDo,
        prisma.LaTruongKhoa,
        prisma.MaKhoaId
      );
    }
    return new NhanVien(
      prisma.MaNV,
      prisma.HoTen,
      prisma.NgaySinh,
      prisma.SDT,
      prisma.DiaChi,
      prisma.Luong,
      prisma.LoaiNV,
      prisma.TrinhDo,
      prisma.LaTruongKhoa,
      prisma.MaKhoaId,
    );
  }

  static toEntityList(prismaList: any[]): NhanVien[] {
    return prismaList.map(prisma => this.toEntity(prisma));
  }
}
