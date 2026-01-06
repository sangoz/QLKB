import axiosInstance from '../axiosCustomize';
// Interfaces for API responses
export interface Lich {
  MaLich: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  Ngay: string;
  Buoi: string;
  Gia: string;
  MaNV: string;
}

export interface HoaDon {
  MaHD: string;
  NgayTao: string;
  TongTien: string;
  TrangThai: string;
  PhuongThucThanhToan: string;
  MaBN: string;
  MaNV: string;
}

export interface NhanVien {
  MaNV: string;
  HoTen: string;
  NgaySinh: string;
  SDT: string;
  DiaChi: string;
  Luong: string;
  LoaiNV: string;
  TrinhDo: string | null;
  LaTruongKhoa: boolean | null;
  MaKhoaId: string | null;
}

export interface PhongBenh {
  MaPhong: string;
  TenPhong: string;
  SoBNHienTai: number;
  SoBNToiDa: number;
  LoaiPhong: string;
  MaNV: string;
}

export interface Khoa {
  MaKhoa: string;
  TenKhoa: string;
  MoTa: string;
}

export interface BenhNhan {
  MaBN: string;
  HoTen: string;
  NgaySinh: string;
  SDT: string;
  DiaChi: string;
  MaPhong?: string;
}

// API functions
export const dashboardAPI = {
  // Get all schedules
  getAllLich: async (): Promise<Lich[]> => {
    const response = await axiosInstance.get(`/api/v1/lich`);
    return response.data;
  },

  // Get all invoices
  getAllHoaDon: async (): Promise<HoaDon[]> => {
    const response = await axiosInstance.get(`/api/v1/hoadon`);
    return response.data;
  },

  // Get all employees
  getAllNhanVien: async (): Promise<NhanVien[]> => {
    const response = await axiosInstance.get(`/api/v1/nhanvien/list`);
    return response.data;
  },

  // Get all rooms
  getAllPhongBenh: async (): Promise<PhongBenh[]> => {
    const response = await axiosInstance.get(`/api/v1/phongbenh`);
    return response.data;
  },

  // Get all departments
  getAllKhoa: async (): Promise<Khoa[]> => {
    const response = await axiosInstance.get(`/api/v1/khoa`);
    return response.data;
  },

  // Get all patients
  getAllBenhNhan: async (): Promise<BenhNhan[]> => {
    const response = await axiosInstance.get(`/api/v1/benhnhan`);
    return response.data;
  }
};
