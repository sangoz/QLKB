import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function getHashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function clearDatabase() {
  // Xóa theo thứ tự: bảng con trước, bảng cha sau
  await prisma.chiTietToaThuoc.deleteMany();
  await prisma.toaThuoc.deleteMany();
  await prisma.hoSoBenhAn.deleteMany();
  await prisma.chiTietLich.deleteMany();
  await prisma.lich.deleteMany();
  await prisma.phieu.deleteMany();
  await prisma.hoaDon.deleteMany();
  await prisma.phongBenh.deleteMany();
  await prisma.thuoc.deleteMany();
  await prisma.dichVu.deleteMany();
  await prisma.benhNhan.deleteMany();
  await prisma.nhanVien.deleteMany();
  await prisma.khoa.deleteMany();
}

async function main() {
    await clearDatabase();

  const hashedPassword = await getHashPassword('123456');

  // Khoa
  const khoaList = await Promise.all([
    prisma.khoa.create({
      data: {
        MaKhoa: crypto.randomUUID(),
        TenKhoa: 'Khoa Nội',
        MoTa: 'Chuyên khoa nội tổng quát',
      },
    }),
    prisma.khoa.create({
      data: {
        MaKhoa: crypto.randomUUID(),
        TenKhoa: 'Khoa Ngoại',
        MoTa: 'Phẫu thuật tổng quát',
      },
    }),
    prisma.khoa.create({
      data: {
        MaKhoa: crypto.randomUUID(),
        TenKhoa: 'Khoa Nhi',
        MoTa: 'Chăm sóc bệnh nhi',
      },
    }),
  ]);

  // NhanVien
  await Promise.all([
    prisma.nhanVien.create({
      data: {
        MaNV: crypto.randomUUID(),
        HoTen: 'Nguyen Van A',
        NgaySinh: new Date('1980-05-20'),
        SDT: '0912345678',
        Matkhau: hashedPassword,
        DiaChi: '123 Hai Ba Trung, HN',
        Luong: 15000000,
        LoaiNV: 'BacSi',
        TrinhDo: 'ChuyenKhoaI',
        LaTruongKhoa: true,
        MaKhoaId: khoaList[0].MaKhoa,
      },
    }),
    prisma.nhanVien.create({
      data: {
        MaNV: crypto.randomUUID(),
        HoTen: 'Tran Van B',
        NgaySinh: new Date('1985-01-15'),
        SDT: '0923456789',
        Matkhau: hashedPassword,
        DiaChi: '456 Tran Hung Dao, HCM',
        Luong: 12000000,
        LoaiNV: 'BanGiamDoc',
      },
    }),
  ]);

  // BenhNhan
  await Promise.all([
    prisma.benhNhan.create({
      data: {
        MaBN: crypto.randomUUID(),
        HoTen: 'Tran Thi B',
        CCCD: '123456789012',
        Matkhau: hashedPassword,
        SDT: '0987654321',
        DiaChi: '456 Le Loi, HCM',
      },
    }),
    prisma.benhNhan.create({
      data: {
        MaBN: crypto.randomUUID(),
        HoTen: 'Le Van C',
        CCCD: '987654321098',
        Matkhau: hashedPassword,
        SDT: '0971122334',
        DiaChi: '789 Cach Mang Thang Tam, HN',
      },
    }),
  ]);

  // DichVu
  await Promise.all([
    prisma.dichVu.create({
      data: {
        MaDichVu: crypto.randomUUID(),
        TenDichVu: 'Xét nghiệm máu',
        GiaDichVu: 250000,
      },
    }),
    prisma.dichVu.create({
      data: {
        MaDichVu: crypto.randomUUID(),
        TenDichVu: 'Siêu âm ổ bụng',
        GiaDichVu: 400000,
      },
    }),
  ]);

  // Thuoc
  await Promise.all([
    prisma.thuoc.create({
      data: {
        MaThuoc: crypto.randomUUID(),
        TenThuoc: 'Paracetamol 500mg',
        BHYT: true,
        Gia: 2000,
        DonViTinh: 'VIEN',
        DonViDongGoi: 'HOP',
        DangBaoChe: 'VIEN_NEN',
        HamLuong: '500mg',
        SoLuongDongGoi: 10,
      },
    }),
    prisma.thuoc.create({
      data: {
        MaThuoc: crypto.randomUUID(),
        TenThuoc: 'Amoxicillin 500mg',
        BHYT: false,
        Gia: 3500,
        DonViTinh: 'VIEN',
        DonViDongGoi: 'HOP',
        DangBaoChe: 'VIEN_NEN',
        HamLuong: '500mg',
        SoLuongDongGoi: 12,
      },
    }),
  ]);

  console.log('✅ Dữ liệu đã được seed thành công!');
}

main()
  .catch(async (e) => {
    console.error('❌ Lỗi khi seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  