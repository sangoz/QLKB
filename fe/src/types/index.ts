// Database Enums
export enum LoaiNhanVien {
  TiepNhan = "TiepNhan",
  ThuNgan = "ThuNgan", 
  HoTro = "HoTro",
  QuanLyNoiTru = "QuanLyNoiTru",
  BacSi = "BacSi",
  BanGiamDoc = "BanGiamDoc",
  DichVu = "DichVu"
}

export enum TrinhDoBacSi {
  ChuyenKhoaI = "ChuyenKhoaI",
  ChuyenKhoaII = "ChuyenKhoaII",
  ThacSi = "ThacSi",
  TienSi = "TienSi",
  PhoGiaoSu = "PhoGiaoSu",
  GiaoSu = "GiaoSu"
}

export enum BuoiKham {
  Sang = "Sang",
  Chieu = "Chieu"
}

export enum TrangThaiLich {
  Pending = "Pending",
  Accept = "Accept",
  Cancel = "Cancel",
  Done = "Done"
}

export enum TrangThaiHoaDon {
  Pending = "Pending",
  Done = "Done"
}

export enum LoaiHoaDon {
  NhapVien = "NhapVien",
  XuatVien = "XuatVien",
  DichVu = "DichVu",
  KhamBenh = "KhamBenh",
  ToaThuoc = "ToaThuoc"
}

export enum LoaiPhong {
  PhongDon = "PhongDon",
  PhongDoi = "PhongDoi",
  PhongBon = "PhongBon"
}

export enum PhuongThucThanhToan {
  TienMat = "TienMat",
  MoMo = "MoMo"
}

// Main Interfaces
export interface BenhNhan {
  MaBN: string;
  HoTen: string;
  CCCD: string;
  Matkhau?: string;
  RefreshToken?: string;
  SDT: string;
  DiaChi: string;
  MaPhongBenhId?: string;
  PhongBenh?: PhongBenh;
  ChiTietLich?: ChiTietLich[];
  HoaDon?: HoaDon[];
  Phieu?: Phieu[];
  HoSoBenhAn?: HoSoBenhAn[];
  ToaThuoc?: ToaThuoc[];
}

export interface NhanVien {
  MaNV: string;
  HoTen: string;
  NgaySinh: Date;
  SDT: string;
  Matkhau?: string;
  RefreshToken?: string;
  DiaChi: string;
  Luong: number;
  LoaiNV: LoaiNhanVien;
  TrinhDo?: TrinhDoBacSi;
  LaTruongKhoa?: boolean;
  MaKhoaId?: string;
  Khoa?: Khoa;
  Lich?: Lich[];
  HoaDon?: HoaDon[];
  Phieu?: Phieu[];
  PhongBenh?: PhongBenh[];
}

export interface Khoa {
  MaKhoa: string;
  TenKhoa: string;
  MoTa: string;
  NhanVien?: NhanVien[];
}

export interface Lich {
  MaLich: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  Ngay: Date;
  Buoi: BuoiKham;
  Gia: number;
  MaNV: string;
  NhanVien?: NhanVien;
  ChiTietLich?: ChiTietLich[];
}

export interface ChiTietLich {
  MaLich: string;
  MaBN: string;
  NgayDat: Date;
  DonGia: number;
  TrangThai: TrangThaiLich;
  Lich?: Lich;
  BenhNhan?: BenhNhan;
}

export interface HoaDon {
  MaHD: string;
  NgayTao: Date;
  TongTien: number;
  TrangThai: TrangThaiHoaDon;
  LoaiHoaDon: LoaiHoaDon;
  PhuongThucThanhToan: PhuongThucThanhToan;
  MaBN: string;
  MaNV: string;
  BenhNhan?: BenhNhan;
  NhanVien?: NhanVien;
}

export interface PhongBenh {
  MaPhong: string;
  TenPhong: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  LoaiPhong: LoaiPhong;
  MaNV: string;
  NhanVien?: NhanVien;
  BenhNhan?: BenhNhan[];
}

export interface HoSoBenhAn {
  MaHSBA: string;
  TrieuChung: string;
  ChanDoan: string;
  NgayKham?: Date;
  MaBN: string;
  BenhNhan?: BenhNhan;
}

export interface Thuoc {
  MaThuoc: string;
  TenThuoc: string;
  BHYT: boolean;
  Gia: number;
  DonViTinh: string;
  DonViDongGoi: string;
  DangBaoChe: string;
  HamLuong: string;
  SoLuongDongGoi: number;
  ChiTietToaThuoc?: ChiTietToaThuoc[];
}

export interface ToaThuoc {
  MaToaThuoc: string;
  NgayKe: Date;
  TrangThai: string;
  MaBN: string;
  BenhNhan?: BenhNhan;
  ChiTietToaThuoc?: ChiTietToaThuoc[];
}

export interface ChiTietToaThuoc {
  MaThuoc: string;
  MaToaThuoc: string;
  SoLuong: number;
  LieuLuong: string;
  DonGia: number;
  Thuoc?: Thuoc;
  ToaThuoc?: ToaThuoc;
}

export interface DichVu {
  MaDichVu: string;
  TenDichVu: string;
  GiaDichVu: number;
  Phieu?: Phieu[];
}

export interface Phieu {
  MaPYC: string;
  NgayYeuCau: Date;
  DonGia: number;
  Loai: string;
  MaNV: string;
  MaBN: string;
  MaDichVu?: string;
  TrangThai: string;
  NhanVien?: NhanVien;
  BenhNhan?: BenhNhan;
  DichVu?: DichVu;
}

// API Response Types
export interface LoginResponse {
  user: BenhNhan | NhanVien;
  access_token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Form Types
export interface LoginForm {
  SDT: string;
  password: string;
}

export interface RegisterForm {
  HoTen: string;
  CCCD: string;
  SDT: string;
  DiaChi: string;
  Matkhau: string;
  confirmPassword: string;
}

export interface EmployeeForm {
  HoTen: string;
  NgaySinh: string;
  SDT: string;
  DiaChi: string;
  Luong: string;
  LoaiNV: LoaiNhanVien;
  TrinhDo?: TrinhDoBacSi;
  LaTruongKhoa?: boolean;
  MaKhoaId?: string;
}

export interface MedicalRecordForm {
  TrieuChung: string;
  ChanDoan: string;
  NgayKham: string;
  MaBN: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingInvoices: number;
  completedTasks: number;
  totalRevenue?: number;
  monthlyGrowth?: number;
}
