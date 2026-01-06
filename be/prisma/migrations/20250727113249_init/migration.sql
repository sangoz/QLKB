-- CreateEnum
CREATE TYPE "LoaiNhanVien" AS ENUM ('TiepNhan', 'ThuNgan', 'HoTro', 'QuanLyNoiTru', 'BacSi', 'BanGiamDoc', 'DichVu');

-- CreateEnum
CREATE TYPE "TrinhDoBacSi" AS ENUM ('ChuyenKhoaI', 'ChuyenKhoaII', 'ThacSi', 'TienSi', 'PhoGiaoSu', 'GiaoSu');

-- CreateEnum
CREATE TYPE "BuoiKham" AS ENUM ('Sang', 'Chieu');

-- CreateEnum
CREATE TYPE "TrangThaiLich" AS ENUM ('Pending', 'Accept', 'Cancel', 'Done');

-- CreateEnum
CREATE TYPE "TrangThaiHoaDon" AS ENUM ('Pending', 'Done');

-- CreateEnum
CREATE TYPE "LoaiHoaDon" AS ENUM ('NhapVien', 'XuatVien', 'DichVu', 'KhamBenh', 'ToaThuoc');

-- CreateEnum
CREATE TYPE "LoaiPhieu" AS ENUM ('NhapVien', 'XuatVien', 'DichVu', 'KhamBenh');

-- CreateEnum
CREATE TYPE "TrangThaiPhieu" AS ENUM ('Pending', 'Payed', 'Done');

-- CreateEnum
CREATE TYPE "TrangThaiThuoc" AS ENUM ('Pending', 'Payed', 'Done');

-- CreateEnum
CREATE TYPE "LoaiPhong" AS ENUM ('PhongDon', 'PhongDoi', 'PhongBon');

-- CreateEnum
CREATE TYPE "DonViTinh" AS ENUM ('VIEN', 'ONG', 'CHAI', 'LO', 'TUYP', 'ML', 'G', 'MCG', 'VY');

-- CreateEnum
CREATE TYPE "DonViDongGoi" AS ENUM ('HOP', 'HOP_VI', 'HOP_ONG', 'THUNG', 'CHAI_LO', 'GOI');

-- CreateEnum
CREATE TYPE "DangBaoChe" AS ENUM ('VIEN_NEN', 'VIEN_NANG', 'DUNG_DICH', 'BOT_PHA_TIEM', 'THUOC_TIEU_KHONG', 'DICH_TRUYEN', 'SIRUP', 'DUNG_DICH_SAT_TRUNG', 'THUOC_BOI', 'XI_DANG', 'VIEN_NGAM');

-- CreateEnum
CREATE TYPE "PhuongThucThanhToan" AS ENUM ('TienMat', 'MoMo');

-- CreateTable
CREATE TABLE "NhanVien" (
    "MaNV" TEXT NOT NULL,
    "HoTen" TEXT NOT NULL,
    "NgaySinh" TIMESTAMP(3) NOT NULL,
    "SDT" TEXT NOT NULL,
    "Matkhau" TEXT NOT NULL,
    "RefreshToken" TEXT,
    "DiaChi" TEXT NOT NULL,
    "Luong" DECIMAL(65,30) NOT NULL,
    "LoaiNV" "LoaiNhanVien" NOT NULL,
    "TrinhDo" "TrinhDoBacSi",
    "LaTruongKhoa" BOOLEAN,
    "MaKhoaId" TEXT,

    CONSTRAINT "NhanVien_pkey" PRIMARY KEY ("MaNV")
);

-- CreateTable
CREATE TABLE "Khoa" (
    "MaKhoa" TEXT NOT NULL,
    "TenKhoa" TEXT NOT NULL,
    "MoTa" TEXT NOT NULL,

    CONSTRAINT "Khoa_pkey" PRIMARY KEY ("MaKhoa")
);

-- CreateTable
CREATE TABLE "Lich" (
    "MaLich" TEXT NOT NULL,
    "SoBNHienTai" INTEGER NOT NULL,
    "SoBNToiDa" INTEGER NOT NULL,
    "Ngay" TIMESTAMP(3) NOT NULL,
    "Buoi" "BuoiKham" NOT NULL,
    "Gia" DECIMAL(65,30) NOT NULL,
    "MaNV" TEXT NOT NULL,

    CONSTRAINT "Lich_pkey" PRIMARY KEY ("MaLich")
);

-- CreateTable
CREATE TABLE "ChiTietLich" (
    "MaLich" TEXT NOT NULL,
    "MaBN" TEXT NOT NULL,
    "NgayDat" TIMESTAMP(3) NOT NULL,
    "DonGia" DECIMAL(65,30) NOT NULL,
    "TrangThai" "TrangThaiLich" NOT NULL,

    CONSTRAINT "ChiTietLich_pkey" PRIMARY KEY ("MaLich","MaBN")
);

-- CreateTable
CREATE TABLE "BenhNhan" (
    "MaBN" TEXT NOT NULL,
    "HoTen" TEXT NOT NULL,
    "CCCD" TEXT NOT NULL,
    "Matkhau" TEXT NOT NULL,
    "RefreshToken" TEXT,
    "SDT" TEXT NOT NULL,
    "DiaChi" TEXT NOT NULL,
    "MaPhongBenhId" TEXT,

    CONSTRAINT "BenhNhan_pkey" PRIMARY KEY ("MaBN")
);

-- CreateTable
CREATE TABLE "HoaDon" (
    "MaHD" TEXT NOT NULL,
    "NgayTao" TIMESTAMP(3) NOT NULL,
    "TongTien" DECIMAL(65,30) NOT NULL,
    "TrangThai" "TrangThaiHoaDon" NOT NULL,
    "LoaiHoaDon" "LoaiHoaDon" NOT NULL,
    "PhuongThucThanhToan" "PhuongThucThanhToan" NOT NULL,
    "MaBN" TEXT NOT NULL,
    "MaNV" TEXT NOT NULL,

    CONSTRAINT "HoaDon_pkey" PRIMARY KEY ("MaHD")
);

-- CreateTable
CREATE TABLE "Phieu" (
    "MaPYC" TEXT NOT NULL,
    "NgayYeuCau" TIMESTAMP(3) NOT NULL,
    "DonGia" DECIMAL(65,30) NOT NULL,
    "Loai" "LoaiPhieu" NOT NULL,
    "MaNV" TEXT NOT NULL,
    "MaBN" TEXT NOT NULL,
    "MaDichVu" TEXT,
    "TrangThai" "TrangThaiPhieu" NOT NULL,

    CONSTRAINT "Phieu_pkey" PRIMARY KEY ("MaPYC")
);

-- CreateTable
CREATE TABLE "DichVu" (
    "MaDichVu" TEXT NOT NULL,
    "TenDichVu" TEXT NOT NULL,
    "GiaDichVu" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DichVu_pkey" PRIMARY KEY ("MaDichVu")
);

-- CreateTable
CREATE TABLE "PhongBenh" (
    "MaPhong" TEXT NOT NULL,
    "TenPhong" TEXT NOT NULL,
    "SoBNHienTai" INTEGER NOT NULL,
    "SoBNToiDa" INTEGER NOT NULL,
    "LoaiPhong" "LoaiPhong" NOT NULL,
    "MaNV" TEXT NOT NULL,

    CONSTRAINT "PhongBenh_pkey" PRIMARY KEY ("MaPhong")
);

-- CreateTable
CREATE TABLE "HoSoBenhAn" (
    "MaHSBA" TEXT NOT NULL,
    "TrieuChung" TEXT NOT NULL,
    "ChanDoan" TEXT NOT NULL,
    "NgayKham" TIMESTAMP(3),
    "MaBN" TEXT NOT NULL,

    CONSTRAINT "HoSoBenhAn_pkey" PRIMARY KEY ("MaHSBA")
);

-- CreateTable
CREATE TABLE "Thuoc" (
    "MaThuoc" TEXT NOT NULL,
    "TenThuoc" TEXT NOT NULL,
    "BHYT" BOOLEAN NOT NULL,
    "Gia" DECIMAL(65,30) NOT NULL,
    "DonViTinh" "DonViTinh" NOT NULL,
    "DonViDongGoi" "DonViDongGoi" NOT NULL,
    "DangBaoChe" "DangBaoChe" NOT NULL,
    "HamLuong" TEXT NOT NULL,
    "SoLuongDongGoi" INTEGER NOT NULL,

    CONSTRAINT "Thuoc_pkey" PRIMARY KEY ("MaThuoc")
);

-- CreateTable
CREATE TABLE "ToaThuoc" (
    "MaToaThuoc" TEXT NOT NULL,
    "NgayKe" TIMESTAMP(3) NOT NULL,
    "TrangThai" "TrangThaiThuoc" NOT NULL,
    "MaBN" TEXT NOT NULL,

    CONSTRAINT "ToaThuoc_pkey" PRIMARY KEY ("MaToaThuoc")
);

-- CreateTable
CREATE TABLE "ChiTietToaThuoc" (
    "MaThuoc" TEXT NOT NULL,
    "MaToaThuoc" TEXT NOT NULL,
    "SoLuong" INTEGER NOT NULL,
    "LieuLuong" TEXT NOT NULL,
    "DonGia" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ChiTietToaThuoc_pkey" PRIMARY KEY ("MaThuoc","MaToaThuoc")
);

-- CreateIndex
CREATE UNIQUE INDEX "NhanVien_SDT_key" ON "NhanVien"("SDT");

-- CreateIndex
CREATE UNIQUE INDEX "BenhNhan_CCCD_key" ON "BenhNhan"("CCCD");

-- AddForeignKey
ALTER TABLE "NhanVien" ADD CONSTRAINT "NhanVien_MaKhoaId_fkey" FOREIGN KEY ("MaKhoaId") REFERENCES "Khoa"("MaKhoa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lich" ADD CONSTRAINT "Lich_MaNV_fkey" FOREIGN KEY ("MaNV") REFERENCES "NhanVien"("MaNV") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietLich" ADD CONSTRAINT "ChiTietLich_MaLich_fkey" FOREIGN KEY ("MaLich") REFERENCES "Lich"("MaLich") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietLich" ADD CONSTRAINT "ChiTietLich_MaBN_fkey" FOREIGN KEY ("MaBN") REFERENCES "BenhNhan"("MaBN") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenhNhan" ADD CONSTRAINT "BenhNhan_MaPhongBenhId_fkey" FOREIGN KEY ("MaPhongBenhId") REFERENCES "PhongBenh"("MaPhong") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoaDon" ADD CONSTRAINT "HoaDon_MaBN_fkey" FOREIGN KEY ("MaBN") REFERENCES "BenhNhan"("MaBN") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoaDon" ADD CONSTRAINT "HoaDon_MaNV_fkey" FOREIGN KEY ("MaNV") REFERENCES "NhanVien"("MaNV") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phieu" ADD CONSTRAINT "Phieu_MaNV_fkey" FOREIGN KEY ("MaNV") REFERENCES "NhanVien"("MaNV") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phieu" ADD CONSTRAINT "Phieu_MaBN_fkey" FOREIGN KEY ("MaBN") REFERENCES "BenhNhan"("MaBN") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phieu" ADD CONSTRAINT "Phieu_MaDichVu_fkey" FOREIGN KEY ("MaDichVu") REFERENCES "DichVu"("MaDichVu") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhongBenh" ADD CONSTRAINT "PhongBenh_MaNV_fkey" FOREIGN KEY ("MaNV") REFERENCES "NhanVien"("MaNV") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoSoBenhAn" ADD CONSTRAINT "HoSoBenhAn_MaBN_fkey" FOREIGN KEY ("MaBN") REFERENCES "BenhNhan"("MaBN") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToaThuoc" ADD CONSTRAINT "ToaThuoc_MaBN_fkey" FOREIGN KEY ("MaBN") REFERENCES "BenhNhan"("MaBN") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietToaThuoc" ADD CONSTRAINT "ChiTietToaThuoc_MaThuoc_fkey" FOREIGN KEY ("MaThuoc") REFERENCES "Thuoc"("MaThuoc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietToaThuoc" ADD CONSTRAINT "ChiTietToaThuoc_MaToaThuoc_fkey" FOREIGN KEY ("MaToaThuoc") REFERENCES "ToaThuoc"("MaToaThuoc") ON DELETE RESTRICT ON UPDATE CASCADE;
