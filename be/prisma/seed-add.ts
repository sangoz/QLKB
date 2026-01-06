import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  const nhanVienList = await prisma.nhanVien.findMany();
  const benhNhanList = await prisma.benhNhan.findMany();

  // Seed dữ liệu mẫu cho Lich
  const lichList = await Promise.all([
    prisma.lich.create({
      data: {
        MaLich: crypto.randomUUID(),

        SoBNHienTai: 1,
        SoBNToiDa: 10,
        Ngay: new Date('2025-08-05'),
        Buoi: 'Sang',
        Gia: 200000,
        MaNV: nhanVienList[0].MaNV,
      },
    }),
    prisma.lich.create({
      data: {
        MaLich: crypto.randomUUID(),

        SoBNHienTai: 2,
        SoBNToiDa: 15,
        Ngay: new Date('2025-08-06'),
        Buoi: 'Chieu',
        Gia: 250000,
        MaNV: nhanVienList[1].MaNV,
      },
    }),
  ]);

  // Seed dữ liệu mẫu cho ChiTietLich
  await Promise.all([
    prisma.chiTietLich.create({
      data: {
        MaLich: lichList[0].MaLich,
        MaBN: benhNhanList[0].MaBN,

        NgayDat: new Date('2025-08-01'),
        DonGia: 200000,
        TrangThai: 'Pending',
      },
    }),
    prisma.chiTietLich.create({
      data: {
        MaLich: lichList[1].MaLich,

        MaBN: benhNhanList[1].MaBN,
        NgayDat: new Date('2025-08-02'),
        DonGia: 250000,
        TrangThai: 'Accept',
      },
    }),
  ]);

  // Seed dữ liệu mẫu cho HoaDon
  const hoaDonList = await Promise.all([
    prisma.hoaDon.create({
      data: {
        MaHD: crypto.randomUUID(),

        NgayTao: new Date('2025-08-03'),
        TongTien: 200000,
        TrangThai: 'Pending',
        LoaiHoaDon: 'KhamBenh',
        PhuongThucThanhToan: 'TienMat',
        MaBN: benhNhanList[0].MaBN,
        MaNV: nhanVienList[0].MaNV,
      },
    }),
    prisma.hoaDon.create({
      data: {
        MaHD: crypto.randomUUID(),

        NgayTao: new Date('2025-08-04'),
        TongTien: 500000,
        TrangThai: 'Done',
        LoaiHoaDon: 'DichVu',
        PhuongThucThanhToan: 'MoMo',
        MaBN: benhNhanList[1].MaBN,
        MaNV: nhanVienList[1].MaNV,
      },
    }),
  ]);

   const dichVuList = await Promise.all([
    prisma.dichVu.create({
      data: {
        MaDichVu: crypto.randomUUID(),
        TenDichVu: 'Khám tổng quát',
        GiaDichVu: 500000,
      },
    }),
    prisma.dichVu.create({
      data: {
        MaDichVu: crypto.randomUUID(),
        TenDichVu: 'Xét nghiệm máu',
        GiaDichVu: 300000,
      },
    }),
  ]);
}

seedData()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();

  });

export {};
